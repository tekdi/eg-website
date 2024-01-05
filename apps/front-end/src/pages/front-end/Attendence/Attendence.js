import {
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  Camera,
  AdminTypo,
  FrontEndTypo,
  uploadRegistryService,
  eventService,
  Loading,
  attendanceService,
  facilitatorRegistryService,
  ImageView,
  testRegistryService,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import Chip, { ChipStatus } from "component/Chip";
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Modal,
  ScrollView,
  Stack,
  Radio,
  Switch,
  Badge,
  Input,
} from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema from "./schema";
import { useTranslation } from "react-i18next";
import Clipboard from "component/Clipboard";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { debounce } from "lodash";

const customStyles = {
  headCells: {
    style: {
      background: "#E0E0E0",
      fontSize: "14px",
      color: "#616161",
      justifyContent: "center",
    },
  },
  cells: {
    style: {
      justifyContent: "center",
      padding: "15px 0",
    },
  },
};

const renderNameColumn = (row, t) => {
  const name = row?.first_name + " " + row?.last_name;
  const hasProfileUrl = !!row?.profile_url;

  return (
    <HStack alignItems={"center"} space="2">
      {hasProfileUrl ? (
        <Avatar
          alignItems={"start"}
          source={{ uri: row?.profile_url }}
          width="30px"
          height="30px"
        />
      ) : (
        <IconByName
          name="AccountCircleLineIcon"
          color="gray.300"
          _icon={{ size: "30" }}
        />
      )}
      <AdminTypo.H7 fontWeight="400">{name}</AdminTypo.H7>
    </HStack>
  );
};
const renderIDColumn = (row, t) => {
  const ID = row?.id;

  return (
    <HStack alignItems="center" space="2">
      {ID}
    </HStack>
  );
};

const renderStatusColumn = (row, t) => (
  <Text>{row?.attendances?.[0]?.rsvp || "-"}</Text>
);

const onUpdateOrCreateAttendace = async (row) => {
  try {
    if (row?.event_id) {
      if (row?.attendance?.id) {
        const data = {
          id: row?.attendance?.id,
          user_id: row?.attendance.user_id,
          lat: `${row?.locationData?.latitude || ""}`, //attendance.lat,
          long: `${row?.locationData?.longitude || ""}`, //attendance.long,
          date_time: row?.presentDate,
          status: row?.attendance_status,
        };
        return await eventService.updateAttendance(data);
      } else {
        const data = {
          user_id: row.id,
          context_id: row?.event_id,
          context: "events",
          lat: `${row?.locationData?.latitude || ""}`, //attendance.lat,
          long: `${row?.locationData?.longitude || ""}`, //attendance.long,
          date_time: row?.presentDate,
          status: row?.attendance_status,
        };
        return await attendanceService.createAttendance(data);
      }
    }
  } catch (error) {
    // handle error
    console.error(error?.message || "error");
  }
};

const scheduleCandidates = (t, days, certificateDownload) => {
  return [
    {
      name: t("ID"),
      selector: (row) => renderIDColumn(row, t),
      sortable: false,
      attr: "name",
    },

    {
      name: t("NAME"),
      selector: (row) => renderNameColumn(row, t),
      sortable: false,
      attr: "name",
    },
    {
      name: t("INVITE_STATUS"),
      selector: (row) => renderStatusColumn(row, t),
      sortable: false,
      attr: "invite",
    },
    ...days,
    {
      name: t("SCORE"),
      selector: (row) => {
        const score = row?.lms_test_trackings?.[0]?.score;
        const roundedScore = typeof score === "number" ? score.toFixed(2) : "-";
        return roundedScore;
      },
      attr: "name",
      wrap: true,
    },

    {
      name: t("STATUS"),
      selector: (row) =>
        row?.lms_test_trackings?.[0]?.certificate_status === true ? (
          <AdminTypo.Secondarybutton
            my="3"
            onPress={() => certificateDownload(row.lms_test_trackings?.[0])}
          >
            {t("DOWNLOAD")}
          </AdminTypo.Secondarybutton>
        ) : row?.lms_test_trackings?.[0]?.certificate_status === false ? (
          <AdminTypo.H6 color="red.500">{t("FAILED")}</AdminTypo.H6>
        ) : (
          <AdminTypo.H6>{t("PENDING")}</AdminTypo.H6>
        ),
    },
  ];
};

