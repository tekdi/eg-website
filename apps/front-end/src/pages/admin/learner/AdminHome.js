import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import { Box, HStack, VStack, ScrollView, Button } from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import Table from "./Table";
import { MultiCheck } from "../../../component/BaseInput";
import { useTranslation } from "react-i18next";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [facilitator, setFacilitator] = React.useState([]);
  const [filter, setFilter] = React.useState({});

  // facilitator pagination
  const [facilitatorLimit, setFacilitatorLimit] = React.useState(10);
  const [facilitatorPage, setFacilitatorPage] = React.useState(1);
  const [isMore, setIsMore] = React.useState("");

  React.useEffect(async () => {
    let name = "RAJASTHAN";
    const getDistricts = await geolocationRegistryService.getDistricts({
      name,
    });
    setgetDistrictsAll(getDistricts?.districts);
  }, []);

  React.useEffect(() => {
    const facilitatorDetails = async () => {
      const result = await facilitatorRegistryService.filter(
        {},
        facilitatorPage,
        facilitatorLimit
      );
      setIsMore(
        parseInt(`${result?.data?.currentPage}`) <
          parseInt(`${result?.data?.totalPages}`)
      );
      const newData = result?.data?.data?.map((e) => ({
        value: e?.id,
        label: `${e?.first_name} ${e?.last_name}`,
      }));
      const newFilterData = newData.filter(
        (e) =>
          facilitator.filter((subE) => subE.value === e?.value).length === 0
      );
      setFacilitator([...facilitator, ...newFilterData]);
    };
    facilitatorDetails();
  }, [facilitatorPage]);

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
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
    },
  };

  const uiSchema = {
    district: {
      "ui:widget": "checkboxes",
      "ui:options": {},
    },
  };

  const onChange = async (data) => {
    const { district } = data?.formData;
    setFilter({ ...filter, district });
  };

  const clearFilter = () => {
    setFilter({});
  };

  function CustomFieldTemplate({ id, classNames, label, required, children }) {
    return (
      <VStack
        className={classNames}
        style={{ borderTopColor: "#EEEEEE", borderTopWidth: "1px" }}
      >
        <HStack style={{ justifyContent: "space-between" }}>
          {/* <Input
            type="text"
            placeholder="Search name"
            value={search}
            onChange={(e) => setSearch(e.nativeEvent.text)}
          /> */}
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
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
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
                  templates={{
                    FieldTemplate: CustomFieldTemplate,
                  }}
                >
                  <Button display={"none"} type="submit"></Button>
                </Form>
                <MultiCheck
                  value={filter?.facilitator ? filter?.facilitator : []}
                  onChange={(e) => {
                    setFilter({ ...filter, facilitator: e });
                  }}
                  schema={{ label: "PRERAK", grid: 1 }}
                  options={{
                    enumOptions: facilitator,
                  }}
                />
                {isMore && (
                  <Button
                    onPress={(e) => setFacilitatorPage(facilitatorPage + 1)}
                  >
                    {t("MORE")}
                  </Button>
                )}
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
        <ScrollView
          maxH={Height - refAppBar?.clientHeight}
          minH={Height - refAppBar?.clientHeight}
        >
          <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
            <Table filter={filter} setFilter={setFilter} />
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
