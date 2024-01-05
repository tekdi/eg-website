import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { tableCustomStyles } from "@shiksha/common-lib";

import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Modal,
  Select,
  CheckIcon,
  Stack,
} from "native-base";
import {
  getSelectedAcademicYear,
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  enumRegistryService,
  setQueryParameters,
  urlData,
  getOptions,
  cohortService,
} from "@shiksha/common-lib";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import Clipboard from "component/Clipboard";
import { debounce } from "lodash";

const uiSchema = {
  state: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
  district: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
  qualificationIds: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },

  block: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
  status: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
};

export default function List({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();

  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);

  const [schema, setSchema] = React.useState();
  const [filter, setFilter] = React.useState({});

  const [loading, setLoading] = React.useState(true);
  const [facilitaorStatus, setFacilitaorStatus] = React.useState();
  const [modal, setModal] = React.useState(false);

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [programID, setProgramID] = React.useState();
  const [programData, setProgramData] = React.useState([]);
  const [academicData, setAcademicData] = React.useState();
  const [academicYear, setAcademicYear] = React.useState();
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const handleOpenButtonClick = () => {
    setDrawerOpen((prevState) => !prevState);
  };
  React.useEffect(async () => {
    //getting required id's
    const result = await cohortService.getProgramYear();
    const data = await cohortService.getAcademicYear();
    setAcademicData(data?.data);
    setProgramData(result?.data);
    let academic_Id = await getSelectedAcademicYear();
    setAcademicYear(academic_Id?.academic_year_id);
  }, [modal]);

  const schemat = {
    type: "object",
    properties: {
      state: {
        type: "array",
        title: t("STATE"),
        grid: 1,
        _hstack: {
          maxH: 135,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
      district: {
        type: "array",
        title: t("DISTRICT"),
        grid: 1,
        _hstack: {
          maxH: 135,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
      block: {
        type: "array",
        title: t("BLOCKS"),
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
      qualificationIds: {
        type: "array",
        title: t("QUALIFICATION"),
        grid: 1,
        _hstack: {
          maxH: 135,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
      status: {
        type: "array",
        title: "STATUS",
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
    },
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await enumRegistryService.statuswiseCount();
      setFacilitaorStatus(result);
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});

      const getQualification =
        await facilitatorRegistryService.getQualificationAll();
      let newSchema = getOptions(schemat, {
        key: "qualificationIds",
        arr: getQualification,
        title: "name",
        value: "id",
      });
      newSchema = getOptions(schemat, {
        key: "status",
        arr: result,
        title: "status",
        value: "status",
      });

      const getState = await cohortService.getProgramYear();
      newSchema = getOptions(newSchema, {
        key: "state",
        arr: getState?.data,
        title: "state_name",
        value: "state_name",
      });
      setSchema(newSchema);
      setLoading(false);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchBlocks = async () => {
      if (schema && filter?.state?.length > 0) {
        let name = filter?.state?.[0];
        const getDistricts = await geolocationRegistryService.getDistricts({
          name,
        });
        let newSchema = getOptions(schema, {
          key: "district",
          arr: getDistricts?.districts,
          title: "district_name",
          value: "district_name",
        });
        setSchema(newSchema);
      }
    };
    fetchBlocks();
  }, [filter?.state]);

  React.useEffect(() => {
    const fetchBlocks = async () => {
      if (schema && filter?.district?.length > 0) {
        const blockData = await geolocationRegistryService.getMultipleBlocks({
          districts: filter?.district,
        });
        let newSchema = getOptions(schema, {
          key: "block",
          arr: blockData,
          title: "block_name",
          value: "block_name",
        });
        setSchema(newSchema);
      }
    };
    fetchBlocks();
  }, [filter?.district]);

  React.useEffect(() => {
    const fetchFilteredData = async () => {
      let newfilter = { ...filter, state: filter?.state?.[0] };
      const result = await facilitatorRegistryService.filter({
        ...newfilter,
        limit: filter?.limit || 10,
      });

      setData(result.data?.data);
      setPaginationTotalRows(result?.data?.totalCount || 0);
    };

    fetchFilteredData();
  }, [filter]);

  const setFilterObject = React.useCallback((data) => {
    setFilter(data);
    setQueryParameters(data);
  }, []);

  React.useEffect(() => {
    const arr = ["district", "block", "qualificationIds", "status"];
    const data = urlData(arr);

    if (Object.keys(data).find((e) => arr.includes(e))?.length) setFilter(data);
  }, []);

  const onChange = React.useCallback(
    async (data) => {
      const {
        state: newState,
        district: newDistrict,
        block: newBlock,
        qualificationIds: newQualificationIds,
        status: newStatus,
      } = data?.formData || {};
      const { state, district, block, ...remainData } = filter || {};
      setFilterObject({
        ...remainData,
        ...(newState && newState?.length === 1
          ? {
              state: newState,
              ...(newDistrict?.length > 0 ? { district: newDistrict } : {}),
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
        ...(newQualificationIds && newQualificationIds?.length > 0
          ? { qualificationIds: newQualificationIds }
          : {}),
        ...(newStatus && newStatus?.length > 0 ? { status: newStatus } : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = React.useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const exportPrerakCSV = async () => {
    const newfilter = { ...filter, state: filter?.state?.[0] };
    await facilitatorRegistryService.exportFacilitatorsCsv(newfilter);
  };

  const handleSearch = React.useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );

  const debouncedHandleSearch = React.useCallback(
    debounce(handleSearch, 1000),
    []
  );

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack
        space={[0, 0, "2"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
      >
        <HStack
          justifyContent={"space-between"}
          space={"4"}
          alignItems="center"
        >
          <HStack justifyContent="space-between" alignItems="center" space="2">
            <IconByName name="GroupLineIcon" size="md" />
            <AdminTypo.H4 bold> {t("ALL_PRERAKS")}</AdminTypo.H4>
          </HStack>
        </HStack>
        <Input
          size={"xs"}
          minH="40px"
          maxH="40px"
          onScroll={false}
          InputLeftElement={
            <IconByName
              color="coolGray.500"
              name="SearchLineIcon"
              isDisabled
              pl="2"
            />
          }
          placeholder={t("SEARCH_BY_PRERAK_NAME")}
          variant="outline"
          onChange={debouncedHandleSearch}
        />

        <HStack height={"5vh"} space={2}>
          <AdminTypo.Secondarybutton
            onPress={() => {
              exportPrerakCSV();
            }}
            rightIcon={
              <IconByName
                color="#084B82"
                _icon={{}}
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("EXPORT")}
          </AdminTypo.Secondarybutton>
          <AdminTypo.Secondarybutton
            onPress={() => setModal(true)}
            rightIcon={
              <IconByName
                color="#084B82"
                _icon={{}}
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("SEND_AN_INVITE")}
          </AdminTypo.Secondarybutton>

          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            safeAreaTop={true}
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0">
                <AdminTypo.H3 textAlign="center" color="textMaroonColor.600">
                  {t("SEND_AN_INVITE")}
                </AdminTypo.H3>
              </Modal.Header>
              <Modal.Body p="5" pb="10">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <AdminTypo.H4> {t("ACADEMIC_YEAR")}</AdminTypo.H4>

                    <Select
                      selectedValue={academicYear}
                      minWidth="200"
                      accessibilityLabel="Choose Service"
                      placeholder={t("SELECT")}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      mt={1}
                      onValueChange={(itemValue) => setAcademicYear(itemValue)}
                    >
                      {academicData?.map((item) => {
                        return (
                          <Select.Item
                            key={item.id}
                            label={item?.academic_year_name}
                            value={item?.academic_year_id}
                          />
                        );
                      })}
                    </Select>
                  </HStack>
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <AdminTypo.H4> {t("STATE")}</AdminTypo.H4>

                    <Select
                      selectedValue={programID}
                      minWidth="200"
                      accessibilityLabel="Choose Service"
                      placeholder={t("SELECT")}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      mt={1}
                      onValueChange={(itemValue) => setProgramID(itemValue)}
                    >
                      {programData?.map((item) => {
                        return (
                          <Select.Item
                            key={item.id}
                            label={item?.state_name}
                            value={item?.program_id}
                          />
                        );
                      })}
                    </Select>
                  </HStack>
                  {programID && (
                    <HStack
                      space="5"
                      borderBottomWidth={1}
                      borderBottomColor="gray.300"
                      pb="5"
                    >
                      <AdminTypo.H4> {t("INVITATION_LINK")}</AdminTypo.H4>
                      <Clipboard
                        text={`${process.env.REACT_APP_BASE_URL}/facilitator-self-onboarding?org_id=${userTokenInfo?.authUser?.program_users[0]?.organisation_id}&cohort_id=${academicYear}&program_id=${programID}`}
                      >
                        <HStack space="3">
                          <IconByName
                            name="FileCopyLineIcon"
                            isDisabled
                            rounded="full"
                            color="blue.300"
                          />
                          <AdminTypo.H3 color="blue.300">
                            {t("CLICK_HERE_TO_COPY_THE_LINK")}
                          </AdminTypo.H3>
                        </HStack>
                      </Clipboard>
                    </HStack>
                  )}
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </HStack>
      </HStack>
      <HStack ml="-1">
        <Stack style={{ position: "relative", overflowX: "hidden" }}>
          <Stack
            style={{
              position: "absolute",
              top: 0,
              left: "0",
              transition: "left 0.3s ease",
              width: "250px",
              height: "100%",
              background: "white",
              zIndex: 1,
            }}
          >
            <Box
              flex={[2, 2, 1]}
              style={{
                borderRightColor: "dividerColor",
                borderRightWidth: "2px",
              }}
            >
              <ScrollView
                maxH={
                  Height -
                  (refAppBar?.clientHeight + ref?.current?.clientHeight)
                }
              >
                <VStack space={3} py="5">
                  <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottomWidth="2"
                    borderColor="#eee"
                    flexWrap="wrap"
                  >
                    <HStack>
                      {/* <IconByName isDisabled name="FilterLineIcon" /> */}
                      <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
                    </HStack>
                    <Button variant="link" pt="3" onPress={clearFilter}>
                      <AdminTypo.H6 color="blueText.400" underline bold>
                        {t("CLEAR_FILTER")}
                      </AdminTypo.H6>
                    </Button>
                  </HStack>
                  <Box p={[0, 0, 3]} pr="3">
                    <Form
                      schema={schema}
                      uiSchema={uiSchema}
                      onChange={onChange}
                      validator={validator}
                      formData={filter}
                    >
                      <Button display={"none"} type="submit"></Button>
                    </Form>
                  </Box>
                </VStack>
              </ScrollView>
            </Box>
          </Stack>

          <Stack
            style={{
              marginLeft: isDrawerOpen ? "250px" : "0",
              transition: "margin-left 0.3s ease",
            }}
          />
        </Stack>
        <VStack
          ml={"-1"}
          rounded={"xs"}
          height={"50px"}
          bg={
            filter?.district ||
            filter?.state ||
            filter?.block ||
            filter?.qualificationIds ||
            filter?.status
              ? "textRed.400"
              : "#E0E0E0"
          }
          justifyContent="center"
          onClick={handleOpenButtonClick}
        >
          <IconByName
            name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
            color={
              filter?.state ||
              filter?.district ||
              filter?.block ||
              filter?.qualificationIds ||
              filter?.status
                ? "white"
                : "black"
            }
            _icon={{ size: "30px" }}
          />
        </VStack>

        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight}
            minH={Height - refAppBar?.clientHeight}
          >
            <Box roundedBottom={"2xl"} pl="0" py={6} px={4} mb={5}>
              <Table
                filter={filter}
                setFilter={setFilterObject}
                facilitator={userTokenInfo?.authUser}
                // facilitaorStatus={facilitaorStatus}
                paginationTotalRows={paginationTotalRows}
                data={data}
                loading={loading}
                enumOptions={enumOptions}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}