const RenderAttendanceColumn = React.memo(({ row }) => {
  const [attendance, setAttendance] = React.useState();
  const [locationData, setLocationData] = React.useState("");
  const [isDisabledAttBtn, setIsDisabledAttBtn] = React.useState();
  const { id } = useParams();

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, (e) => {
        console.log(e);
      });
    }
  };
  const successCallback = (position) => {
    // Location was provided
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    setLocationData({ latitude: latitude, longitude: longitude });
  };

  React.useEffect(() => {
    const fetchAttendance = async () => {
      const newAttendance = row?.attendances?.find((e) => {
        const format = "YYYY-MM-DD";
        return (
          moment(e.date_time).format(format) ===
          moment(row.presentDate).format(format)
        );
      });
      setAttendance(newAttendance);
      await getLocation();
    };
    fetchAttendance();
  }, [row]);

  const onSwitchToggle = async (row) => {
    setIsDisabledAttBtn(`${row.id}-${row.presentDate}`);
    const result = await onUpdateOrCreateAttendace({
      ...row,
      event_id: id,
      locationData,
      attendance,
    });
    setAttendance(
      result?.data?.attendance
        ? { ...result?.data?.attendance, status: row?.attendance_status }
        : attendance
    );
    setIsDisabledAttBtn();
  };

  return (
    <HStack space="2">
      <AdminTypo.H7 fontWeight="400">
        {attendance?.status === "present"
          ? "Present"
          : attendance?.status === "absent"
          ? "Absent"
          : "Mark"}
      </AdminTypo.H7>
      <Switch
        key={attendance}
        isDisabled={isDisabledAttBtn === `${row.id}-${row.presentDate}`}
        offTrackColor="dangerColor"
        onTrackColor="successColor"
        onThumbColor="appliedColor"
        offThumbColor="appliedColor"
        defaultIsChecked={attendance?.status === "present"}
        onValueChange={async (e) => {
          const attendance_status = e ? "present" : "absent";
          await onSwitchToggle({
            ...row,
            attendance_status,
          });
        }}
      />
    </HStack>
  );
});

