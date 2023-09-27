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
  facilitatorRegistryService,
  setQueryParameters,
  debounce,
} from "@shiksha/common-lib";
import Table from "./ReassignBeneficiariesListTable";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({});
  const [data, setData] = React.useState();
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();

  const navigate = useNavigate();

  // facilitator pagination

  React.useEffect(async () => {
    const learnerStatus =
      await facilitatorRegistryService.learnerStatusDistribution(filter);
    setPaginationTotalRows(learnerStatus?.data?.totalCount || 0);
    setData(learnerStatus?.data?.data);
    setLoading(false);
  }, [filter]);

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

  const setFilterObject = (data) => {
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
              onPress={() => navigate("/admin/learners")}
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
                      setFilter({
                        ...filter,
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
          <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
            <Table
              filter={filter}
              setFilter={setFilterObject}
              paginationTotalRows={paginationTotalRows}
              data={data}
              loading={loading}
            />
          </Box>
        </Box>
      </HStack>
    </Layout>
  );
}
