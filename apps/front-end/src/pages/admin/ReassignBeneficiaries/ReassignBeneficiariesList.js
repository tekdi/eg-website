import React, { useCallback, useEffect, useRef, useState } from "react";
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
  geolocationRegistryService,
  facilitatorRegistryService,
  setQueryParameters,
} from "@shiksha/common-lib";
import Table from "./ReassignBeneficiariesListTable";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

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
  const ref = useRef(null);
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [loading, setLoading] = useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const navigate = useNavigate();

  // facilitator pagination
  useEffect(() => {
    const fetchLearnerStatus = async () => {
      setLoading(true);
      const learnerStatus =
        await facilitatorRegistryService.learnerStatusDistribution(filter);
      setPaginationTotalRows(learnerStatus?.data?.totalCount || 0);
      setData(learnerStatus?.data?.data || []);
      setLoading(false);
    };
    fetchLearnerStatus();
  }, [filter]);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await geolocationRegistryService.getDistricts({
        name: "RAJASTHAN",
      });
      setDistricts(response?.districts || []);
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (filter.district?.length) {
        const response = await geolocationRegistryService.getMultipleBlocks({
          districts: filter.district,
        });
        setBlocks(response || []);
      } else {
        setBlocks([]);
      }
    };
    fetchBlocks();
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
          enumNames: districts.map((item) => item?.district_name),
          enum: districts.map((item) => item?.district_name),
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
          enumNames: blocks.map((item) => item?.block_name),
          enum: blocks.map((item) => item?.block_name),
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

  const handleChange = (data) => {
    const { district, block } = data?.formData || {};
    setFilterObject({
      ...filter,
      ...(district && { district }),
      ...(block && { block }),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
  };

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), [
    filter,
  ]);

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
                  onChange={debouncedHandleSearch}
                />
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  onChange={handleChange}
                  validator={validator}
                  formData={filter}
                  templates={{ FieldTemplate: CustomFieldTemplate }}
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
