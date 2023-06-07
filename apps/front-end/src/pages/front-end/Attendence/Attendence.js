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
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { ChipStatus } from "component/Chip";
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
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import { useNavigate } from "react-router-dom";
import schema from "./schema";

const stylesheet = {
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
const columns = (e) => [
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
        <Text textOverflow="ellipsis">
          {row?.first_name + " " + row.last_name}
        </Text>
      </HStack>
    ),
    sortable: false,
    attr: "name",
  },
  {
    name: t("QUALIFICATION"),
    selector: (row) =>
      row?.qualifications?.map((val) => {
        return " " + val.qualification_master.name;
      }),
    sortable: false,
    attr: "qualification",
  },
  {
    name: t("REGION"),
    selector: (row) => (row?.district ? row?.district : ""),
    sortable: false,
    attr: "city",
  },
  {
    name: t("ELIGIBILITY"),
    selector: (row) => row?.gender,
    sortable: false,
    attr: "city",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => <ChipStatus key={index} status={row?.status} />,
    sortable: false,
    attr: "email",
  },
  {
    name: t("COMMENT"),
    // selector: (row, index) => <ChipStatus key={index} status={row?.status} />,
    sortable: false,
    attr: "email",
  },
];

export default function Attendence() {
  const { id } = useParams();
  const [Height] = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [refAppBar, setRefAppBar] = React.useState();
  const [rowData, setRowData] = React.useState();
  const [showEditModal, setShowEditModal] = React.useState(false);

  const [locationData, setlocationData] = useState("");
  const [attendance, setAttendance] = React.useState("");
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [event, setEvent] = useState("");
  const [loading, setLoading] = React.useState(true);
  const uplodInputRef = React.useRef();
  const formRef = React.useRef();

  const [ids, setids] = useState("");
  const [singleUser, setsingleUser] = useState("");
  const [formData, setFormData] = useState({});

  const [userData, setUserData] = useState({});

  const [cameraFile, setcameraFile] = useState();
  useEffect(() => {
    getLocation();
  }, []);

  const onSwitchToggle = async (value) => {
    setsingleUser(value);
    getLocation();
    if (value?.status !== "present") {
      setCameraModal(true);
      setUserData({ ...value, index: showIndexes(users, value, "C") });
    }
  };

  const handleFormChange = ({ formData }) => {
    setFormData(formData);
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
    console.log(data?.documents_status, "data?.documents_status");
    const apiResponse = await eventService.editAttendanceDocumentList({
      id: ids?.user_id,
      page_type: "documents_checklist",
      documents_status: data?.documents_status,
    });
    if (apiResponse) {
      setShowEditModal(false);
    }
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
      selector: (row) => <Text color={"#00D790"}>Accepted</Text>,
      sortable: false,
      attr: "email",
    },
    {
      name: t("MARK_ATTENDANCE"),
      selector: (row) => (
        <>
          <HStack space={"2"}>
            <Text>{row?.status === "present" ? "Present" : "Absent"}</Text>
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
        <ChipStatus key={index} status={row?.aadhar_verified} />
      ),
      sortable: false,
      attr: "adhar_kyc",
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
    console.log("Latitude: " + latitude + ", Longitude: " + longitude);
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
    console.log("cameraUrl", cameraUrl?.file);
    // if (e === "submit") {
    let formData = new FormData();
    formData.append("file", cameraUrl?.file);
    const uploadDoc = await uploadRegistryService.uploadPicture(formData);
    if (uploadDoc) {
      setcameraFile(uploadDoc);
    }
    setCameraUrl();
    // }
    const coruntIndex = users.findIndex((item) => item?.id === userData?.id);
    if (users[coruntIndex + 1]) {
      setCameraUrl();
      setUserData({ ...users[coruntIndex + 1], index: coruntIndex + 1 });
    }
  };
  const handleCandidateSelectRow = (state) => {
    setRowData(state);
    // setShowEditModal(true);
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
        id: singleUser?.id,
        status: "present",
        lat: locationData?.latitude,
        long: locationData?.longitude,
        photo_1: cameraFile ? cameraFile?.key : "",
      });
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  return (
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
              <AdminTypo.H2 pl="3">{t("HOME")}</AdminTypo.H2>
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
            h={"113px"}
            bgColor="#CAE9FF"
            mt={"30px"}
            shadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
            borderRadius={"10px"}
          >
            <VStack m={"15px"}>
              <HStack justifyContent={"space-between"}>
                <AdminTypo.H6 color="textGreyColor.800" bold>
                  {event?.name ? event?.name : event?.type}
                </AdminTypo.H6>
                <AdminTypo.Secondarybutton
                  // onPress={() => setShowEditModal(true)}
                  shadow="BlueOutlineShadow"
                >
                  {t("EDIT_DETAILS")}
                </AdminTypo.Secondarybutton>
              </HStack>

              <HStack space={"3"} fontSize={"14px"}>
                <IconByName
                  isDisabled
                  name="TimeLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                <AdminTypo.H5 color="textGreyColor.800">
                  {event?.start_date
                    ? moment(event?.start_date).format("Do MMM")
                    : ""}{" "}
                  {event?.start_time ? event?.start_time : ""}
                  {/* 16th April, 11:00 to 12:00 */}
                </AdminTypo.H5>
                <IconByName
                  isDisabled
                  name="MapPinLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                <AdminTypo.H6 color="textGreyColor.800">
                  {event?.location}
                </AdminTypo.H6>
                <IconByName
                  isDisabled
                  name="UserLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                <AdminTypo.H6 color="textGreyColor.800">
                  Master Trainer -
                </AdminTypo.H6>
                <Box
                  bgColor={"#FFFFFF"}
                  height={"29px"}
                  alignItems={"center"}
                  borderRadius={"10px"}
                  p={"3px"}
                >
                  <Badge alignSelf="center">
                    {event?.master_trainer ? event?.master_trainer : ""}
                  </Badge>
                </Box>
              </HStack>
            </VStack>
          </Box>
          <Stack mt={"20px"} space={"3"} py="2">
            <HStack space={"4"}>
              <HStack>
                <IconByName
                  isDisabled
                  name="UserLineIcon"
                  color="gray"
                  _icon={{ size: "35" }}
                />
                <AdminTypo.H1 color="textGreyColor.800" bold>
                  Candidates {users?.length}
                </AdminTypo.H1>
              </HStack>
              <HStack>
                <AdminTypo.Secondarybutton
                  shadow="BlueOutlineShadow"
                  onPress={(e) => {
                    setCameraModal(true);
                    setUserData(users?.[0] ? { ...users?.[0], index: 0 } : {});
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
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            safeAreaTop={true}
            // size={"xxl"}
            size="xl"
          >
            <Modal.Content
              rounded="2xl"
              bg="translate"
              style={{ height: 1000 }}
            >
              <Modal.CloseButton />
              <Modal.Header p="1" borderBottomWidth="0" bg="white">
                <AdminTypo.H1 textAlign="center" color="textGreyColor.500">
                  {t("EDIT_DETAILS")}
                </AdminTypo.H1>
              </Modal.Header>
              <Modal.Body p="1" pb="10" bg="white">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                  ></HStack>
                  <HStack space="5">
                    {rowData?.profile_url ? (
                      <Avatar
                        source={{
                          uri: rowData?.profile_url,
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
                    <AdminTypo.H6 bold color="textGreyColor.800">
                      {rowData?.user?.first_name +
                        " " +
                        rowData?.user?.last_name}
                    </AdminTypo.H6>
                  </HStack>

                  <HStack alignItems="center" space={2}>
                    <VStack p="3" space="5">
                      <HStack alignItems="center" space={"2"}>
                        <IconByName
                          isDisabled
                          name="VidiconLine"
                          color="gray.400"
                          _icon={{ size: "25" }}
                        />

                        <AdminTypo.H5 color="textGreyColor.100">
                          {t("EVENT_TYPE")}
                        </AdminTypo.H5>
                        <HStack alignItems="center" space={"2"} p="1">
                          <Input
                            value={event?.name ? event?.name : event?.type}
                            variant="outline"
                            placeholder={
                              event?.name ? event?.name : event?.type
                            }
                            isDisabled
                          />
                        </HStack>
                      </HStack>
                      <HStack alignItems="center" space={"2"}>
                        <IconByName
                          isDisabled
                          name="MapPinLineIcon"
                          color="gray.400"
                          _icon={{ size: "25" }}
                        />

                        <AdminTypo.H5 color="textGreyColor.100">
                          {t("MARK_ATTENDANCE")}
                        </AdminTypo.H5>
                        <HStack alignItems="center" space={"2"} p="1">
                          <Radio.Group
                            flexDirection={"row"}
                            fontSize="10px"
                            gap={"2"}
                            name="myRadioGroup"
                            accessibilityLabel="favorite number"
                            value={attendance}
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
                              <AdminTypo.H6 color="textGreyColor.800">
                                Present
                              </AdminTypo.H6>
                            </Radio>
                            <Radio
                              value="absent"
                              my={1}
                              ml="2"
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 color="textGreyColor.800">
                                Absent
                              </AdminTypo.H6>
                            </Radio>
                          </Radio.Group>
                        </HStack>
                      </HStack>

                      <HStack alignItems="center" space={"2"}>
                        <IconByName
                          isDisabled
                          name="CheckboxCircleLineIcon"
                          color="gray.400"
                          _icon={{ size: "25" }}
                        />
                        <AdminTypo.H5 color="textGreyColor.100">
                          {t("COMPLETE_AADHAR_KYC")}
                        </AdminTypo.H5>
                        <HStack alignItems="center" space={"2"} p="1">
                          {ids?.user?.aadhar_verified !== null ? (
                            <AdminTypo.H3 style={{ color: "green" }}>
                              Yes (
                              {ids?.user?.aadhaar_verification_mode !== null
                                ? ids?.user?.aadhaar_verification_mode
                                : ""}
                              )
                            </AdminTypo.H3>
                          ) : (
                            <AdminTypo.H3 style={{ color: "red" }}>
                              No
                            </AdminTypo.H3>
                            // <FrontEndTypo.Primarybutton
                            //   // width="30%"
                            //   children="Aadhar_eKYC"
                            //   onPress={() => {
                            //     navigate(`/aadhaar-kyc/${ids?.user_id}`);
                            //   }}
                            // />
                          )}
                        </HStack>
                      </HStack>

                      <HStack alignItems="center" space={5}>
                        <Form
                          schema={schema}
                          ref={formRef}
                          uiSchema={uiSchema}
                          formData={formData}
                          validator={validator}
                          onChange={handleFormChange}
                          onSubmit={onSubmit}
                        >
                          <HStack
                            alignItems="center"
                            space={5}
                            mt={"20px"}
                            justifyContent={"space-between"}
                          >
                            <AdminTypo.Secondarybutton
                              shadow="BlueOutlineShadow"
                              onPress={() => {
                                setShowEditModal(false);
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
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <Modal
            isOpen={userData?.id}
            onClose={() => setUserData()}
            safeAreaTop={true}
            size={"full"}
          >
            <Modal.Content
              rounded="2xl"
              bg="translate"
              {...stylesheet.modalxxl}
            >
              <Modal.CloseButton />
              <Modal.Header
                p="5"
                borderBottomWidth="0"
                bg="white"
                textAlign={"left"}
              >
                <AdminTypo.H6 color="textGreyColor.900" bold>
                  {t("MARK_ATTENDANCE_ORIENTATION")}
                </AdminTypo.H6>
              </Modal.Header>
              <Modal.Body p="3" pb="10" bg="white">
                <HStack justifyContent={"space-between"}>
                  <HStack space={"10"} ml="15px">
                    <AdminTypo.H6 color="textGreyColor.550" bold>
                      Present
                    </AdminTypo.H6>
                    {users.filter((e) => e.status === "present").length}
                    <AdminTypo.H6 color="textGreyColor.550" bold>
                      Absent
                    </AdminTypo.H6>
                    {users.filter((e) => e.status !== "present").length}
                    Candidates name {userData?.user?.first_name}
                  </HStack>
                  <HStack>
                    <AdminTypo.H6>Candidates - {users.length} </AdminTypo.H6>
                  </HStack>
                </HStack>
                <Stack>
                  <AdminTypo.H6 my="15px" color="textGreyColor.100">
                    {t("ATTENDANCE_CAMERA_SUBTITLE")}
                  </AdminTypo.H6>
                </Stack>
                {cameraUrl?.url ? (
                  <img src={cameraUrl?.url} alt="Image" />
                ) : (
                  <React.Suspense fallback={<Loading />}>
                    <Camera
                      height="300px"
                      {...{
                        cameraModal,
                        setCameraModal,
                        cameraUrl,
                        setCameraUrl: async (url, file) => {
                          setCameraUrl({ url, file });
                        },
                      }}
                    />
                  </React.Suspense>
                )}
              </Modal.Body>
              <Modal.Footer justifyContent={"center"}>
                <AdminTypo.Secondarybutton
                  shadow="BlueOutlineShadow"
                  onPress={() => {
                    setCameraModal(false);
                    setUserData();
                    updateUserData();
                    setcameraFile("");
                  }}
                >
                  {t("FINISH")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.Secondarybutton
                  isDisabled={userData?.index + 1 === users.length}
                  variant="secondary"
                  ml="4"
                  px="5"
                  onPress={uploadAttendencePicture}
                >
                  {t("NEXT")}
                </AdminTypo.Secondarybutton>
              </Modal.Footer>
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
                      setShowEditModal(true);
                      setRowData(row);
                      setids(row);
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
            data={users}
            subHeader
            persistTableHead
            // progressPending={loading}
            customStyles={customStyles}
            pagination
            paginationServer
            paginationTotalRows={paginationTotalRows}
            onChangePage={handlePageChange}
            onRowClicked={handleCandidateSelectRow}
            onChangeRowsPerPage={(e) => setLimit(e)}
            // onChangePage={(e) => setPage(e)}
          />
        </VStack>
      </Box>
    </ScrollView>
  );
}
