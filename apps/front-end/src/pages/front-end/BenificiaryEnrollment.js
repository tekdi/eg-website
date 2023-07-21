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
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import schema1 from "./ag-edit/choose-subjects/schema";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [source, setsource] = React.useState();
  // const [subject, setSubject] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
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
    setsource({
      document_id:
        result?.result?.program_beneficiaries?.payment_receipt_document_id,
    });
    // const subjectResult = await enumRegistryService.getSubjects();
    // const sub = JSON.parse(result?.result?.program_beneficiaries?.subjects);
    // if (sub?.length > 0) {
    //   const filterData = subjectResult?.data?.filter((e) => {
    //     const subData = sub?.find((item) => `${item}` === `${e?.id}`);
    //     return subData ? true : false;
    //   });
    //   setSubject(filterData);
    // }
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [benificiary]);
  return (
    <Layout
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ENROLLMENT_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <VStack px="5" pt="3" space={4}>
        <ItemComponent
          title={t("ENROLLMENT_DETAILS")}
          schema={schema1?.properties[1]}
          item={benificiary?.program_beneficiaries}
          onEdit={(e) => navigate(`/beneficiary/edit/${id}/enrollment-details`)}
          arr={[
            "enrollment_status",
            "enrolled_for_board",
            "enrollment_number",
            "enrollment_date",
            "payment_receipt_document_id",
          ]}
          label={[]}
        />
      </VStack>
    </Layout>
  );
}

const ItemComponent = ({ schema, title, arr, label, item, onEdit }) => {
  const { t } = useTranslation();
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
        <HStack alignItems="center">
          <IconByName
            name="EditBoxLineIcon"
            color="iconColor.100"
            onPress={(e) => onEdit(item)}
          />
        </HStack>
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
              {t(
                label?.[index]
                  ? label?.[index]
                  : schema?.properties?.[key]?.label
              )}
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