export default function Attendence({ footerLinks }) {
  const { id } = useParams();
  const [width, Height] = useWindowSize();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [users, setUsers] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [refAppBar, setRefAppBar] = React.useState();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [locationData, setLocationData] = React.useState("");
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [event, setEvent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const formRef = React.useRef();
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({});
  const [actualDates, setActualDates] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [inputValue, setInputValue] = React.useState();
  const [cameraFile, setCameraFile] = React.useState();
  const [certificateHtml, setCertificateHtml] = React.useState();
  const reportTemplateRef = React.useRef(null);
  const [filter, setFilter] = React.useState({});
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);

  const certificateDownload = async (data) => {
    const result = await testRegistryService.postCertificates(data);
    setCertificateHtml(result?.data?.[0]?.certificate_html);
  };

  const handleGeneratePdf = async () => {
    const input = reportTemplateRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l");
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };

  const getUserData = async () => {
    const result = await facilitatorRegistryService.getOne({
      id: inputValue,
    });
    if (result?.id) {
      setError();
      setFacilitator(result);
    } else {
      setError("User Data not found");
    }
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  const handleFormChange = (props) => {
    const data = props?.formData;
    setFormData({ ...formData, ...data });
  };

  const deleteCurrentEventById = async () => {
    const result = await eventService.deleteCurrentEvent({ id: id });
    if (result?.events) {
      navigate("/admin");
      setShowDeleteModal(false);
    }
  };

  const uiSchema = {
    documents_status: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true,
      },
    },
  };

  const onSubmit = async (data) => {
    const apiResponse = await eventService.editAttendanceDocumentList({
      id: formData?.user_id,
      page_type: "documents_checklist",
      documents_status: data?.documents_status,
    });
    if (apiResponse?.status === 200) {
      setFormData();
    }
    if (apiResponse?.status === 200) {
      const eventResult = await eventService.getEventListById({ id: id });
      setUsers(eventResult?.event?.attendances);
      setEvent(eventResult?.event);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  };
  const successCallback = (position) => {
    // Location was provided
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    setLocationData({ latitude: latitude, longitude: longitude });
  };

  function errorCallback(error) {
    if (error.code === error.PERMISSION_DENIED) {
      // Location access was denied by the user
      alert("Location access denied,Please Provide location access");
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      // Location information is unavailable
      console.log("Location information is unavailable.");
    } else if (error.code === error.TIMEOUT) {
      // The request to get user location timed out
      console.log("Request to get user location timed out.");
    } else {
      // Any other error occurred
      console.log("An unknown error occurred.");
    }
  }

  const getUsers = async () => {
    const result = await eventService.getAttendanceList({
      limit: 6,
      page: 1,
      order_by: { id: "desc" },
      ...filter,
      id,
    });
    setPaginationTotalRows(result?.totalCount);
    setUsers(result?.data || []);
  };

  React.useEffect(async () => {
    await getUsers();
  }, [filter]);

  React.useEffect(async () => {
    setLoading(true);
    const eventResult = await eventService.getEventListById({ id });
    setEvent(eventResult?.event);
    // please check params?.attendance_type === "one_time" condition
    if (eventResult?.event?.params?.attendance_type === "one_time") {
      setActualDates([
        {
          name: t("MARK_ATTENDANCE"),
          selector: (row) => (
            <React.Suspense fallback="...">
              <RenderAttendanceColumn {...{ row }} />
            </React.Suspense>
          ),
          sortable: false,
          attr: "marks",
        },
      ]);
    } else {
      const startMoment = moment(eventResult?.event?.start_date);
      const endMoment = moment(eventResult?.event?.end_date);
      let datesD = [];
      while (startMoment.isSameOrBefore(endMoment)) {
        datesD.push(startMoment.format("DD-MMM-YYYY"));
        startMoment.add(1, "day");
      }

      const dates = datesD?.map((e, i) => ({
        name: t(moment(e).format("DD-MMM-YYYY")),
        selector: (row) => (
          <React.Suspense fallback="...">
            <RenderAttendanceColumn
              row={{
                ...row,
                index: i,
                presentDate: `${moment(e).format("YYYY-MM-DD")}`,
              }}
            />
          </React.Suspense>
        ),
        sortable: false,
        attr: "marks",
      }));
      setActualDates(dates);
    }
    setLoading(false);
  }, []);

  const uploadAttendencePicture = async (e) => {
    // setError("");
    if (cameraFile?.key) {
      const apiResponse = await eventService.updateAttendance({
        id: userData?.id,
        status: "present",
        lat: locationData?.latitude,
        long: locationData?.longitude,
        photo_1: cameraFile ? cameraFile?.key : "",
      });
      if (apiResponse?.data) {
        const eventResult = await eventService.getEventListById({ id: id });
        setUsers(eventResult?.event?.attendances);
        setEvent(eventResult?.event);
      }
    }
  };

  const updateUserData = async () => {
    if (cameraFile?.key) {
      const apiResponse = await eventService.updateAttendance({
        id: userData?.id,
        status: "present",
        lat: locationData?.latitude,
        long: locationData?.longitude,
        photo_1: cameraFile ? cameraFile?.key : "",
      });
      if (apiResponse?.data) {
        const eventResult = await eventService.getEventListById({ id: id });
        setUsers(eventResult?.event?.attendances);
        setEvent(eventResult?.event);
      }
    } else {
      setError("Capture Picture First");
    }
  };
  const handleInputChange = (event) => {
    const inputValues = event.target.value;
    setInputValue(inputValues);
  };

  const debouncedHandleInputChange = React.useCallback(
    debounce(handleInputChange, 1000),
    []
  );

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const debouncedHandleSearch = React.useCallback(
    debounce(handleSearch, 1000),
    []
  );

  const handleAddParticipant = async (type) => {
    setIsLoadingBtn(true);
    if (type === "confirm") {
      await onUpdateOrCreateAttendace({
        id: facilitator?.id,
        event_id: id,
        locationData,
      });
      await getUsers();
      handleShowModal(false);
    } else {
      await getUserData();
    }
    setIsLoadingBtn(false);
  };

  const handleShowModal = (boolean) => {
    if (boolean) {
      setShowModal(true);
      setFacilitator();
    } else {
      setShowModal(false);
    }
    setError();
  };

  if (userData?.id) {
    return (
      <Box>
        {
          <React.Suspense fallback={<Loading />}>
            <Camera
              facing={true}
              headerComponent={
                <VStack bg="black" width="94%" pl="4">
                  <AdminTypo.H6 color="white" bold>
                    {t("MARK_ATTENDANCE_ORIENTATION")}
                  </AdminTypo.H6>
                  <HStack direction={["row", "row", "row"]}>
                    <AdminTypo.H6 color="white" bold flex="0.3">
                      {t("PRESENT")} :
                      {users.filter((e) => e.status === "present").length}
                    </AdminTypo.H6>
                    <AdminTypo.H6 color="white" bold flex="0.3">
                      {t("ABSENT")} :
                      {users.filter((e) => e.status !== "present").length}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack direction={["row", "row", "row"]}>
                    <AdminTypo.H6 color="white">
                      {t("CANDIDATES_NAME")} {userData?.user?.first_name}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <AdminTypo.H6
                      color="white"
                      direction={["row", "row", "row"]}
                    >
                      {t("CANDIDATES")} - {paginationTotalRows || 0}
                    </AdminTypo.H6>
                  </HStack>
                  <Stack>
                    <AdminTypo.H6 my="2" color="white">
                      {t("ATTENDANCE_CAMERA_SUBTITLE")}
                    </AdminTypo.H6>
                  </Stack>
                </VStack>
              }
              footerComponent={
                <HStack space={3} width="100%" justifyContent="space-between">
                  {error && (
                    <AdminTypo.H4 style={{ color: "red" }}>
                      {error}
                    </AdminTypo.H4>
                  )}
                  <AdminTypo.Secondarybutton
                    shadow="BlueOutlineShadow"
                    onPress={() => {
                      updateUserData();
                      cameraFile ? setUserData() : error;
                      setCameraFile("");
                      setCameraUrl();
                    }}
                  >
                    {t("FINISH")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.Secondarybutton
                    isDisabled={userData?.index + 1 === users.length}
                    variant="secondary"
                    ml="4"
                    px="5"
                    onPress={() => {
                      cameraFile ? uploadAttendencePicture() : error;
                    }}
                  >
                    {t("NEXT")}
                  </AdminTypo.Secondarybutton>
                </HStack>
              }
              {...{
                cameraModal,
                setCameraModal: async (item) => {
                  setUserData();
                  setCameraModal(item);
                },
                cameraUrl,
                setCameraUrl: async (url, file) => {
                  if (file) {
                    setError("");
                    let formData = new FormData();
                    formData.append("file", file);
                    const uploadDoc = await uploadRegistryService.uploadPicture(
                      formData
                    );
                    if (uploadDoc) {
                      setCameraFile(uploadDoc);
                    }
                    setCameraUrl({ url, file });
                  } else {
                    setUserData();
                  }
                },
              }}
            />
          </React.Suspense>
        }
      </Box>
    );
  }

  return (
    <Layout
      width
      _appBar={{
        isShowNotificationButton: true,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
      loading={loading}
    >
      <ScrollView
        maxH={Height - refAppBar?.clientHeight}
        minH={Height - refAppBar?.clientHeight}
      >
        <Box flex={1} bg="white" roundedBottom={"2xl"} py={6} px={4} mb={5}>
          <VStack>
            <HStack justifyContent={"space-between"}>
              <HStack space={2}>
                <IconByName isDisabled name="Home4LineIcon" />
                <AdminTypo.H4
                  onPress={() => {
                    navigate("/admin");
                  }}
                >
                  {t("HOME")}
                </AdminTypo.H4>
                <IconByName isDisabled name="ArrowRightSLineIcon" />
                <AdminTypo.H4 bold>{t("PRERAK_ORIENTATION")}</AdminTypo.H4>
              </HStack>
            </HStack>
            <Box bgColor="bgpink" borderRadius={"10px"} py="3" mt="8">
              <VStack m={"15px"}>
                <HStack justifyContent={"space-between"}>
                  <AdminTypo.H5 bold>
                    {event?.name ? event?.name : event?.type}
                  </AdminTypo.H5>
                </HStack>

                <HStack space={"3"} alignItems={"center"} flexWrap={"wrap"}>
                  <IconByName
                    name="CalendarLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H7 bold color="textGreyColor.800" space="1">
                    {event?.start_date
                      ? moment(event?.start_date).format("MMM DD, Y")
                      : ""}
                  </AdminTypo.H7>
                  <AdminTypo.H7 bold color="textGreyColor.800">
                    {event?.start_time
                      ? moment(event?.start_time, "HH:mm:ssA").format("hh:mm A")
                      : "-"}
                  </AdminTypo.H7>
                  to
                  <AdminTypo.H7 bold color="textGreyColor.800">
                    {event?.end_date
                      ? moment(event?.end_date).format("MMM DD, Y")
                      : ""}
                  </AdminTypo.H7>
                  <AdminTypo.H7 bold color="textGreyColor.800">
                    {event?.end_time
                      ? moment(event?.end_time, "HH:mm:ssZ").format("hh:mm A")
                      : "-"}
                    {/* 16th April, 11:00 to 12:00 */}
                  </AdminTypo.H7>
                  <IconByName
                    name="MapPinLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H6>{event?.location}</AdminTypo.H6>
                  <IconByName
                    name="UserLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H6>{t("MASTER_TRAINER")} -</AdminTypo.H6>
                  <Box
                    bgColor="white"
                    alignItems={"center"}
                    borderRadius={"10px"}
                  >
                    <Badge alignSelf="center" bg="white" borderRadius="5px">
                      {event?.master_trainer ? event?.master_trainer : ""}
                    </Badge>
                  </Box>
                </HStack>
              </VStack>
            </Box>
            <Stack mt={"20px"} space={"3"} py="2">
              <HStack space={"4"} direction={["column", "column", "row"]}>
                <HStack>
                  <IconByName isDisabled name="UserLineIcon" color="gray" />
                  <AdminTypo.H4 bold>
                    {t("CANDIDATES")} {users?.length}
                  </AdminTypo.H4>
                </HStack>
                <HStack justifyContent={"space-between"} space={10}>
                  <AdminTypo.Secondarybutton
                    onPress={(e) => {
                      setShowModal(true);
                      setFacilitatorProfile();
                    }}
                    endIcon={
                      <IconByName name="AddFillIcon" _icon={{ size: "15" }} />
                    }
                  >
                    {t("ADD_PARTICIPANTS")}
                  </AdminTypo.Secondarybutton>
                  <Input
                    // value={filter?.search}
                    maxLength={12}
                    name="numberInput"
                    placeholder={t("SEARCH")}
                    variant="outline"
                    onChange={debouncedHandleSearch}
                  />
                </HStack>
              </HStack>
            </Stack>
            <Modal
              avoidKeyboard
              size="xl"
              isOpen={showModal}
              onClose={() => handleShowModal(false)}
            >
              <Modal.Content>
                <Modal.Header textAlign={"Center"}>
                  <AdminTypo.H4 color="textMaroonColor.500">
                    {t("ADD_PARTICIPANTS")}
                  </AdminTypo.H4>
                </Modal.Header>
                <Modal.Body>
                  {error && (
                    <AdminTypo.H4 style={{ color: "red" }}>
                      {error}
                    </AdminTypo.H4>
                  )}
                  {!facilitator?.id ? (
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-evenly"}
                    >
                      {t("USER_ID")}:
                      <Input
                        maxLength={12}
                        name="numberInput"
                        onChange={debouncedHandleInputChange}
                      />
                    </HStack>
                  ) : (
                    <VStack flex={1} space={"5"} p="3" mb="5">
                      <HStack alignItems={"center"} space="1" pt="3">
                        <IconByName name="UserLineIcon" size="md" />
                        <AdminTypo.H4
                          color="textGreyColor.800"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {facilitator?.first_name} {facilitator?.last_name}
                        </AdminTypo.H4>
                        <IconByName size="sm" name="ArrowRightSLineIcon" />
                        <Clipboard text={facilitator?.id}>
                          <Chip
                            textAlign="center"
                            lineHeight="15px"
                            label={facilitator?.id}
                          />
                        </Clipboard>
                      </HStack>
                      <HStack justifyContent={"space-between"} flexWrap="wrap">
                        <VStack space="4" flexWrap="wrap">
                          <ChipStatus status={facilitator?.status} />
                          <HStack
                            bg="textMaroonColor.600"
                            rounded={"md"}
                            alignItems="center"
                            p="2"
                          >
                            <IconByName
                              _icon={{ size: "20px" }}
                              name="CellphoneLineIcon"
                              color="white"
                            />
                            <AdminTypo.H6 color="white" bold>
                              {facilitator?.mobile}
                            </AdminTypo.H6>
                          </HStack>
                          <HStack
                            bg="textMaroonColor.600"
                            rounded={"md"}
                            p="2"
                            alignItems="center"
                            space="2"
                          >
                            <IconByName
                              _icon={{ size: "20px" }}
                              name="MapPinLineIcon"
                              color="white"
                            />
                            <AdminTypo.H6 color="white" bold>
                              {[
                                facilitator?.state,
                                facilitator?.district,
                                facilitator?.block,
                                facilitator?.village,
                                facilitator?.grampanchayat,
                              ]
                                .filter((e) => e)
                                .join(", ")}
                            </AdminTypo.H6>
                          </HStack>
                        </VStack>
                        <HStack justifyContent="center">
                          {facilitator?.profile_photo_1?.name ? (
                            <ImageView
                              source={{
                                uri: facilitator?.profile_photo_1?.name,
                              }}
                              alt="profile photo"
                              width={"100px"}
                              height={"100px"}
                            />
                          ) : (
                            <IconByName
                              name="AccountCircleLineIcon"
                              color="white"
                              _icon={{ size: "100px" }}
                            />
                          )}
                        </HStack>
                      </HStack>
                    </VStack>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <HStack justifyContent={"space-between"} width={"100%"}>
                    {facilitator?.id && (
                      <AdminTypo.PrimaryButton
                        isLoading={isLoadingBtn}
                        shadow="BlueFillShadow"
                        onPress={async (e) =>
                          await handleAddParticipant("confirm")
                        }
                      >
                        {t("CONFIRM")}
                      </AdminTypo.PrimaryButton>
                    )}
                    <AdminTypo.Secondarybutton
                      isLoading={isLoadingBtn}
                      onPress={() => handleShowModal(false)}
                    >
                      {t("CANCEL")}
                    </AdminTypo.Secondarybutton>
                    {!facilitator?.id && (
                      <AdminTypo.PrimaryButton
                        isLoading={isLoadingBtn}
                        onPress={handleAddParticipant}
                      >
                        {t("Submit")}
                      </AdminTypo.PrimaryButton>
                    )}
                  </HStack>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            {/* delete modal */}

            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              size="sm"
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body p="1" bg="white">
                  <AdminTypo.H2
                    textAlign="center"
                    pt="2"
                    color="textGreyColor.500"
                  >
                    {t("DELETE_EVENT")}
                  </AdminTypo.H2>

                  <VStack space={5}>
                    <HStack
                      alignItems="center"
                      space={4}
                      mt="5"
                      pt="4"
                      borderTopWidth="1px"
                      bg="white"
                      borderTopColor="appliedColor"
                      justifyContent="center"
                    >
                      <AdminTypo.Secondarybutton
                        shadow="BlueOutlineShadow"
                        onPress={() => {
                          setShowDeleteModal(false);
                        }}
                      >
                        {t("NO")}
                      </AdminTypo.Secondarybutton>
                      <AdminTypo.PrimaryButton
                        px="8"
                        shadow="BlueFillShadow"
                        onPress={() => deleteCurrentEventById()}
                      >
                        {t("YES")}
                      </AdminTypo.PrimaryButton>
                    </HStack>
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal
              isOpen={formData?.id}
              onClose={() => {
                setFormData();
              }}
              size="xl"
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body p="1" pb="0" bg="white">
                  <AdminTypo.H2
                    textAlign="center"
                    pt="2"
                    color="textGreyColor.500"
                  >
                    {t("EDIT_DETAILS")}
                  </AdminTypo.H2>
                  <VStack space="5">
                    <HStack space="5" pl="2" alignItems="center">
                      {formData?.profile_url ? (
                        <Avatar
                          source={{
                            uri: formData?.profile_url,
                          }}
                          // alt="Alternate Text"
                          width={"35px"}
                          height={"35px"}
                        />
                      ) : (
                        <IconByName
                          name="AccountCircleLineIcon"
                          color="textGreyColor.800"
                          _icon={{ size: "40" }}
                        />
                      )}
                      <AdminTypo.H4 color="textGreyColor.800">
                        {formData?.user?.first_name +
                          " " +
                          formData?.user?.last_name}
                      </AdminTypo.H4>
                    </HStack>

                    <HStack alignItems="center" space={2}>
                      <VStack p="3" space="5" width="100%">
                        <HStack
                          alignItems="center"
                          space={"2"}
                          pb="3"
                          borderBottomWidth="1px"
                          bg="white"
                          borderBottomColor="appliedColor"
                        >
                          <IconByName
                            name="VidiconLineIcon"
                            color="textGreyColor.800"
                            _icon={{ size: "20" }}
                            px="2"
                          />

                          <AdminTypo.H6 color="textGreyColor.100" pr="6">
                            {t("EVENT_TYPE")}
                          </AdminTypo.H6>
                          <HStack alignItems="center" space={"2"}>
                            <AdminTypo.H5>
                              {event?.name ? event?.name : event?.type}
                            </AdminTypo.H5>
                          </HStack>
                        </HStack>
                        <HStack
                          alignItems="center"
                          space={"2"}
                          pb="3"
                          borderBottomWidth="1px"
                          bg="white"
                          borderBottomColor="appliedColor"
                        >
                          <IconByName
                            name="MapPinLineIcon"
                            color="textGreyColor.800"
                            _icon={{ size: "20" }}
                            px="2"
                          />

                          <AdminTypo.H6 color="textGreyColor.100">
                            {t("MARK_ATTENDANCE")}
                          </AdminTypo.H6>
                          <HStack alignItems="center" space={"2"} p="1">
                            <Radio.Group
                              flexDirection={"row"}
                              fontSize="10px"
                              gap={"2"}
                              name="myRadioGroup"
                              accessibilityLabel="favorite number"
                              value={
                                formData?.status !== "present"
                                  ? "absent"
                                  : "present"
                              }
                            >
                              <Radio
                                value="present"
                                my={1}
                                color="textGreyColor.800"
                                fontSize="10px"
                              >
                                <AdminTypo.H6 color="textGreyColor.800" pl="2">
                                  {t("PRESENT")}
                                </AdminTypo.H6>
                              </Radio>

                              <Radio
                                value="absent"
                                my={1}
                                ml="2"
                                color="textGreyColor.800"
                                fontSize="sm"
                              >
                                <AdminTypo.H6 color="textGreyColor.800" pl="2">
                                  {t("ABSENT")}
                                </AdminTypo.H6>
                              </Radio>
                            </Radio.Group>
                          </HStack>
                        </HStack>

                        <HStack
                          alignItems="center"
                          space={"2"}
                          pb="3"
                          borderBottomWidth="1px"
                          bg="white"
                          borderBottomColor="appliedColor"
                        >
                          <IconByName
                            name="CheckboxCircleLineIcon"
                            color="textGreyColor.800"
                            _icon={{ size: "20" }}
                            px="2"
                          />
                          <AdminTypo.H6 color="textGreyColor.100">
                            {t("COMPLETE_AADHAR_KYC")}
                          </AdminTypo.H6>
                          <HStack alignItems="center" space={"2"} p="1">
                            {formData?.user?.aadhar_verified !== null &&
                            formData?.user?.aadhar_verified !== "pending" &&
                            formData?.user?.aadhar_verified !==
                              "in_progress" ? (
                              <AdminTypo.H3 style={{ color: "green" }}>
                                {t("YES")} (
                                {formData?.user?.aadhaar_verification_mode !==
                                null
                                  ? formData?.user?.aadhaar_verification_mode
                                  : ""}
                                )
                              </AdminTypo.H3>
                            ) : (
                              <HStack space="3">
                                <AdminTypo.H5 style={{ color: "red" }}>
                                  {formData?.user?.aadhar_verified ===
                                  "in_progress"
                                    ? t("AADHAR_KYC_IN_PROGRESS")
                                    : formData?.user?.aadhar_verified ===
                                      "pending"
                                    ? t("AADHAR_KYC_PENDING")
                                    : t("NO")}
                                </AdminTypo.H5>
                                <FrontEndTypo.Secondarysmallbutton
                                  background="red.300"
                                  children={t("AADHAAR_EKYC")}
                                  onPress={() => {
                                    navigate(
                                      `/aadhaar-kyc/${formData?.user_id}`,
                                      {
                                        state: `/attendence/${formData?.context_id}`,
                                      }
                                    );
                                  }}
                                />
                              </HStack>
                            )}
                          </HStack>
                        </HStack>
                        <VStack space={5}>
                          <Form
                            schema={schema}
                            ref={formRef}
                            uiSchema={uiSchema}
                            formData={formData || {}}
                            validator={validator}
                            onChange={handleFormChange}
                            onSubmit={onSubmit}
                          >
                            <HStack
                              alignItems="center"
                              space={3}
                              mt="5"
                              pt="4"
                              borderTopWidth="1px"
                              bg="white"
                              borderTopColor="appliedColor"
                              justifyContent={"space-between"}
                            >
                              <AdminTypo.Secondarybutton
                                shadow="BlueOutlineShadow"
                                onPress={() => {
                                  setFormData();
                                }}
                              >
                                {t("CANCEL")}
                              </AdminTypo.Secondarybutton>
                              <AdminTypo.PrimaryButton
                                px="8"
                                shadow="BlueFillShadow"
                                onPress={() => onSubmit(formData)}
                              >
                                {t("SAVE")}
                              </AdminTypo.PrimaryButton>
                            </HStack>
                          </Form>
                        </VStack>
                      </VStack>
                    </HStack>
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>
            <DataTable
              columns={[
                ...scheduleCandidates(t, actualDates, certificateDownload),
              ]}
              key={users}
              // filter={filter}
              data={users}
              subHeader
              persistTableHead
              progressPending={loading}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={paginationTotalRows}
              paginationRowsPerPageOptions={[6, 10, 15, 25, 50, 100]}
              paginationPerPage={filter?.limit ? filter?.limit : 6}
              paginationDefaultPage={filter?.page}
              onChangeRowsPerPage={React.useCallback(
                (e) => {
                  setFilter({ ...filter, limit: e, page: 1 });
                },
                [filter]
              )}
              onChangePage={React.useCallback(
                (e) => {
                  setFilter({ ...filter, page: e });
                },
                [filter]
              )}
            />
          </VStack>
        </Box>
      </ScrollView>
      <Modal isOpen={certificateHtml} size="xl">
        <Modal.Content>
          <Modal.Header>
            <HStack justifyContent={"space-between"} pr="10">
              <AdminTypo.H1>{t("CERTIFICATION")}</AdminTypo.H1>
              <AdminTypo.Secondarybutton onPress={() => handleGeneratePdf()}>
                {t("DOWNLOAD")}
              </AdminTypo.Secondarybutton>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setCertificateHtml()}
              />
            </HStack>
          </Modal.Header>
          <Modal.Body
            style={{
              backgroundColor: "#f5f5f5",
              width: "297mm",
              minHeight: "210mm",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div ref={reportTemplateRef}>
              <div dangerouslySetInnerHTML={{ __html: certificateHtml }} />
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
