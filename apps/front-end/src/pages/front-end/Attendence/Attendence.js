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
} from "native-base";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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
  const [Height] = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  let attendenceData = location?.state;
  let myArray = [];

  attendenceData?.attendances?.map((user) => {
    return myArray.push({ ...user, status: false });
  });
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [refAppBar, setRefAppBar] = React.useState();
  const [rowData, setRowData] = React.useState();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [service, setService] = React.useState(
    attendenceData?.name ? attendenceData?.name : attendenceData?.type
  );
  const [aadharKYC, setAadharKYC] = React.useState("QRcodescan");
  const [attendance, setAttendance] = React.useState("present");
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [modal, setModal] = React.useState(false);
  const [locationPermission, setLocationPermission] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const uplodInputRef = React.useRef();
  const [ids, setids] = useState("");

  const [switchAttendance, setSwitchAttendance] = React.useState(false);

  const [cameraFile, setcameraFile] = useState();

  useEffect(() => {
    getLocation();
  }, []);
  const onSwitchToggle = (value) => {
    getLocation();
    if (
      value?.user_id ===
      myArray
        .map((i) => {
          return i?.user_id;
        })
        .includes(value?.user_id)
    ) {
      setSwitchAttendance(true);
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
            <Text>{switchAttendance === true ? "Present" : "Absent"}</Text>
            <Switch
              // defaultIsChecked
              offTrackColor="#DC2626"
              onTrackColor="#00D790"
              onThumbColor="#E0E0E0"
              offThumbColor="#E0E0E0"
              value={switchAttendance}
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
    const result = await facilitatorRegistryService.getAll(filterObj);
    setData(myArray);
    // let image_url = myArray.map((val) => {
    //   return val.profile_url;
    // });
    // const dataImage = await getBase64(image_url);
    // setCameraUrl(dataImage);
    setPaginationTotalRows(result?.totalCount);
    setLoading(false);
  }, [filterObj]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);

  const uploadAttendencePicture = async (e) => {
    let formData = new FormData();
    formData.append("file", cameraUrl);
    const uploadDoc = await uploadRegistryService.uploadPicture(formData);
    if (uploadDoc) {
      setcameraFile(uploadDoc);
    }
  };
  const handleCandidateSelectRow = (state) => {
    setRowData(state);
    // setShowEditModal(true);
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
            <HStack>
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
            </HStack>
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
                  {attendenceData?.name
                    ? attendenceData?.name
                    : attendenceData?.type}
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
                  {attendenceData?.start_date
                    ? moment(attendenceData?.start_date).format("Do MMM")
                    : ""}{" "}
                  {attendenceData?.start_time ? attendenceData?.start_time : ""}
                  {/* 16th April, 11:00 to 12:00 */}
                </AdminTypo.H5>
                <IconByName
                  isDisabled
                  name="MapPinLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                <AdminTypo.H6 color="textGreyColor.800">
                  {attendenceData?.location}
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
                  <Badge alignSelf="center"> Prakash Wagh</Badge>
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
                  Candidates {myArray?.length}
                </AdminTypo.H1>
              </HStack>
              <HStack>
                <AdminTypo.Secondarybutton
                  shadow="BlueOutlineShadow"
                  onPress={(e) => {
                    setCameraUrl();
                    setCameraModal(true);
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
            size={"xxl"}
          >
            <Modal.Content rounded="2xl" bg="translate">
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
                      {rowData?.first_name + " " + rowData?.last_name}
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
                          <Select
                            selectedValue={service}
                            // minWidth="100"
                            accessibilityLabel="Choose Service"
                            placeholder="Select event type"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: (
                                <IconByName
                                  isDisabled
                                  name="CheckboxLineIcon"
                                  color="gray.400"
                                  _icon={{ size: "25" }}
                                />
                              ),
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setService(itemValue)}
                          >
                            <Select.Item
                              label={
                                attendenceData?.name
                                  ? attendenceData?.name
                                  : attendenceData?.type
                              }
                              value={
                                attendenceData?.name
                                  ? attendenceData?.name
                                  : attendenceData?.type
                              }
                            />
                          </Select>
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
                          {/* <Radio.Group
                            flexDirection={"row"}
                            fontSize="12px"
                            gap={"2"}
                            name="myRadioGroup"
                            accessibilityLabel="favorite number"
                            value={aadharKYC}
                            onChange={(nextValue) => {
                              setAadharKYC(nextValue);
                            }}
                          >
                            <Radio
                              value="QRcodescan"
                              my={1}
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 pl="2" color="textGreyColor.800">
                                QR code scan
                              </AdminTypo.H6>
                            </Radio>
                            <Radio
                              value="aadharofflineKYC"
                              my={1}
                              ml="2"
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 color="textGreyColor.800">
                                {" "}
                                Aadhaar Offline KYC
                              </AdminTypo.H6>
                            </Radio>
                            <Radio
                              value="manualAadharUpload"
                              my={1}
                              ml="2"
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 color="textGreyColor.800">
                                {" "}
                                Manual Aadhaar Upload
                              </AdminTypo.H6>
                            </Radio>
                          </Radio.Group> */}
                          {ids?.user?.aadhar_verified !== null ? (
                            console.log("aadhar_verified")
                          ) : (
                            <FrontEndTypo.Primarybutton
                              // width="30%"
                              children="Aadhar_eKYC"
                              onPress={() => {
                                navigate(`/aadhaar-kyc/${ids?.user_id}`);
                              }}
                            />
                          )}
                        </HStack>
                      </HStack>

                      <HStack alignItems="center" space={5}>
                        <HStack alignItems="center" space={2}>
                          <IconByName
                            isDisabled
                            name="FileTextLine"
                            color="gray.400"
                            _icon={{ size: "25" }}
                          />
                          <AdminTypo.H5 mt={"12px"} color="textGreyColor.100">
                            {t("DOCUMENT_VERIFICATION")}
                          </AdminTypo.H5>
                          <Stack
                            direction={{
                              base: "column",
                              md: "row",
                            }}
                            space={3}
                            alignItems="flex-start"
                          >
                            <Checkbox
                              value="qualification"
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 color="textGreyColor.800">
                                {" "}
                                Qualification Certificate
                              </AdminTypo.H6>
                            </Checkbox>
                            <Checkbox
                              value="volunteer"
                              color="textGreyColor.800"
                              fontSize="sm"
                            >
                              <AdminTypo.H6 color="textGreyColor.800">
                                Volunteer Proof
                              </AdminTypo.H6>
                            </Checkbox>
                            <Checkbox value="work" color="textGreyColor.800">
                              <AdminTypo.H6 color="textGreyColor.800">
                                Work Proof
                              </AdminTypo.H6>
                            </Checkbox>
                          </Stack>
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
                <HStack
                  alignItems="center"
                  space={5}
                  mt={"20px"}
                  justifyContent={"end"}
                >
                  <AdminTypo.Secondarybutton
                    shadow="BlueOutlineShadow"
                    onPress={() => {
                      setShowEditModal(false);
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton px="8" shadow="BlueFillShadow">
                    {t("SAVE")}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <Modal
            isOpen={cameraModal}
            onClose={() => setCameraModal(false)}
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
                  {" "}
                  {t("MARK_ATTENDANCE_ORIENTATION")}
                </AdminTypo.H6>
              </Modal.Header>
              <Modal.Body p="3" pb="10" bg="white">
                <HStack justifyContent={"space-between"}>
                  <HStack space={"10"} ml="15px">
                    <AdminTypo.H6 color="textGreyColor.550" bold>
                      Present
                    </AdminTypo.H6>{" "}
                    0
                    <AdminTypo.H6 color="textGreyColor.550" bold>
                      Absent
                    </AdminTypo.H6>{" "}
                    0
                  </HStack>
                  <HStack>
                    <AdminTypo.H6>Candidates - {myArray.length} </AdminTypo.H6>
                  </HStack>
                </HStack>
                <Stack>
                  <AdminTypo.H6 my="15px" color="textGreyColor.100">
                    {t("ATTENDANCE_CAMERA_SUBTITLE")}
                  </AdminTypo.H6>
                </Stack>
                {/* {cameraModal && ( */}
                {cameraFile?.fileUrl ? (
                  <img src={cameraFile?.fileUrl} alt="Image" />
                ) : (
                  <Camera
                    height="300px"
                    {...{
                      cameraModal,
                      setCameraModal,
                      cameraUrl,
                      setCameraUrl: async (url, file) => {
                        setCameraUrl(file);
                      },
                    }}
                  />
                )}
                {/* )} */}
              </Modal.Body>
              <Modal.Footer justifyContent={"center"}>
                <AdminTypo.Secondarybutton
                  shadow="BlueOutlineShadow"
                  onPress={() => {
                    setCameraModal(false);
                  }}
                >
                  {t("FINISH")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.Secondarybutton
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
            data={data}
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
