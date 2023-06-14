import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import {
  Box,
  HStack,
  Select,
  CheckIcon,
  Text,
  Checkbox,
  VStack,
  ScrollView,
  Flex,
  Button,
} from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  H2,
  useWindowSize,
  H3,
  t,
  facilitatorRegistryService,
  AdminTypo,
  geolocationRegistryService,
} from "@shiksha/common-lib";
import Table from "./facilitator/Table";
import Chip from "component/Chip";
import CustomRadio from "component/CustomRadio";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [formData, setFormData] = React.useState({});
  const [getQualificationAll, setgetQualificationAll] = React.useState();
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();

  const [service, setService] = React.useState();
  const [adminlimit, setadminLimit] = React.useState();
  const [adminpage, setadminPage] = React.useState(1);
  const [admindata, setadminData] = React.useState();
  const [totalCount, settotalCount] = React.useState();
  const [status, setadminstatus] = React.useState();

  let finalData;

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

  const schema = {
    type: "object",
    properties: {
      DISTRICT: {
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
      QUALIFICATION: {
        type: "array",
        label: "QUALIFICATION",
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
      WORK_EXPERIENCE: {
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
    DISTRICT: {
      "ui:widget": "checkboxes",
      "ui:options": {},
    },
    QUALIFICATION: {
      "ui:widget": "checkboxes",
      "ui:options": {},
    },
    WORK_EXPERIENCE: {
      "ui:widget": CustomRadio,
    },
  };

  const onChange = async (formData) => {
    const _formData = formData?.formData;
    const result = await facilitatorRegistryService.filter(
      _formData,
      adminpage,
      adminlimit,
      status
    );
    setadminData(result?.data?.data);
    settotalCount(result?.data?.totalCount);

    setFormData(_formData);
  };

  const clearFilter = () => {
    setadminData("");
    setFormData("");
  };

  function CustomFieldTemplate(props) {
    const {
      id,
      classNames,
      style,
      label,
      help,
      required,
      description,
      errors,
      children,
    } = props;
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
              {/* <HStack alignItems="center" space={1} width="200px" height="24px">
                <IconByName isDisabled name="SortDescIcon" />
                <Text>{t("SORT_BY")}</Text>
              </HStack> */}
              {/* <Select
                minWidth="20"
                placeholder="Recent"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setService(itemValue)}
              >
                <Select.Item label="abc" value="ux" /> 
              </Select>*/}

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
                  formData={formData}
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
              formData={formData}
              admindata={admindata}
              totalCount={totalCount}
              setadminLimit={setadminLimit}
              setadminPage={setadminPage}
              setadminstatus={setadminstatus}
              facilitator={userTokenInfo?.authUser}
            />
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
