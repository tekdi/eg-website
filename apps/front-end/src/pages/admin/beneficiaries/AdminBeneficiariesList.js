import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate } from "react-router-dom";
import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Text,
  Menu,
  Pressable,
  Stack,
} from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  setQueryParameters,
  urlData,
  tableCustomStyles,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import Table from "./AdminBeneficiariesListTable";
import { MultiCheck } from "../../../component/BaseInput";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import PropTypes from "prop-types";

export default function AdminHome({ footerLinks }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const refSubHeader = useRef(null);
  const [urlFilterApply, setUrlFilterApply] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filter, setFilter] = useState({ limit: 10 });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const dropDown = useCallback((triggerProps, t) => {
    return (
      <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <HStack
          rounded={"full"}
          background="white"
          shadow="BlueOutlineShadow"
          borderRadius="full"
          borderWidth="1px"
          borderColor="blueText.400"
          p="2"
          space={4}
        >
          <AdminTypo.H5>{t("EXPORT")}</AdminTypo.H5>
          <IconByName pr="0" name="ArrowDownSLineIcon" isDisabled={true} />
        </HStack>
      </Pressable>
    );
  }, []);

  const actiondropDown = (triggerProps, t) => {
    return (
      <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <HStack
          rounded={"full"}
          background="white"
          shadow="BlueOutlineShadow"
          borderRadius="full"
          borderWidth="1px"
          borderColor="blueText.400"
          p="2"
          space={4}
        >
          <AdminTypo.H5>{t("ACTIONS")}</AdminTypo.H5>
          <IconByName pr="0" name="ArrowDownSLineIcon" isDisabled={true} />
        </HStack>
      </Pressable>
    );
  };

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

  const exportBeneficiaryCSV = useCallback(async () => {
    await benificiaryRegistoryService.exportBeneficiariesCsv(filter);
  }, [filter]);

  const exportSubjectCSV = useCallback(async () => {
    await benificiaryRegistoryService.exportBeneficiariesSubjectsCsv(filter);
  }, [filter]);

  const setMenu = useCallback(
    (e) => {
      if (e === "export_subject") {
        exportSubjectCSV();
      } else {
        exportBeneficiaryCSV();
      }
    },
    [exportBeneficiaryCSV, exportSubjectCSV]
  );

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout
      w={Width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
    >
      <HStack
        space={[0, 0, "2"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
        ref={refSubHeader}
      >
        <HStack justifyContent="space-between" alignItems="center" space={2}>
          <IconByName name="GraduationCap" />
          <AdminTypo.H4 bold>{t("All_AG_LEARNERS")}</AdminTypo.H4>
        </HStack>
        <Input
          size={"xs"}
          minH="42px"
          maxH="42px"
          ml="20px"
          InputLeftElement={
            <IconByName
              color="coolGray.500"
              name="SearchLineIcon"
              isDisabled
              pl="2"
              // height="2"
            />
          }
          placeholder={t("SEARCH_BY_LEARNER_NAME")}
          variant="outline"
          onChange={debouncedHandleSearch}
        />
        <HStack>
          <HStack mr="4">
            <Menu
              w="190"
              placement="bottom right"
              trigger={(triggerProps) => dropDown(triggerProps, t)}
            >
              <Menu.Item onPress={() => navigate(`/admin/reports/learner`)}>
                {t("LEARNERS_LIST")}
              </Menu.Item>
              <Menu.Item onPress={() => setMenu("export_subject")}>
                {t("LEARNERS_SUBJECT_CSV")}
              </Menu.Item>
            </Menu>
          </HStack>
          <HStack>
            <Menu
              w="190"
              placement="bottom right"
              trigger={(triggerProps) => actiondropDown(triggerProps, t)}
            >
              <Menu.Item
                onPress={() => {
                  navigate("/admin/learners/enrollmentVerificationList");
                }}
              >
                {t("ENROLLMENT_VERIFICATION")}
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  navigate("/admin/learners/duplicates");
                }}
              >
                {t("RESOLVE_DUPLICATION")}
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  navigate("/admin/learners/reassignList");
                }}
              >
                {t("REASSIGN_LEARNERS")}
              </Menu.Item>
            </Menu>
          </HStack>
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
                  (refAppBar?.clientHeight +
                    ref?.current?.clientHeight +
                    refSubHeader?.current?.clientHeight)
                }
                pr="2"
              >
                {urlFilterApply && <Filter {...{ filter, setFilter }} />}
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
            maxH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
            minH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
          >
            <Box roundedBottom={"2xl"} pl="0" px={4}>
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
    </Layout>
  );
}

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
      let name = programResult?.state_name;
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
AdminHome.propTypes = {
  footerLinks: PropTypes.any,
};
