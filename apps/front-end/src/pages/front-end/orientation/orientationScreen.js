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
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { ChipStatus } from "component/Chip";
import Orientation from "../Orientation";
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
} from "native-base";
import React from "react";
let switchAttendance = false;

const stylesheet = {
  ProceedButton: {
    marginTop: "20px",
    alignItems: "center",
    width: "260px",
    background: " #2D142C",
    boxShadow: "1px 3px 0px #C92A42",
    borderRadius: " 100px",
  },
  addCandidateButton: {
    alignItems: "center",
    width: "260px",
    background: " #2D142C",
    boxShadow: "1px 3px 0px #C92A42",
    borderRadius: " 100px",
  },
  cancelCandidateButton: {
    alignItems: "center",
    width: "260px",
    background: " #FFFFFF",
    boxShadow: "1px 3px 0px #C92A42",
    borderRadius: " 100px",
    color: "#084B82",
  },
};
const customStyles = {
  headCells: {
    style: {
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      background: "#E0E0E0",
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
        <Text>{row?.first_name + " " + row.last_name}</Text>
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
    selector: (row) => row?.gender,
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
        <Text>{row?.first_name + " " + row.last_name}</Text>
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
          <Text>Present</Text>
          <Switch
            offTrackColor="#00D790"
            onTrackColor="#DC2626"
            onThumbColor="#E0E0E0"
            offThumbColor="#E0E0E0"
            value={switchAttendance}
            onValueChange={!switchAttendance}
          />
        </HStack>
      </>
    ),
    sortable: false,
    attr: "email",
  },
  // {
  //   name: t("ADHAR_KYC"),
  //   selector: (row, index) => <ChipStatus key={index} status={row?.status} />,

  //   sortable: false,
  //   attr: "city",
  // },
  // {
  //   name: t("VERIFIED_DOCUMENTS"),
  //   selector: (row) => row?.gender,
  //   sortable: false,
  //   attr: "city",
  // },
];

export default function orientationScreen() {
  const [page, setPage] = React.useState("screen1");
  const [code, setCode] = React.useState("en");
  const [refAppBar, RefAppBar] = React.useState();
  const [selectedData, setSelectedData] = React.useState();
  const onShowScreen = () => {
    setPage("screen2");
  };
  const onClick = () => {
    setPage("screen3");
  };
  return (
    <>
      {page === "screen1" && <Orientation onShowScreen={onShowScreen} />}
      {page === "screen2" && (
        <Layout
          getRefAppBar={(e) => RefAppBar(e)}
          isDisabledAppBar={page === "screen1"}
          isCenter={true}
          key={code}
          _appBar={{ onlyIconsShow: ["langBtn"] }}
          _page={{ _scollView: { bg: "white" } }}
        >
          <Page2 onClick={onClick} setSelectedData={selectedData} />
        </Layout>
      )}

      {page === "screen3" && (
        <Layout
          getRefAppBar={(e) => RefAppBar(e)}
          isDisabledAppBar={page === "screen1"}
          isCenter={true}
          key={code}
          _appBar={{ onlyIconsShow: ["langBtn"] }}
          _page={{ _scollView: { bg: "white" } }}
        >
          <Page3 setSelectedData={selectedData} />
        </Layout>
      )}
    </>
  );
}

const Page1 = ({ onShowScreen }) => {
  return (
    <Box>
      <Button style={stylesheet.ProceedButton} onPress={onShowScreen}>
        {t("APPLY_NOW")}
      </Button>
    </Box>
  );
};

