import React from "react";
import { HStack, VStack, Box, Progress } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
  ImageView,
  enumRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [source, setsource] = React.useState();
  const [subject, setSubject] = React.useState();

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
    const subjectResult = await enumRegistryService.getSubjects();
    const sub = JSON.parse(result?.result?.program_beneficiaries?.subjects);
    if (sub?.length > 0) {
      const filterData = subjectResult?.data?.filter((e) => {
        const subData = sub?.find((item) => `${item}` === `${e?.id}`);
        return subData ? true : false;
      });
      setSubject(filterData);
    }
  };
  return (
    <Layout _appBar={{ name: t("ENROLLMENT_DETAILS"), onPressBackButton }}>
      <VStack bg="bgGreyColor.200" px="5" pt="3">
        <VStack
          px="5"
          py="4"
          mb="3"
          borderRadius="10px"
          borderWidth="1px"
          bg="white"
          borderColor="appliedColor"
        >
          <HStack justifyContent="space-between" alignItems="Center">
            <FrontEndTypo.H3 bold color="textGreyColor.800">
              {t("ENROLLMENT_DETAILS")}
            </FrontEndTypo.H3>
            <IconByName
              name="EditBoxLineIcon"
              color="iconColor.100"
              _icon={{ size: "20" }}
              onPress={(e) => {
                navigate(`/beneficiary/edit/${id}/enrollment-details`);
              }}
            />
          </HStack>
          <Box>
            <Progress
              value={arrList(benificiary?.program_beneficiaries, [
                "type_of_enrollement",
                "enrollment_status",
                "enrolled_for_board",
                "enrollment_number",
                "subjects",
              ])}
              size="xs"
              colorScheme="info"
            />
          </Box>
          <VStack space="2" pt="5">
            <HStack
              alignItems="Center"
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderBottomColor="appliedColor"
            >
              <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                {t("ENROLLMENT_STATUS")}
              </FrontEndTypo.H3>

              <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                {benificiary?.program_beneficiaries?.enrollment_status
                  ? t(
                      benificiary?.program_beneficiaries?.enrollment_status.toUpperCase()
                    )
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>

            <HStack
              alignItems="Center"
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderBottomColor="appliedColor"
            >
              <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                {t("ENROLLMENT_BOARD")}
              </FrontEndTypo.H3>

              <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                {benificiary?.program_beneficiaries?.enrolled_for_board
                  ? benificiary?.program_beneficiaries?.enrolled_for_board
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>

            <HStack
              alignItems="Center"
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderBottomColor="appliedColor"
            >
              <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                {t("ENROLLMENT_NUMBER")}
              </FrontEndTypo.H3>

              <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                {benificiary?.program_beneficiaries?.enrollment_number
                  ? benificiary?.program_beneficiaries?.enrollment_number
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>

            <HStack
              alignItems="Center"
              borderBottomWidth="1px"
              borderBottomColor="appliedColor"
            >
              <FrontEndTypo.H3 color="textGreyColor.50" flex="0.7" pb="2">
                {t("SELECTED_SUBJECTS")}
              </FrontEndTypo.H3>

              <VStack>
                {subject?.map((e) => {
                  {
                    return (
                      <FrontEndTypo.H3
                        color="textGreyColor.800"
                        pb="2"
                        flex="0.3"
                      >
                        {e?.name}
                      </FrontEndTypo.H3>
                    );
                  }
                })}
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack
          px="5"
          pb="3"
          pt="2"
          borderRadius="10px"
          borderWidth="1px"
          bg="white"
          borderColor="appliedColor"
        >
          <HStack justifyContent="space-between" alignItems="Center">
            <FrontEndTypo.H3 bold color="textGreyColor.800">
              {t("UPLOAD_RECEIPT")}
            </FrontEndTypo.H3>
            <IconByName
              name="EditBoxLineIcon"
              _icon={{ size: "20" }}
              color="iconColor.100"
              onPress={(e) => {
                navigate(`/beneficiary/edit/${id}/enrollment-details`);
              }}
            />
          </HStack>
          <VStack space="5">
            <Box>
              <Progress
                value={arrList(benificiary?.core_beneficiaries, [
                  "career_aspiration",
                  "career_aspiration_details",
                ])}
                size="xs"
                colorScheme="info"
              />
            </Box>

            <ImageView
              source={source}
              width="full"
              height="172px"
              borderRadius="5px"
              borderWidth="1px"
              borderColor="worksheetBoxText.100"
              alignSelf="Center"
            />
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
