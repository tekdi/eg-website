import {
  H1,
  H4,
  IconByName,
  AdminLayout as Layout,
  t,
  changeLanguage,
  facilitatorRegistryService,
  useWindowSize,
  Camera,
  getBase64,
  AdminTypo,
  FrontEndTypo,
  uploadRegistryService,
  eventService,
  Loading,
  enumRegistryService,
  getOptions,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import Chip, { ChipStatus } from "component/Chip";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Avatar,
  Modal,
  ScrollView,
  Stack,
  Select,
  Radio,
  Checkbox,
  Switch,
  Badge,
  Input,
} from "native-base";
import React, { Suspense, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import { useNavigate } from "react-router-dom";
import schema from "./schema";
import orientationPopupSchema from "../orientation/orientationPopupSchema";

import { HFieldTemplate, templates, widgets } from "component/BaseInput";
import OrientationScreen from "../orientation/OrientationScreen";

const styles = {
  modalxxl: {
    maxWidth: "950px",
    width: "100%",
    height: "100%",
  },
};
const customStyles = {
  headCells: {
    style: {
      background: "#E0E0E0",
      fontSize: "14px",
      color: "#616161",
    },
  },
  cells: {
    style: {
      padding: "15px 0",
    },
  },
};

export default function Attendence({ footerLinks }) {
  const { id } = useParams();
  const [Height] = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [userIds, setUserIds] = React.useState({});
  const [errors, setErrors] = useState({});
  const [users, setUsers] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [refAppBar, setRefAppBar] = React.useState();
  const [rowData, setRowData] = React.useState();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [locationData, setlocationData] = useState("");
  const [attendance, setAttendance] = React.useState("");
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [event, setEvent] = useState("");
  const [loading, setLoading] = React.useState(true);
  const uplodInputRef = React.useRef();
  const formRef = React.useRef();
  const eventFormRef = React.useRef();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const nowDate = new Date();
  const [enventSchema, setEnventSchema] = useState({});
  const [userData, setUserData] = useState({});
  const [cameraFile, setcameraFile] = useState();
  useEffect(() => {
    getLocation();
  }, []);

  React.useEffect(() => {
    setEvent({
      ...event,
      attendees:
        userIds !== undefined ? Object.values(userIds).map((e) => e?.id) : "",
    });
  }, [userIds]);

  function convertToIST(utcTime) {
    const utcMoment = moment.utc(utcTime, "HH:mm:ssZ");
    const istMoment = utcMoment.local().utcOffset("+05:30");
    const formattedIST = istMoment.format("hh:mm:ss A"); // Using 'hh:mm:ss A' for AM/PM format
    return formattedIST;
  }

  const SelectButton = ({ required }) => (
    <HStack space={"4"} direction={["column", "row"]}>
      <HStack flex={["1", "1", "1"]} alignItems="center" space={"2"}>
        <IconByName
          name="UserLineIcon"
          color="textGreyColor.200"
          isDisabled
          _icon={{ size: "14px" }}
        />
        <AdminTypo.H6 color="textGreyColor.100">
          {t("SELECT_CANDIDATE")}
        </AdminTypo.H6>

        <AdminTypo.H6 color="textGreyColor.100">
          {required ? "*" : null}
        </AdminTypo.H6>
      </HStack>
      <HStack alignItems="center" flex={["1", "3", "4"]}>
        <AdminTypo.Secondarybutton
          leftIcon={
            <Text>
              {users
                ? Object.values(users).length
                : userIds
                ? Object.values(userIds).length
                : ""}
            </Text>
          }
          onPress={() => setIsOpen(true)}
          flex="1"
        >
          {t("SELECT_PRERAK")}
        </AdminTypo.Secondarybutton>
      </HStack>
    </HStack>
  );
  const onSwitchToggle = async (value) => {
    getLocation();
    setCameraUrl();
    if (value?.status !== "present") {
      setCameraModal(true);
      setUserData({ ...value, index: showIndexes(users, value, "C") });
    }
  };

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

  const uiEventSchema = {
    attendees: {
      "ui:widget": SelectButton,
    },
    start_date: {
      "ui:widget": "alt-datetime",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, 2030],
      },
    },
    end_date: {
      "ui:widget": "alt-datetime",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, 2030],
      },
    },
    reminders: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true,
      },
    },
    start_time: {
      "ui:widget": "hidden",
    },
    end_time: {
      "ui:widget": "hidden",
    },
  };

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    let newSchema = orientationPopupSchema;
    newSchema = getOptions(newSchema, {
      key: "reminders",
      arr: result?.data?.REMINDERS.map((e) => ({ ...e, title: t(e.title) })),
      title: "title",
      value: "value",
    });
    newSchema = getOptions(newSchema, {
      key: "type",
      arr: result?.data?.FACILITATOR_EVENT_TYPE.map((e) => ({
        ...e,
        title: t(e.title),
      })),
      title: "title",
      value: "value",
    });
    setEnventSchema(newSchema);
  }, [event]);

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

  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      } else if (error.name === "format") {
        const { format } = error?.params ? error?.params : {};
        let message = "REQUIRED_MESSAGE";
        if (format === "email") {
          message = "PLEASE_ENTER_VALID_EMAIL";
        }
        if (format === "string") {
          message = "PLEASE_ENTER_VALID_STREING";
        } else if (format === "number") {
          message = "PLEASE_ENTER_VALID_NUMBER";
        }

        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t(message)} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t(message)}`;
        }
      }
      return error;
    });
  };

  const onChange = async (data, id) => {
    setErrors({});
    // formRef?.current?.validateForm();
    const newData = data.formData;
    setEvent({ ...formData, ...newData });
    if (newData?.end_date) {
      if (
        moment.utc(newData?.start_date).isAfter(moment.utc(newData?.end_date))
      ) {
        const newErrors = {
          end_date: {
            __errors: [t("EVENT_CREATE_END_DATE_GREATERE_THAN_START_DATE")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (moment.utc(newData?.start_date) < moment.utc(nowDate)) {
      const newErrors = {
        start_date: {
          __errors: [t("EVENT_CREATE_BACK_DATES_NOT_ALLOWED_START_DATE")],
        },
      };
      setErrors(newErrors);
    }

    if (moment.utc(newData?.end_date) < moment.utc(nowDate)) {
      const newErrors = {
        end_date: {
          __errors: [t("EVENT_CREATE_BACK_DATES_NOT_ALLOWED_END_DATE")],
        },
      };
      setErrors(newErrors);
    }
  };
  const clearForm = () => {
    setUserIds({});
    setEvent();
  };
  const scheduleCandidates = (e) => [
    {
      name: t("NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          {row?.profile_url ? (
            <Avatar
              source={{
                uri: row?.profile_url,
              }}
              // alt="Alternate Text"
              width={"35px"}
              height={"35px"}
            />
          ) : (
            <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              color="gray.300"
              _icon={{ size: "35" }}
            />
          )}
          <Text>{row?.user?.first_name + " " + row?.user?.last_name}</Text>
        </HStack>
      ),
      sortable: false,
      attr: "name",
    },
    {
      name: t("INVITE_STATUS"),
      selector: (row) => {
        <Text>{row?.rsvp ? row?.rsvp : ""}</Text>;
      },
      sortable: false,
      attr: "email",
    },
    {
      name: t("MARK_ATTENDANCE"),
      selector: (row) => (
        <>
          <HStack space={"2"}>
            <Text key={row?.id}>
              {row?.status === "present" ? "Present" : "Absent"}
            </Text>
            <Switch
              // defaultIsChecked
              offTrackColor="#DC2626"
              onTrackColor="#00D790"
              onThumbColor="#E0E0E0"
              offThumbColor="#E0E0E0"
              value={row.status === "present" ? true : false}
              onValueChange={() => {
                onSwitchToggle(row);
              }}
            />
          </HStack>
        </>
      ),
      sortable: false,
      attr: "marks",
    },
    {
      name: t("ADHAR_KYC"),
      selector: (row, index) => (
        <Chip
          bg={
            row?.user?.aadhar_verified !== null
              ? "potentialColor"
              : "dangerColor"
          }
          label={row?.user?.aadhar_verified !== null ? t("YES") : t("NO")}
          rounded={"sm"}
        />
      ),
      sortable: false,
      attr: "adhar_kyc",
    },

    {
      name: t("ATTENDEE_LIST_ATTENDENCE_VERIFIED"),
      selector: (row, index) => (
        <Chip
          label={
            row?.fa_is_processed === null
              ? "-"
              : row?.fa_is_processed === true
              ? t("YES") +
                " " +
                Math.floor(row?.fa_similarity_percentage * 100) / 100 +
                "%"
              : t("NO")
          }
          rounded={"sm"}
        />
      ),
      sortable: false,
      attr: "attendence_verified",
    },
    // {
    //   name: t("VERIFIED_DOCUMENTS"),
    //   selector: (row) => row?.gender,
    //   sortable: false,
    //   attr: "city",
    // },
  ];
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  function successCallback(position) {
    // Location was provided
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    setlocationData({ latitude: latitude, longitude: longitude });
    console.log("Latitude ", "Longitude");
  }

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

  React.useEffect(async () => {
    setLoading(true);
    const eventResult = await eventService.getEventListById({ id: id });
    setUsers(eventResult?.event?.attendances);
    setEvent(eventResult?.event);
    setPaginationTotalRows(eventResult?.totalCount);
    setLoading(false);
  }, [filterObj]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);

  const uploadAttendencePicture = async (e) => {
    setError("");
    if (cameraFile?.key) {
      const apiResponse = await eventService.updateAttendance({
        id: userData?.id,
        status: "present",
        lat: locationData?.latitude,
        long: locationData?.longitude,
        photo_1: cameraFile ? cameraFile?.key : "",
      });
      if (apiResponse?.status === 200) {
        const eventResult = await eventService.getEventListById({ id: id });
        setUsers(eventResult?.event?.attendances);
        setEvent(eventResult?.event);
      }
    } else {
      setError("Capture Picture First");
    }
    const coruntIndex = users.findIndex((item) => item?.id === userData?.id);
    if (users[coruntIndex + 1]) {
      setCameraUrl();
      setUserData({ ...users[coruntIndex + 1], index: coruntIndex + 1 });
    }
  };
  const showIndexes = (users, userData, state) => {
    const coruntIndex = users.findIndex((item) => item?.id === userData?.id);
    if (state === "C") {
      return coruntIndex;
    }
    if (state === "N") {
      return coruntIndex + 1;
    }
    if (state === "P") {
      return coruntIndex - 1;
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
      if (apiResponse?.status === 200) {
        const eventResult = await eventService.getEventListById({ id: id });
        setUsers(eventResult?.event?.attendances);
        setEvent(eventResult?.event);
      }
    } else {
      setError("Capture Picture First");
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  if (userData?.id) {
    return (
      <Box>
        {
          <React.Suspense fallback={<Loading />}>
            <Camera
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
                      {t("CANDIDATES")} - {users?.length ? users?.length : 0}
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
                      // setCameraModal(false);
                      setcameraFile("");
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
                      setcameraFile(uploadDoc);
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
      _appBar={{
        isShowNotificationButton: true,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
    >
      <ScrollView
        maxH={Height - refAppBar?.clientHeight}
        minH={Height - refAppBar?.clientHeight}
      >
        <Box flex={1} bg="white" roundedBottom={"2xl"} py={6} px={4} mb={5}>
          <VStack>
            <HStack justifyContent={"space-between"}>
              <HStack>
                <IconByName
                  isDisabled
                  name="Home4LineIcon"
                  color="gray.300"
                  _icon={{ size: "35" }}
                />
                <AdminTypo.H2
                  pl="3"
                  onPress={() => {
                    navigate("/admin");
                  }}
                >
                  {t("HOME")}
                </AdminTypo.H2>
                <IconByName
                  isDisabled
                  name="ArrowRightSLineIcon"
                  color="gray.300"
                  _icon={{ size: "35" }}
                />
                <AdminTypo.H2>{t("PRERAK_ORIENTATION")}</AdminTypo.H2>
              </HStack>
              {/* <HStack>
              <AdminTypo.Secondarybutton
                shadow="BlueOutlineShadow"
                // onPress={() => setModal(true)}
                rightIcon={
                  <IconByName
                    color="#084B82"
                    _icon={{}}
                    size="15px"
                    name="AddLineIcon"
                  />
                }
              >
                {t("SCHEDULE_EVENT")}{" "}
              </AdminTypo.Secondarybutton>
            </HStack> */}
            </HStack>
            <Box
              bgColor="blueText.300"
              shadow="BlueBoxShadow"
              borderRadius={"10px"}
              py="3"
              mt="8"
            >
              <VStack m={"15px"}>
                <HStack justifyContent={"space-between"}>
                  <AdminTypo.H6 color="textGreyColor.800" bold>
                    {event?.name ? event?.name : event?.type}
                  </AdminTypo.H6>
                  <AdminTypo.Secondarybutton
                    shadow="BlueOutlineShadow"
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    {t("EDIT_DETAILS")}
                  </AdminTypo.Secondarybutton>
                  <Box>
                    <AdminTypo.Secondarybutton
                      onPress={() => setShowDeleteModal(true)}
                      shadow="BlueOutlineShadow"
                    >
                      {t("DELETE_EVENT")}
                    </AdminTypo.Secondarybutton>
                  </Box>
                </HStack>

                <HStack
                  space={"3"}
                  pt="4"
                  direction={["column", "column", "row"]}
                >
                  <IconByName
                    isDisabled
                    name="TimeLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H6 color="textGreyColor.800">
                    {event?.start_date
                      ? moment(event?.start_date).format("Do MMM")
                      : ""}{" "}
                    {event?.start_time ? convertToIST(event?.start_time) : ""}
                    {/* 16th April, 11:00 to 12:00 */}
                  </AdminTypo.H6>
                  <IconByName
                    isDisabled
                    name="MapPinLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H6 color="textGreyColor.800">
                    {event?.location}
                  </AdminTypo.H6>
                  <IconByName
                    isDisabled
                    name="UserLineIcon"
                    color="textGreyColor.800"
                    _icon={{ size: "15" }}
                  />
                  <AdminTypo.H6 color="textGreyColor.800">
                    {t("MASTER_TRAINER")} -
                  </AdminTypo.H6>
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
                  <IconByName
                    isDisabled
                    name="UserLineIcon"
                    color="gray"
                    _icon={{ size: "35" }}
                  />
                  <AdminTypo.H3 color="textGreyColor.800" bold>
                    {t("CANDIDATES")} {users?.length}
                  </AdminTypo.H3>
                </HStack>
                <HStack>
                  <AdminTypo.Secondarybutton
                    shadow="BlueOutlineShadow"
                    onPress={(e) => {
                      setCameraModal(true);
                      setUserData(
                        users?.[0] ? { ...users?.[0], index: 0 } : {}
                      );
                    }}
                    endIcon={
                      <IconByName
                        isDisabled
                        name="AddFillIcon"
                        _icon={{ size: "15" }}
                      />
                    }
                  >
                    {t("MARK_ATTENDANCE_ALL")}
                  </AdminTypo.Secondarybutton>
                </HStack>
              </HStack>
            </Stack>

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
                    <HStack
                      space="5"
                      borderBottomWidth={1}
                      borderBottomColor="gray.300"
                      pb="5"
                    ></HStack>
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
                          isDisabled
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
                            isDisabled
                            name="VidiconLine"
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
                            isDisabled
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
                              onChange={(nextValue) => {
                                setAttendance(nextValue);
                              }}
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
                            isDisabled
                            name="CheckboxCircleLineIcon"
                            color="textGreyColor.800"
                            _icon={{ size: "20" }}
                            px="2"
                          />
                          <AdminTypo.H6 color="textGreyColor.100">
                            {t("COMPLETE_AADHAR_KYC")}
                          </AdminTypo.H6>
                          <HStack alignItems="center" space={"2"} p="1">
                            {formData?.user?.aadhar_verified !== null ? (
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
                                  {t("NO")}
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
                            formData={formData ? formData : {}}
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
                ...scheduleCandidates(),
                {
                  name: t(""),
                  selector: (row) => (
                    <Button
                      onPress={() => {
                        setFormData({
                          ...row,
                          documents_status: JSON.parse(
                            row?.user?.program_faciltators[0]?.documents_status
                          ),
                        });
                      }}
                    >
                      <IconByName
                        isDisabled
                        name="EditBoxLineIcon"
                        color="gray"
                        _icon={{ size: "15" }}
                      />
                    </Button>
                  ),
                },
              ]}
              key={users}
              data={users}
              subHeader
              persistTableHead
              // progressPending={loading}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={paginationTotalRows}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={(e) => setLimit(e)}
              // onChangePage={(e) => setPage(e)}
            />
          </VStack>
          <Modal
            isOpen={modalVisible}
            onClose={() => {
              setModalVisible(false), clearForm();
            }}
            avoidKeyboard
          >
            <Modal.Content {...styles.modalxxl}>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0" bg="white">
                <AdminTypo.H1 textAlign="center" bold>
                  {t("SCHEDULE_EVENT")}
                </AdminTypo.H1>
              </Modal.Header>

              <Modal.Body pt="4" pb="10" bg="white">
                <Suspense fallback={<div>Loading... </div>}>
                  <Form
                    ref={eventFormRef}
                    templates={{
                      ...templates,
                      FieldTemplate: HFieldTemplate,
                    }}
                    extraErrors={errors}
                    showErrorList={false}
                    noHtml5Validate={true}
                    formData={event ? event : {}}
                    // liveValidate
                    uiSchema={uiEventSchema}
                    {...{
                      widgets,
                      validator,
                      schema: enventSchema ? enventSchema : {},
                      onChange,
                      onSubmit,
                      transformErrors,
                    }}
                  >
                    <button style={{ display: "none" }} />
                  </Form>
                </Suspense>
              </Modal.Body>
              <Modal.Footer justifyContent={"space-between"}>
                <AdminTypo.Secondarybutton
                  onPress={() => {
                    setModalVisible(false);
                    clearForm();
                  }}
                  shadow="BlueOutlineShadow"
                >
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    eventFormRef?.current?.submit();
                  }}
                  shadow="BlueFillShadow"
                >
                  {t("SEND_INVITES")}
                </AdminTypo.PrimaryButton>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <OrientationScreen
            {...{ isOpen, setIsOpen, userIds, setUserIds, users }}
          />
        </Box>
      </ScrollView>
    </Layout>
  );
}
