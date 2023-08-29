import React, { useEffect } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import { Box, HStack, VStack, ScrollView, Button } from "native-base";
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
} from "@shiksha/common-lib";
import Table from "./facilitator/Table";
import { useTranslation } from "react-i18next";
import CustomRadio from "component/CustomRadio";
import { useLocation } from "react-router-dom";
import { MultiCheck } from "../../component/BaseInput";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const location = useLocation();

  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();

  const [filter, setFilter] = React.useState({});

  const [loading, setLoading] = React.useState(true);
  const [facilitaorStatus, setfacilitaorStatus] = React.useState();

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [enumOptions, setEnumOptions] = React.useState({});

  // facilitator pagination
  const [getQualificationAll, setgetQualificationAll] = React.useState();

  React.useEffect(async () => {
    const getQualification =
      await facilitatorRegistryService.getQualificationAll();
    setgetQualificationAll(getQualification);
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
    const result = await enumRegistryService.statuswiseCount();
    setfacilitaorStatus(result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    setLoading(false);
  }, []);

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.filter(filter);
    setData(result.data?.data);
    setPaginationTotalRows(
      result?.data?.totalCount ? result?.data?.totalCount : 0
    );
  }, [filter]);

  const setFilterObject = (data) => {
    setFilter(data);
    setQueryParameters(data);
  };

  useEffect(() => {
    setFilter(
      urlData(["district", "block", "qualificationIds", "work_experience"])
    );
  }, []);

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: t("DISTRICT"),
        grid: 1,
        _hstack: { maxH: 135, overflowY: "scroll" },
        items: {
          type: "string",
          // enumNames: getDistrictsAll?.map((item, i) => item?.district_name),
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
          enumNames: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
          enum: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
        },
        uniqueItems: true,
      },
      qualificationIds: {
        type: "array",
        title: t("QUALIFICATION"),
        grid: 1,
        _hstack: { maxH: 135, overflowY: "scroll" },
        items: {
          type: "string",
          enumNames: getQualificationAll?.map((item, i) => item?.name),
          enum: getQualificationAll?.map((item, i) => item?.id),
        },
        uniqueItems: true,
      },
      work_experience: {
        type: "array",
        title: t("WORK_EXPERIENCES"),
        _hstack: { maxH: 135, overflowY: "scroll" },
        items: {
          type: "string",
          enumNames: [
            "All",
            "0 yrs",
            "1 yrs",
            "2 yrs",
            "3 yrs",
            "4 yrs",
            "5 yrs",
          ],
          enum: ["All", "0", "1", "2", "3", "4", "5"],
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
    qualificationIds: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
    work_experience: {
      "ui:widget": CustomRadio,
    },
    block: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
  };

  const onChange = async (data) => {
    const { district, qualificationIds, work_experience, block } =
      data?.formData || {};
    setFilterObject({
      ...filter,
      ...(district ? { district } : {}),
      ...(qualificationIds ? { qualificationIds } : {}),
      ...(work_experience ? { work_experience } : {}),
      ...(block ? { block } : {}),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
  };

  function CustomFieldTemplate({ id, label, children }) {
    return (
      <VStack>
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
              </label>
              <IconByName
                name="SearchLineIcon"
                isDisabled
                _icon={{ size: "15px" }}
              />
            </HStack>
          )}
        </HStack>
        {children}
      </VStack>
    );
  }

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
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
                  <IconByName isDisabled name="FilterLineIcon" />
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
                  templates={{
                    FieldTemplate: CustomFieldTemplate,
                  }}
                >
                  <Button display={"none"} type="submit"></Button>
                </Form>
              </Box>
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
                facilitator={userTokenInfo?.authUser}
                facilitaorStatus={facilitaorStatus}
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
