import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Modal,
  Image,
  Stack,
} from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  enumRegistryService,
  setQueryParameters,
  urlData,
  CustomRadio,
  getOptions,
} from "@shiksha/common-lib";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import Clipboard from "component/Clipboard";
import { debounce, size } from "lodash";

const uiSchema = {
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

const schemat = {
  type: "object",
  properties: {
    district: {
      type: "array",
      title: "DISTRICT",
      grid: 1,
      _hstack: { maxH: 135, overflowY: "scroll" },
      items: {
        type: "string",
      },
      uniqueItems: true,
    },
    block: {
      type: "array",
      title: "BLOCKS",
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
    qualificationIds: {
      type: "array",
      title: "QUALIFICATION",
      grid: 1,
      _hstack: { maxH: 135, overflowY: "scroll" },
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

export default function List({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();

  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);

  const [schema, setSchema] = React.useState();
  const [filter, setFilter] = React.useState({});

  const [loading, setLoading] = React.useState(true);
  const [facilitaorStatus, setFacilitaorStatus] = React.useState();

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const handleOpenButtonClick = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    const fetchData = async () => {
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

      let name = "RAJASTHAN";
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });
      newSchema = getOptions(newSchema, {
        key: "district",
        arr: getDistricts?.districts,
        title: "district_name",
        value: "district_name",
      });

      setSchema(newSchema);
      setLoading(false);
    };

    fetchData();
  }, []);

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
      const result = await facilitatorRegistryService.filter({
        ...filter,
        limit: filter.limit || 10,
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
      const { district, qualificationIds, status, block } =
        data?.formData || {};
      setFilterObject({
        ...filter,
        ...(district && district?.length > 0 ? { district } : {}),
        ...(qualificationIds && qualificationIds?.length > 0
          ? { qualificationIds }
          : {}),
        ...(status && status?.length > 0 ? { status } : undefined),
        ...(block && block?.length > 0 ? { block } : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = React.useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const [modal, setModal] = React.useState(false);
  const exportPrerakCSV = async () => {
    await facilitatorRegistryService.exportFacilitatorsCsv(filter);
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

  const statusFunction = React.useCallback(() => {
    const fetchStatus = async () => {
      const result = await enumRegistryService.statuswiseCount();
      let newSchema = getOptions(schemat, {
        key: "status",
        arr: result,
        title: "status",
        value: "status",
      });
      setSchema(newSchema);
    };
    fetchStatus();
  }, [filter]);

  React.useEffect(() => {
    statusFunction();
  }, [filter, statusFunction]);

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack
        // space={[0, 0, "2"]}
        p="4"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
        paddingTop={8}
        paddingBottom={6}
      >
        <HStack
          justifyContent={"space-between"}
          space={"4"}
          alignItems="center"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <IconByName name="GroupLineIcon" size="md" />
            <AdminTypo.H1> {t("ALL_PRERAKS")}</AdminTypo.H1>
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
        </HStack>

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
                <AdminTypo.H1 textAlign="center">
                  {t("SEND_AN_INVITE")}
                </AdminTypo.H1>
              </Modal.Header>
              <Modal.Body p="5" pb="10">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                  >
                    <AdminTypo.H4> {t("INVITATION_LINK")}</AdminTypo.H4>
                    <Clipboard
                      text={`${process.env.REACT_APP_BASE_URL}/facilitator-self-onboarding/${userTokenInfo?.authUser?.program_users[0]?.organisation_id}`}
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
              <HStack ref={ref}></HStack>
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
