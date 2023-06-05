import React from "react";
import { useState } from "react";
import { HStack, VStack, Box, Progress, Divider, Center } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  benificiaryRegistoryService,
  t,
  Layout,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function BenificiaryBasicDetails() {
  const params = useParams();
  const [benificiary, setBenificiary] = React.useState();
  const [userId, setUserId] = React.useState(params?.id);
  const navigate = useNavigate();

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(userId);

    setBenificiary(result);
  };

  return (
    <Layout _appBar={{ name: t("BASIC_DETAILS") }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <Center>
            <IconByName
              name="AccountCircleLineIcon"
              color="iconColor.350"
              _icon={{ size: "60" }}
              justifySelf="Center"
            />
          </Center>
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
                {benificiary?.result?.first_name
                  ? benificiary?.result?.first_name
                  : "-"}
                {benificiary?.result?.middle_name
                  ? benificiary?.result?.middle_name
                  : "-"}
                {benificiary?.result?.last_name
                  ? benificiary?.result?.last_name
                  : "-"}{" "}
              </FrontEndTypo.H1>
              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
              />
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {moment(benificiary?.result?.dob).format("DD/MM/YYYY")
                  ? moment(benificiary?.result?.dob).format("DD/MM/YYYY")
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>
          </VStack>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("CONTACT_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/${userId}/edit/contact-info`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.result, [
                    "email_id",
                    "mobile",
                    "alternative_mobile_number",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("SELF")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.result?.mobile
                      ? benificiary?.result?.mobile
                      : "-"}
                  </FrontEndTypo.H3>

                  <IconByName name="CellphoneLineIcon" color="iconColor.100" />
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("FAMILY")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.result?.alternative_mobile_number
                      ? benificiary?.result?.alternative_mobile_number
                      : "-"}
                  </FrontEndTypo.H3>

                  <IconByName name="SmartphoneLineIcon" color="iconColor.100" />
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />

                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  alignContent="left"
                  position="left"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("EMAIL")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.result?.email_id
                      ? benificiary?.result?.email_id
                      : "-"}
                  </FrontEndTypo.H3>

                  <IconByName name="MailLineIcon" color="iconColor.100" />
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            bg="#FAFAFA"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("ADDRESS_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("HOME")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.address
                      ? benificiary?.result?.address
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("FAMILY_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/${userId}/edit/family-details`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.result?.core_beneficiaries[0], [
                    "father_first_name",
                    "father_middle_name",
                    "father_last_name",
                    "mother_first_name",
                    "mother_middle_name",
                    "mother_last_name",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("FATHER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.5"
                  >
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.father_first_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .father_first_name
                      : "-"}{" "}
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.father_middle_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .father_middle_name
                      : "-"}{" "}
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.father_last_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .father_last_name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("MOTHER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.5"
                  >
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.mother_first_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .mother_first_name
                      : "-"}{" "}
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.mother_middle_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .mother_middle_name
                      : "-"}{" "}
                    {benificiary?.result?.core_beneficiaries[0]
                      ?.mother_last_name
                      ? benificiary?.result?.core_beneficiaries[0]
                          .mother_last_name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("PERSONAL_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/${userId}/personal-details`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.result?.extended_users[0], [
                    "social_category",
                    "marital_status",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("SOCIAL")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.extended_users[0]?.social_category
                      ? benificiary?.result?.extended_users[0]?.social_category
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" space="2xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("MARITAL")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.extended_users[0]?.marital_status
                      ? benificiary?.result?.extended_users[0]?.marital_status
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("REFERENCE_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/${userId}/edit/reference`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.result?.references[0], [
                    "first_name",
                    "middle_name",
                    "last_name",
                    "relation",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="2xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("NAME")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.references[0]?.first_name
                      ? benificiary?.result?.references[0].first_name
                      : "-"}{" "}
                    {benificiary?.result?.references[0]?.middle_name
                      ? benificiary?.result?.references[0].middle_name
                      : "-"}{" "}
                    {benificiary?.result?.references[0]?.last_name
                      ? benificiary?.result?.references[0].last_name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" space="2xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("RELATION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.references[0]?.relation
                      ? benificiary?.result?.references[0].relation
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" space="2xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("CONTACT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {benificiary?.result?.references[0]?.contact_number
                      ? benificiary?.result?.references[0].contact_number
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
