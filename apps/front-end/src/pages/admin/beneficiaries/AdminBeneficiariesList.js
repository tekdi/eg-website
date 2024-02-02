import React from "react";
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
  Image,
  Menu,
  Pressable,
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
} from "@shiksha/common-lib";
import Table from "./AdminBeneficiariesListTable";
import { MultiCheck } from "../../../component/BaseInput";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";


export default function AdminHome({ footerLinks }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const refSubHeader = React.useRef(null);
  const [urlFilterApply, setUrlFilterApply] = React.useState(false);

  const [filter, setFilter] = React.useState({ limit: 10 });
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  const dropDown = React.useCallback((triggerProps, t) => {
    return (
      <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <HStack
          rounded={"full"}
          background="white"
          shadow="BlueOutlineShadow"
          borderRadius="full"
          borderWidth="1px"
          borderColor="#084B82"
          p="2"
          space={4}
        >
          <AdminTypo.H5>{t("EXPORT")}</AdminTypo.H5>
          <IconByName pr="0" name="ArrowDownSLineIcon" isDisabled={true} />
        </HStack>
      </Pressable>
    );
  }, []);

  React.useEffect(async () => {
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

  React.useEffect(() => {
    const urlFilter = urlData(["district", "facilitator", "block"]);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  const exportBeneficiaryCSV = React.useCallback(async () => {
    await benificiaryRegistoryService.exportBeneficiariesCsv(filter);
  }, [filter]);

  const exportSubjectCSV = React.useCallback(async () => {
    await benificiaryRegistoryService.exportBeneficiariesSubjectsCsv(filter);
  }, [filter]);

  const setMenu = React.useCallback(
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
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 })
  };

  const debouncedHandleSearch = React.useCallback(
    debounce(handleSearch, 1000),
    []
  );

  return (
    <Layout
      w={Width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
    >
      <HStack
        p="4"
        space={["4", "0", "0", "4"]}
        flexWrap={"wrap"}
        ref={refSubHeader}
      >
        <HStack justifyContent="space-between" alignItems="center" space={4}>
          <IconByName isDisabled name="GraduationCap" _icon={{ size: "35" }} />
          <AdminTypo.H1>{t("All_AG_LEARNERS")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
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
        <HStack alignSelf={"center"} space="2">
          <Menu
            w="190"
            placement="bottom right"
            trigger={(triggerProps) => dropDown(triggerProps, t)}
          >
            <Menu.Item onPress={(item) => setMenu("export_learner")}>
              {t("LEARNERS_LIST")}
            </Menu.Item>
            <Menu.Item onPress={(item) => setMenu("export_subject")}>
              {t("LEARNERS_SUBJECT_CSV")}
            </Menu.Item>
          </Menu>

          <AdminTypo.Successbutton
            onPress={() => {
              navigate("/admin/learners/enrollmentVerificationList");
            }}
            rightIcon={
              <IconByName
                color="textGreyColor.100"
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("ENROLLMENT_VERIFICATION")}
          </AdminTypo.Successbutton>
          <AdminTypo.Dangerbutton
            onPress={() => {
              navigate("/admin/learners/duplicates");
            }}
            rightIcon={
              <IconByName
                color="textGreyColor.100"
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("RESOLVE_DUPLICATION")}
          </AdminTypo.Dangerbutton>
          <AdminTypo.PrimaryButton
            onPress={() => {
              navigate("/admin/learners/reassignList");
            }}
            rightIcon={
              <IconByName
                color="textGreyColor.100"
                size="10px"
                name="ShareLineIcon"
              />
            }
          >
            {t("REASSIGN_LEARNERS")}
          </AdminTypo.PrimaryButton>
        </HStack>
      </HStack>
      <HStack>
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
  const [facilitator, setFacilitator] = React.useState([]);
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();
  const [facilitatorFilter, setFacilitatorFilter] = React.useState({});

  // facilitator pagination
  const [isMore, setIsMore] = React.useState("");

  const setFilterObject = React.useCallback(
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

  const schema = React.useMemo(() => {
    return {
      type: "object",
      properties: {
        district: {
          type: "array",
          title: "DISTRICT",
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
          title: "BLOCKS",
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

  const uiSchema = React.useMemo(() => {
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

  React.useEffect(async () => {
    let name = "RAJASTHAN";
    const getDistricts = await geolocationRegistryService.getDistricts({
      name,
    });
    setgetDistrictsAll(getDistricts?.districts);
  }, []);

  React.useEffect(async () => {
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

  React.useEffect(() => {
    const facilitatorDetails = async () => {
      let newFilter = {};
      ["district", "block", "status"].forEach((e) => {
        if (filter[e]) {
          newFilter = { ...newFilter, [e]: filter[e] };
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

  const onChange = React.useCallback(
    async (data) => {
      const { district: newDistrict, block: newBlock } = data?.formData || {};
      const { district, block, ...remainData } = filter || {};
      setFilterObject({
        ...remainData,
        ...(newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = React.useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const handlePrerakSearch = (e) => {
    setFacilitatorFilter({
      ...facilitatorFilter,
      search: e.nativeEvent.text,
      page: 1,
    })
  };

  const debouncedHandlePrerakSearch = React.useCallback(
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
          <Button
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
          >
            {t("MORE")}
          </Button>
        )}
      </VStack>
    </VStack>
  );
};