const Page2 = ({ onClick }) => {
  changeLanguage(localStorage.getItem("lang"));
  const [data, setData] = React.useState([]);
  const [filterObj, setFilterObj] = React.useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  React.useEffect(async () => {
    setLoading(true);
    const result = await facilitatorRegistryService.getAll(filterObj);

    setData(result.data);

    setPaginationTotalRows(result?.totalCount);
    setLoading(false);
  }, [filterObj]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);

  const handleSelectRow = (state) => {
    setSelectedData = state.selectedRows;
  };

  return (
    <VStack width={"100%"} height={"400px"}>
      <Modal isOpen={true} onClose={false} safeAreaTop={true} size="full">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header p="5" borderBottomWidth="0">
            <HStack justifyContent={"center"}>
              <H1> {t("SELECT_CANDIDATE")}</H1>
            </HStack>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <DataTable
              columns={[...columns()]}
              data={data}
              customStyles={customStyles}
              subHeader
              persistTableHead
              selectableRows
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={paginationTotalRows}
              onSelectedRowsChange={handleSelectRow}
              // onChangeRowsPerPage={(e) => setLimit(e)}
              // onChangePage={(e) => setPage(e)}
            />
          </Modal.Body>

          <Modal.Footer>
            <HStack space={"10"} justifyContent={"space-between"}>
              <Button variant="outlineSecondary">{t("CANCEL")}</Button>

              <Button
                onPress={onClick}
                style={stylesheet.addCandidateButton}
                endIcon={
                  <IconByName
                    isDisabled
                    name="ArrowRightSLineIcon"
                    color="gray.300"
                    _icon={{ size: "35" }}
                  />
                }
              >
                {t("SELECT_CANDIDATE")}
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

const Page3 = () => {
  const [Height] = useWindowSize();

  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [refAppBar, setRefAppBar] = React.useState();
  const [rowData, setRowData] = React.useState();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [service, setService] = React.useState("");
  const [aadharKYC, setAadharKYC] = React.useState("QRcodescan");
  const [attendance, setAttendance] = React.useState("QRcodescan");
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(async () => {
    setLoading(true);

    const result = await facilitatorRegistryService.getAll(filterObj);
    setData(result.data);
    let image_url = result.data.map((val) => {
      return val.profile_url;
    });
    const dataImage = await getBase64(image_url);
    setCameraUrl(dataImage);
    setPaginationTotalRows(result?.totalCount);
    setLoading(false);
  }, [filterObj]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);

  const handleCandidateSelectRow = (state) => {
    setRowData(state);
    setShowEditModal(true);
    console.log(state);
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
              <H1>{t("HOME")}</H1>
              <IconByName
                isDisabled
                name="ArrowRightSLineIcon"
                color="gray.300"
                _icon={{ size: "35" }}
              />
              <H1>{t("PRERAK_ORIENTATION")}</H1>
            </HStack>
            <HStack>
              <Button variant={"primary"} onPress={() => setModal(true)}>
                {t("SCHEDULE_EVENT")}
              </Button>
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
                {t("ORIENTATION_SHEDULE")}
                <Button variant={"secondary"}>{t("EDIT_DETAILS")}</Button>
              </HStack>

              <HStack mt={"20px"} space={"3"} fontSize={"14px"}>
                <IconByName
                  isDisabled
                  name="TimeLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                16th April, 11:00 to 12:00
                <IconByName
                  isDisabled
                  name="MapPinLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                Jaipur, 412213
                <IconByName
                  isDisabled
                  name="UserLineIcon"
                  color="gray"
                  _icon={{ size: "15" }}
                />
                Master Trainer -
                <Box
                  bgColor={"#FFFFFF"}
                  height={"29px"}
                  alignItems={"center"}
                  borderRadius={"10px"}
                  p={"3px"}
                >
                  Prakash Wagh
                </Box>
              </HStack>
            </VStack>
          </Box>
          <Stack mt={"20px"} space={"3"}>
            <HStack space={"4"}>
              <HStack>
                <IconByName
                  isDisabled
                  name="UserLineIcon"
                  color="gray"
                  _icon={{ size: "35" }}
                />
                <Text fontSize={"24px"}>Candidates (25)</Text>
              </HStack>
              <HStack>
                <Button
                  variant="outlineSecondary"
                  // bgColor={"#FFFFFF"}
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
                </Button>
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
              <Modal.Header p="5" borderBottomWidth="0" bg="white">
                <H1 textAlign="center"> {t("EDIT_DETAILS")}</H1>
              </Modal.Header>
              <Modal.Body p="3" pb="10" bg="white">
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
                    <H1>{rowData?.first_name + " " + rowData?.last_name}</H1>
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

                        <H4>{t("EVENT_TYPE")}</H4>
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
                              label="Prerak Orientation"
                              value="prerakOrientation"
                            />
                            <Select.Item
                              label="Organisation"
                              value="organisation"
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

                        <H4>{t("MARK_ATTENDANCE")}</H4>
                        <HStack alignItems="center" space={"2"} p="1">
                          <Radio.Group
                            flexDirection={"row"}
                            fontSize="12px"
                            gap={"2"}
                            name="myRadioGroup"
                            accessibilityLabel="favorite number"
                            value={"present"}
                            onChange={(nextValue) => {
                              setAttendance(nextValue);
                            }}
                          >
                            <Radio value="present" my={1}>
                              Present
                            </Radio>
                            <Radio value="absent" my={1}>
                              Absent
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
                        <H4>{t("COMPLETE_AADHAR_KYC")}</H4>
                        <HStack alignItems="center" space={"2"} p="1">
                          <Radio.Group
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
                            <Radio value="QRcodescan" my={1}>
                              QR code scan
                            </Radio>
                            <Radio value="aadharofflineKYC" my={1}>
                              Aadhaar Offline KYC
                            </Radio>
                            <Radio value="manualAadharUpload" my={1}>
                              Manual Aadhaar Upload
                            </Radio>
                          </Radio.Group>
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
                          <H4 mt={"12px"}>{t("DOCUMENT_VERIFICATION")}</H4>
                          <Stack
                            direction={{
                              base: "column",
                              md: "row",
                            }}
                            space={3}
                            alignItems="flex-start"
                          >
                            <Checkbox value="qualification">
                              Qualification Certificate
                            </Checkbox>
                            <Checkbox value="volunteer">
                              Volunteer Proof
                            </Checkbox>
                            <Checkbox value="work">Work Proof</Checkbox>
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
                  <Button variant="outlineSecondary" colorScheme="blueGray">
                    {t("CANCEL")}
                  </Button>
                  <Button variant="primary">{t("SAVE")}</Button>
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
            <Modal.Content rounded="2xl" bg="translate">
              <Modal.CloseButton />
              <Modal.Header
                p="5"
                borderBottomWidth="0"
                bg="white"
                textAlign={"left"}
              >
                <H1 textAlign="center"> {t("MARK_ATTENDANCE_ORIENTATION")}</H1>
              </Modal.Header>
              <Modal.Body p="3" pb="10" bg="white">
                <HStack justifyContent={"space-between"}>
                  <HStack space={"10"} ml="15px">
                    <H4>Present: 0</H4>
                    <H4>Absent: 0</H4>
                  </HStack>
                  <HStack>Candidates - 1/25</HStack>
                </HStack>
                <Stack>
                  <Text mt={"15px"}>{t("ATTENDANCE_CAMERA_SUBTITLE")}</Text>
                </Stack>
                {/* {cameraModal && ( */}
                <Camera
                  {...{
                    cameraModal,
                    setCameraModal,
                    cameraUrl,
                    setCameraUrl: async (url) => {
                      setCameraUrl(url);
                    },
                  }}
                />
                {/* )} */}

                <HStack
                  alignItems="center"
                  space={5}
                  mt={"20px"}
                  justifyContent={"center"}
                >
                  <Button variant="outlineSecondary" colorScheme="blueGray">
                    {t("MARK_ABSENT")}
                  </Button>
                  <Button variant="primary">{t("NEXT")}</Button>
                </HStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <DataTable
            columns={[
              ...scheduleCandidates(),
              {
                name: t(""),
                selector: (row) => (
                  <IconByName
                    isDisabled
                    name="EditBoxLineIcon"
                    color="gray"
                    _icon={{ size: "15" }}
                  />
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
            onRowClicked={handleCandidateSelectRow}
            onChangeRowsPerPage={(e) => setLimit(e)}
            onChangePage={(e) => setPage(e)}
          />
        </VStack>
      </Box>
    </ScrollView>
  );
};
