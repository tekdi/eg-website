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
  const [filter, setFilter] = React.useState({});

  const [loading, setLoading] = React.useState(true);
  const [facilitaorStatus, setfacilitaorStatus] = React.useState();

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  // facilitator pagination
  const [getQualificationAll, setgetQualificationAll] = React.useState();

  const urlData = () => {
    return location.search
      .slice(1)
      .split("&")
      .map((p) => p.split("="))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        if (["district", "qualificationIds", "work_experience"].includes(key)) {
          const newValue = value.split(",");
          obj[key] = newValue;
        } else {
          obj[key] = value;
        }
        return obj;
      }, {});
  };

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
    const result = await enumRegistryService.listOfEnum();
    setfacilitaorStatus(result?.data?.FACILITATOR_STATUS);
  }, []);

  React.useEffect(async () => {
    setLoading(true);
    const result = await facilitatorRegistryService.filter(filter);
    setData(result.data?.data);
    setPaginationTotalRows(
      result?.data?.totalCount ? result?.data?.totalCount : 0
    );
    setLoading(false);
  }, [filter]);

  const setFilterObject = (data) => {
    setFilter(data);
    setQueryParameters(data);
  };

  useEffect(() => {
    setFilter(urlData());
  }, []);

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: "DISTRICT",
        label: "DISTRICT",
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
      qualificationIds: {
        type: "array",
        title: "QUALIFICATION",
        grid: 1,
        items: {
          type: "string",
          enumNames: getQualificationAll?.map((item, i) => {
            return item?.name;
          }),
          enum: getQualificationAll?.map((item, i) => {
            return item?.id;
          }),
        },
        uniqueItems: true,
      },
      work_experience: {
        type: "array",
        title: "WORK  EXPERIENCE",
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
      "ui:widget": "checkboxes",
      "ui:options": {},
    },
    qualificationIds: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
    work_experience: {
      "ui:widget": CustomRadio,
    },
  };

  const onChange = async (data) => {
    const { district, qualificationIds, work_experience } = data?.formData;
    setFilterObject({
      ...filter,
      ...(district ? { district } : {}),
      ...(qualificationIds ? { qualificationIds } : {}),
      ...(work_experience ? { work_experience } : {}),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
  };

  function CustomFieldTemplate({ id, classNames, label, required, children }) {
    return (
      <VStack
        className={classNames}
        style={{ borderTopColor: "#EEEEEE", borderTopWidth: "1px" }}
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

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack>
        <Box
          width="18%"
          style={{ borderRightColor: "#EEEEEE", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
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
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  onChange={onChange}
                  validator={validator}
                  formData={filter}
                  // widget={{ MultiCheck }}
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
            />
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
