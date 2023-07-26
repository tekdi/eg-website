import React from "react";
import { HStack, VStack, Box, Progress } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import schema1 from "./ag-edit/enrollment/schema";
import schema from "pages/parts/schema";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();
  // const [subject, setSubject] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
    setLoading(false);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ENROLLMENT_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <VStack p="5" space={4}>
        <ItemComponent
          title={t("ENROLLMENT_DETAILS")}
          step={"edit_enrollement"}
          notShow={["subjects", "enrollment_aadhaar_no"]}
          item={{
            ...benificiary?.program_beneficiaries,
            enrollment_status: (
              <GetEnumValue
                enumType="BENEFICIARY_STATUS"
                enumOptionValue={
                  benificiary?.program_beneficiaries?.enrollment_status
                }
                enumApiData={enumOptions}
                t={t}
              />
            ),
          }}
          {...([
            "not_enrolled",
            "applied_but_pending",
            "enrollment_rejected",
          ].includes(benificiary?.program_beneficiaries?.enrollment_status)
            ? {
                onlyField: ["enrollment_status"],
              }
            : {})}
          onEdit={(e) => navigate(`/beneficiary/edit/${id}/enrollment-details`)}
        />
        {![
          "not_enrolled",
          "applied_but_pending",
          "enrollment_rejected",
        ].includes(benificiary?.program_beneficiaries?.enrollment_status) && (
          <ItemComponent
            title={t("ENROLLMENT_RECEIPT")}
            step={"edit_enrollement_details"}
            item={{
              ...benificiary?.program_beneficiaries,
              enrollment_status: (
                <GetEnumValue
                  enumType="BENEFICIARY_STATUS"
                  enumOptionValue={
                    benificiary?.program_beneficiaries?.enrollment_status
                  }
                  enumApiData={enumOptions}
                  t={t}
                />
              ),
            }}
          />
        )}
      </VStack>
    </Layout>
  );
}

const ItemComponent = ({ title, item, onlyField, onEdit, step, notShow }) => {
  const { t } = useTranslation();
  const schema = schema1?.properties[step];
  let arr = Object.keys(schema?.properties);
  if (onlyField?.constructor.name === "Array" && onlyField?.length) {
    arr = onlyField;
  } else if (
    !onlyField &&
    notShow?.constructor.name === "Array" &&
    notShow?.length
  ) {
    arr = arr.filter((e) => !notShow?.includes(e));
  }
  return (
    <VStack
      px="5"
      py="4"
      space="3"
      borderRadius="10px"
      borderWidth="1px"
      bg="white"
      borderColor="appliedColor"
    >
      <HStack justifyContent="space-between" alignItems="Center">
        <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
          {title}
        </FrontEndTypo.H3>
        {onEdit && (
          <HStack alignItems="center">
            <IconByName
              name="EditBoxLineIcon"
              color="iconColor.100"
              onPress={(e) => onEdit(item)}
            />
          </HStack>
        )}
      </HStack>
      <Box paddingTop="2">
        <Progress value={arrList(item, arr)} size="xs" colorScheme="info" />
      </Box>
      <VStack space="2" paddingTop="5">
        {arr?.map((key, index) => (
          <HStack
            key={key}
            alignItems="Center"
            justifyContent="space-between"
            borderBottomWidth="1px"
            borderBottomColor="appliedColor"
          >
            <FrontEndTypo.H3
              color="textGreyColor.50"
              fontWeight="400"
              flex="0.3"
            >
              {t(schema?.properties?.[key]?.label)}
            </FrontEndTypo.H3>

            <FrontEndTypo.H3
              color="textGreyColor.800"
              fontWeight="400"
              flex="0.4"
            >
              {schema?.properties?.[key]?.format === "FileUpload" ? (
                <ImageView source={{ document_id: item?.[key] }} text="link" />
              ) : item?.[key] ? (
                item?.[key]
              ) : (
                "-"
              )}
            </FrontEndTypo.H3>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
