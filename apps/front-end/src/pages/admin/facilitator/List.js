import React, { useCallback, useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import PropTypes from "prop-types";
import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Modal,
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
  getSelectedProgramId,
} from "@shiksha/common-lib";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import Clipboard from "component/Clipboard";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

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
      title: "BLOCKS",
      grid: 1,
      _hstack: {
        maxH: 130,
        overflowY: "scroll",
        borderBottomColor: "bgGreyColor.200",
        borderBottomWidth: "2px",
      },
      items: {
        type: "string",
        enum: [],
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
  const navigate = useNavigate();
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const [schema, setSchema] = useState();
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [enumOptions, setEnumOptions] = useState({});
  const [program, setProgram] = useState();
  const [academicYear, setAcademicYear] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [urlFilterApply, setUrlFilterApply] = useState(false);

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let academic_Id = await getSelectedAcademicYear();
      setAcademicYear(academic_Id);
      setProgram(programResult);
      let name = programResult?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});

      let newSchema = getOptions(schemat, {
        key: "status",
        arr: data?.data?.FACILITATOR_STATUS,
        title: "title",
        value: "value",
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

  const fetchBlocks = useCallback(async () => {
    if (schema) {
      if (filter?.district?.length > 0) {
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
      } else {
        const newSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            block: schemat?.properties?.block || {},
          },
        };
        setSchema(newSchema);
      }
    }
  }, [filter?.district]);

  useEffect(() => {
    fetchBlocks();
  }, [filter?.district]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (urlFilterApply) {
        setTableLoading(true);
        const result = await facilitatorRegistryService.filter({
          ...filter,
          limit: filter?.limit || 10,
        });

        setData(result.data?.data);
        setPaginationTotalRows(result?.data?.totalCount || 0);

        setTableLoading(false);
      }
    };

    fetchFilteredData();
  }, [filter]);

  const setFilterObject = useCallback(
    (data) => {
      setFilter((prevFilter) => {
        if (prevFilter?.length > 0) {
          return prevFilter;
        } else {
          return data;
        }
      });
      setQueryParameters(data);
    },
    [setFilter, setQueryParameters]
  );

  useEffect(() => {
    const arr = ["district", "block", "status"];
    const data = urlData(arr);
    if (Object.keys(data).find((e) => arr.includes(e))?.length) setFilter(data);
    setUrlFilterApply(true);
  }, []);

  const onChange = useCallback(
    async (data) => {
      const {
        district: newDistrict,
        block: newBlock,
        status: newStatus,
      } = data?.formData || {};
      const { district, block, status, ...remainData } = filter || {};
      const finalFilter = {
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
        ...(newStatus && newStatus?.length > 0 ? { status: newStatus } : {}),
      };
      setFilterObject(finalFilter);
    },
    [filter]
  );

  const clearFilter = useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const exportPrerakCSV = async () => {
    await facilitatorRegistryService.exportFacilitatorsCsv(filter);
  };

  const handleSearch = useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout
      widthApp={width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack
        space={[0, 0, "2"]}
        p="2"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
        ref={ref}
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
              navigate(`/admin/reports/prerak`);
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
                  >
                    <AdminTypo.H4> {t("INVITATION_LINK")}</AdminTypo.H4>
                    <Clipboard
                      text={`${process.env.REACT_APP_BASE_URL}/facilitator-self-onboarding?org_id=${userTokenInfo?.authUser?.program_users?.[0]?.organisation_id}&cohort_id=${academicYear?.academic_year_id}&program_id=${program?.program_id}`}
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
                        {t("CLEAR_FILTER")}(
                        {
                          Object.keys(filter || {}).filter(
                            (e) => !["limit", "page"].includes(e)
                          ).length
                        }
                        )
                      </AdminTypo.H6>
                    </Button>
                  </HStack>
                  <Box p={[0, 0, 3]} pr="3">
                    <Form
                      schema={schema || {}}
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
            filter?.district || filter?.state || filter?.block || filter?.status
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
              filter?.status
                ? "white"
                : "black"
            }
            _icon={{ size: "30px" }}
          />
        </VStack>

        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight - 72}
            minH={Height - refAppBar?.clientHeight - 72}
          >
            <Box roundedBottom={"2xl"} pl="0" px={4}>
              <Table
                height={Height - refAppBar?.clientHeight}
                filter={filter}
                setFilter={setFilterObject}
                facilitator={userTokenInfo?.authUser}
                paginationTotalRows={paginationTotalRows}
                data={data}
                loading={tableLoading}
                enumOptions={enumOptions}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

List.propTypes = { footerLinks: PropTypes.any, userTokenInfo: PropTypes.any };
