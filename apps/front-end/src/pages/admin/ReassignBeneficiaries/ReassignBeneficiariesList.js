import React from "react";
import {
  Box,
  HStack,
  ScrollView,
  VStack,
  Button,
  Input,
  Text,
  Image,
} from "native-base";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import {
  IconByName,
  AdminTypo,
  AdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
  geolocationRegistryService,
} from "@shiksha/common-lib";
import Table from "./ReassignBeneficiariesListTable";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";

function CustomFieldTemplate({ id, classNames, label, required, children }) {
  return (
    <VStack
      className={classNames}
      style={{ borderTopColor: "dividerColor", borderTopWidth: "1px" }}
    >
      <HStack style={{ justifyContent: "space-between" }}>
        {id !== "root" && (
          <HStack style={{ justifyContent: "space-between" }} width="100%">
            <label
              style={{
                fontWeight: "bold",
                color: "textGreyColor.400",
                paddingBottom: "12px",
              }}
            >
              {label}
              {required ? "*" : null}
            </label>

            <IconByName name="SearchLineIcon" _icon={{ size: "15px" }} />
          </HStack>
        )}
      </HStack>
      {children}
    </VStack>
  );
}

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const ref = React.useRef(null);
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const [duplicateData, setduplicateData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({});
  const [data, setData] = React.useState([]);
  const [facilitator, setFacilitator] = React.useState([]);
  const [facilitatorFilter, setFacilitatorFilter] = React.useState({});
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();

  // facilitator pagination

  React.useEffect(async () => {
    const dupliData =
      await benificiaryRegistoryService.getDuplicateBeneficiariesList(filter);
    console.log("filter", dupliData?.data);
    setPaginationTotalRows(dupliData?.count || 0);
    setduplicateData(dupliData?.data);
    setLoading(false);
  }, [filter]);

  console.log("data", duplicateData);

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
    setGetBlocksAll(blockData);
  }, [filter?.district]);

  React.useEffect(async () => {
    setLoading(true);
    const result = await benificiaryRegistoryService.beneficiariesFilter(
      filter
    );
    console.log("result", result);
    setData(result.data?.data);
    setPaginationTotalRows(
      result?.data?.totalCount ? result?.data?.totalCount : 0
    );
    setLoading(false);
  }, [filter]);

  const setFilterObject = (data) => {
    if (data?.district) {
      const { district } = data;
      setFacilitatorFilter({ ...facilitatorFilter, district });
    }
    setFilter(data);
    setQueryParameters(data);
  };

  const schema = {
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
          enumNames: getDistrictsAll?.map((item, i) => {
            return item?.district_name;
          }),
          enum: getDistrictsAll?.map((item, i) => {
            return item?.district_name;
          }),
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
          enumNames: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
          enum: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
        },
        uniqueItems: true,
      },
    },
  };

  const uiSchema = {
    district: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
    block: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
  };

  const onChange = async (data) => {
    const { district, block } = data?.formData || {};
    setFilterObject({
      ...filter,
      ...(district ? { district } : {}),
      ...(block ? { block } : {}),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
  };

  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack ref={ref}>
        <HStack my="1" mb="3" justifyContent="space-between">
          <HStack justifyContent="space-between" alignItems="center">
            <IconByName
              name="Home4LineIcon"
              alt=""
              size={"sm"}
              resizeMode="contain"
            />
            <AdminTypo.H1 color="Activatedcolor.400">
              {t("All_AG_LEARNERS")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate("/admin/learners")}
            />
            <AdminTypo.H1 px="5">{t("REASSIGN_LEARNERS")}</AdminTypo.H1>
            <Image
              source={{
                uri: "/box.svg",
              }}
              alt=""
              size={"28px"}
              resizeMode="contain"
            />
          </HStack>
        </HStack>
      </HStack>
      <HStack>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
            pr="2"
          >
            <VStack space={8} py="5">
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack>
                    <IconByName isDisabled name="FilterLineIcon" />
                    <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
                  </HStack>
                  <Button variant="link" pt="3" onPress={clearFilter}>
                    <AdminTypo.H6 color="blueText.400" underline bold>
                      {t("CLEAR_FILTER")}
                    </AdminTypo.H6>
                  </Button>
                </HStack>
                <Text bold>{t("PRERAK")}</Text>
                <Input
                  w="100%"
                  height="32px"
                  placeholder="search"
                  variant="outline"
                  onChange={(e) => {
                    debounce(
                      setFacilitatorFilter({
                        ...facilitatorFilter,
                        search: e.nativeEvent.text,
                        page: 1,
                      }),
                      3000
                    );
                  }}
                />
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  onChange={onChange}
                  validator={validator}
                  formData={filter}
                  templates={{
                    FieldTemplate: CustomFieldTemplate,
                  }}
                >
                  <Button display={"none"} type="submit"></Button>
                </Form>
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight}
            minH={Height - refAppBar?.clientHeight}
          >
            <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
              <Table
                filter={filter}
                setFilter={setFilterObject}
                paginationTotalRows={paginationTotalRows}
                duplicateData={duplicateData}
                loading={loading}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}
