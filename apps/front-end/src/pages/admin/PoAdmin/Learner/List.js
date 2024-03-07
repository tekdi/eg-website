import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate } from "react-router-dom";
import {
  PoAdminLayout,
  getSelectedAcademicYear,
  setSelectedAcademicYear,
  setSelectedProgramId,
  cohortService,
  IconByName,
  // AdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  setQueryParameters,
  urlData,
  tableCustomStyles,
  getSelectedProgramId,
  setSelectedOrgId,
} from "@shiksha/common-lib";
import {
  Select,
  Modal,
  CheckIcon,
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Text,
  Menu,
  Pressable,
} from "native-base";
import { useTranslation } from "react-i18next";
import { debounce, uniq, uniqBy } from "lodash";
import Table from "./Table";
import { MultiCheck } from "../../../../component/BaseInput";

function LearnerList({ userTokenInfo }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const refSubHeader = useRef(null);
  const [urlFilterApply, setUrlFilterApply] = useState(false);
  const [filter, setFilter] = useState({ limit: 10 });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);

  // cohort modal
  const [modal, setModal] = useState(true);
  const [orgData, setOrgData] = useState();
  const [cohortData, setCohortData] = useState();
  const [academicData, setAcademicData] = useState();
  const [programData, setProgramData] = useState();
  const [cohortValue, setCohortValue] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id) {
        setModal(false);
      }
    };
    fetchData();
  }, []);

  useEffect(async () => {
    if (urlFilterApply) {
      setLoading(true);
      const result = await benificiaryRegistoryService.beneficiariesFilter(
        filter
      );
      setData(result.data?.data);
      setPaginationTotalRows(
        result?.data?.totalCount ? result?.data?.totalCount : 0
      );
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const urlFilter = urlData(["district", "facilitator", "block"]);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const getCohortData = useCallback(async () => {
    setLoading(true);
    const result = await cohortService.getOrganisationId();
    setOrgData(result?.data);
    setLoading(false);
  }, [modal]);

  useEffect(() => {
    getCohortData();
  }, [modal]);

  const handleOrgChange = async (itemValue) => {
    setCohortValue({ ...cohortValue, org_id: itemValue });
    const data = await cohortService.getPoAcademicYear({
      organisation_id: itemValue,
    });
    setCohortData(data?.data);
    const uData = uniqBy(data?.data || [], (e) => e.academic_year_id);
    setAcademicData(uData);
  };

  const handleAcademicYearChange = async (itemValue) => {
    setCohortValue({ ...cohortValue, academic_year_id: itemValue });
    const uData = uniqBy(cohortData || [], (e) => e.program_id);
    setProgramData(uData);
  };

  const handleProgramChange = (itemValue) => {
    const data = JSON.parse(itemValue);
    setCohortValue({ ...cohortValue, data });
  };

  const handleCohortSubmit = () => {
    setSelectedAcademicYear({
      academic_year_id: cohortValue?.academic_year_id,
    });
    setSelectedProgramId({
      ...cohortValue?.data,
      program_id: cohortValue?.data?.program_id,
    });
    setSelectedOrgId({ org_id: cohortValue?.org_id });
    setModal(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id) {
        setModal(false);
      }
    };
    fetchData();
  }, []);
  return (
    <PoAdminLayout getRefAppBar={(e) => setRefAppBar(e)}>
      <HStack
        space={[0, 0, "2"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gridGap="2"
        ref={refSubHeader}
      >
        <HStack alignItems="center" space={2}>
          <IconByName name="GraduationCap" />
          <AdminTypo.H4 bold>{t("All_AG_LEARNERS")}</AdminTypo.H4>
        </HStack>
        <HStack justifyContent="center" alignItems="center" flex="1">
          <Input
            size={"xs"}
            minH="42px"
            maxH="42px"
            InputLeftElement={
              <IconByName
                color="coolGray.500"
                name="SearchLineIcon"
                isDisabled
                pl="2"
              />
            }
            placeholder={t("SEARCH_BY_LEARNER_NAME")}
            variant="outline"
            onChange={debouncedHandleSearch}
          />
        </HStack>
      </HStack>

      <HStack flex={[5, 5, 4]}>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height -
              (refAppBar?.clientHeight +
                ref?.current?.clientHeight +
                refSubHeader?.current?.clientHeight)
            }
            pr="2"
          >
            {urlFilterApply && <Filter {...{ filter, setFilter }} />}
          </ScrollView>
        </Box>
        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
            minH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
          >
            <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
              <Table
                customStyles={tableCustomStyles}
                filter={filter}
                setFilter={(e) => {
                  setFilter(e);
                  setQueryParameters(e);
                }}
                paginationTotalRows={paginationTotalRows}
                data={data}
                loading={loading}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
      <Modal isOpen={modal} safeAreaTop={true} size="xl">
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <AdminTypo.H3 textAlign="center" color="black">
              {t("SELECT_YOUR_COHORT")}
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
                <AdminTypo.H4> {t("ORGANISATION")}</AdminTypo.H4>
                <Select
                  selectedValue={cohortValue?.org_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleOrgChange(itemValue)}
                >
                  {orgData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.name}
                        value={`${item?.id}`}
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
                <AdminTypo.H4> {t("ACADEMIC_YEAR")}</AdminTypo.H4>

                <Select
                  selectedValue={cohortValue?.academic_year_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    handleAcademicYearChange(itemValue)
                  }
                >
                  {academicData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.academic_year?.name}
                        value={`${item?.academic_year_id}`}
                        // value={JSON.stringify(item)}
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
                  selectedValue={cohortValue?.program_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleProgramChange(itemValue)}
                >
                  {programData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.program?.state?.state_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              {cohortValue?.data?.program_id && (
                <VStack alignItems={"center"}>
                  <AdminTypo.Dangerbutton onPress={handleCohortSubmit}>
                    {t("CONTINUE")}
                  </AdminTypo.Dangerbutton>
                </VStack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </PoAdminLayout>
  );
}
LearnerList.propTypes = { userTokenInfo: PropTypes.any };

export const Filter = ({ filter, setFilter }) => {
  const { t } = useTranslation();
  const [facilitator, setFacilitator] = useState([]);
  const [getDistrictsAll, setGetDistrictsAll] = useState();
  const [getBlocksAll, setGetBlocksAll] = useState();
  const [facilitatorFilter, setFacilitatorFilter] = useState({});

  // facilitator pagination
  const [isMore, setIsMore] = useState("");

  const setFilterObject = useCallback(
    (data) => {
      const { facilitator: newFacilitator, ...otherData } = data;
      const facilitator =
        newFacilitator?.length > 0 ? { facilitator: newFacilitator } : {};
      if (data?.district) {
        const { district } = data;
        setFacilitatorFilter({ ...facilitatorFilter, district });
      }
      setFilter({ ...otherData, ...facilitator });
      setQueryParameters(data);
    },
    [facilitatorFilter]
  );

  const schema = useMemo(() => {
    return {
      type: "object",
      properties: {
        district: {
          type: "array",
          title: t("DISTRICT"),
          grid: 1,
          _hstack: {
            maxH: 130,
            overflowY: "scroll",
          },
          items: {
            type: "string",
            enumNames: getDistrictsAll?.map((item, i) => item?.district_name),
            enum: getDistrictsAll?.map((item, i) => item?.district_name),
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
          },
          items: {
            type: "string",
            enumNames: getBlocksAll?.map((item, i) => item?.block_name),
            enum: getBlocksAll?.map((item, i) => item?.block_name),
          },
          uniqueItems: true,
        },
      },
    };
  }, [getDistrictsAll, getBlocksAll]);

  const uiSchema = useMemo(() => {
    return {
      district: {
        "ui:widget": MultiCheck,
        "ui:options": {},
      },
      block: {
        "ui:widget": MultiCheck,
        "ui:options": {},
      },
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let name = programResult?.program?.state?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });

      if (Array.isArray(getDistricts?.districts)) {
        setGetDistrictsAll(getDistricts?.districts);
      }
    };
    fetchData();
  }, []);

  useEffect(async () => {
    let blockData = [];
    if (filter?.district?.length > 0) {
      blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filter?.district,
      });
    }
    if (Array.isArray(blockData)) {
      setGetBlocksAll(blockData);
    }
  }, [filter?.district]);

  useEffect(() => {
    const facilitatorDetails = async () => {
      let newFilter = {};
      ["district", "block", "status"].forEach((e) => {
        if (filter[e]) {
          newFilter = {
            ...newFilter,
            [e]: filter[e],
          };
        }
      });
      const { error, ...result } =
        await facilitatorRegistryService.searchByBeneficiary({
          ...facilitatorFilter,
          ...newFilter,
        });
      if (!error) {
        setIsMore(
          parseInt(`${result?.data?.currentPage}`) <
            parseInt(`${result?.data?.totalPages}`)
        );
        const newFilterData = result?.data?.data?.map((e) => ({
          value: e?.id,
          label: `${e?.first_name} ${e?.last_name ? e?.last_name : ""}`,
        }));

        if (facilitatorFilter?.page > 1) {
          setFacilitator([...facilitator, ...newFilterData]);
        } else {
          setFacilitator(newFilterData);
        }
      } else {
        setFacilitator([]);
      }
    };
    facilitatorDetails();
  }, [facilitatorFilter]);

  const onChange = useCallback(
    async (data) => {
      const { district: newDistrict, block: newBlock } = data?.formData || {};
      const { district, block, ...remainData } = filter || {};
      setFilterObject({
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const handlePrerakSearch = (e) => {
    setFacilitatorFilter({
      ...facilitatorFilter,
      search: e.nativeEvent.text,
      page: 1,
    });
  };

  const debouncedHandlePrerakSearch = useCallback(
    debounce(handlePrerakSearch, 1000),
    []
  );

  return (
    <VStack space={8} py="5">
      <VStack space={3}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack>
            <IconByName isDisabled name="FilterLineIcon" />
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
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onChange={onChange}
          validator={validator}
          formData={filter}
        >
          <Button display={"none"} type="submit"></Button>
        </Form>
        <Text bold>{t("PRERAK")}</Text>
        <Input
          w="100%"
          height="32px"
          placeholder={t("SEARCH")}
          variant="outline"
          onChange={debouncedHandlePrerakSearch}
        />
        <MultiCheck
          key={facilitator}
          value={filter?.facilitator ? filter?.facilitator : []}
          onChange={(e) => {
            setFilterObject({ ...filter, facilitator: e });
          }}
          schema={{
            grid: 1,
            _hstack: {
              maxH: 130,
              overflowY: "scroll",
            },
          }}
          options={{
            enumOptions: facilitator,
          }}
        />
        {isMore && (
          <AdminTypo.H5
            onPress={(e) =>
              setFacilitatorFilter({
                ...facilitatorFilter,
                page:
                  (facilitatorFilter?.page
                    ? parseInt(facilitatorFilter?.page)
                    : 1) + 1,
              })
            }
            pr="2"
            color="textMaroonColor.600"
          >
            + {t("MORE")}
          </AdminTypo.H5>
        )}
      </VStack>
    </VStack>
  );
};

Filter.propTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.any,
};

export default LearnerList;
