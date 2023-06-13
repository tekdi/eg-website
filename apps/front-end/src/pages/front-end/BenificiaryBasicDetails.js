import React from "react";
import { useState } from "react";
import { HStack, VStack, Box, Progress, Center } from "native-base";
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
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState();

  const navigate = useNavigate();

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);

    setBenificiary(result?.result);
  };

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  return (
    <Layout _appBar={{ name: t("BASIC_DETAILS"), onPressBackButton }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack px="16px" space="24px">
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
              <FrontEndTypo.H1 color="textMaroonColor.400" bold pl="2">
                {benificiary?.first_name ? benificiary?.first_name : "-"}
                {benificiary?.middle_name ? benificiary?.middle_name : "-"}
                {benificiary?.last_name ? benificiary?.last_name : "-"}
              </FrontEndTypo.H1>
              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/basic-info`);
                }}
              />
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {moment(benificiary?.dob).format("DD/MM/YYYY")
                  ? moment(benificiary?.dob).format("DD/MM/YYYY")
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>
          </VStack>

          <VStack
            px="5"
            py="3"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("CONTACT_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                color="iconColor.100"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/contact-info`);
                }}
              />
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary, [
                  "email_id",
                  "mobile",
                  "alternative_mobile_number",
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
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("SELF")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.mobile ? benificiary?.mobile : "-"}
                </FrontEndTypo.H3>

                <IconByName
                  name="CellphoneLineIcon"
                  color="iconColor.100"
                  _icon={{ size: "20px" }}
                  onPress={(e) => {
                    navigate(`/beneficiary/edit/${id}/contact-info`);
                  }}
                />
              </HStack>

              <HStack
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
                  {t("FAMILY")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.alternative_mobile_number
                    ? benificiary?.alternative_mobile_number
                    : "-"}
                </FrontEndTypo.H3>

                <IconByName
                  name="SmartphoneLineIcon"
                  color="iconColor.100"
                  _icon={{ size: "20px" }}
                />
              </HStack>

              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("EMAIL")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.email_id ? benificiary?.email_id : "-"}
                </FrontEndTypo.H3>

                <IconByName
                  name="MailLineIcon"
                  color="iconColor.100"
                  _icon={{ size: "20px" }}
                />
              </HStack>
            </VStack>
          </VStack>

          <VStack
            px="5"
            py="3"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("ADDRESS_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/address`);
                }}
              />
            </HStack>
            <VStack>
              <HStack alignItems="Center" space="xl">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.4"
                >
                  {t("HOME")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.address ? benificiary?.address : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>

          <VStack
            px="5"
            py="3"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("FAMILY_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                color="iconColor.100"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/family-details`);
                }}
              />
            </HStack>

            <VStack space="2">
              <Box pt="2">
                <Progress
                  value={arrList(benificiary?.core_beneficiaries, [
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
                <HStack
                  alignItems="Center"
                  space="xl"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                    pb="2"
                  >
                    {t("FATHER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                    {benificiary?.core_beneficiaries?.father_first_name
                      ? benificiary?.core_beneficiaries.father_first_name
                      : "-"}{" "}
                    {benificiary?.core_beneficiaries?.father_middle_name
                      ? benificiary?.core_beneficiaries.father_middle_name
                      : "-"}{" "}
                    {benificiary?.core_beneficiaries?.father_last_name
                      ? benificiary?.core_beneficiaries.father_last_name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <HStack alignItems="Center">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                    pb="2"
                  >
                    {t("MOTHER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                    {benificiary?.core_beneficiaries?.mother_first_name
                      ? benificiary?.core_beneficiaries.mother_first_name
                      : "-"}{" "}
                    {benificiary?.core_beneficiaries?.mother_middle_name
                      ? benificiary?.core_beneficiaries.mother_middle_name
                      : "-"}{" "}
                    {benificiary?.core_beneficiaries?.mother_last_name
                      ? benificiary?.core_beneficiaries.mother_last_name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
          <VStack
            px="5"
            py="3"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 fontWeight="700" color="textGreyColor.800">
                {t("PERSONAL_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                color="iconColor.100"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/personal-details`);
                }}
              />
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary?.extended_users, [
                  "social_category",
                  "marital_status",
                ])}
                size="xs"
                colorScheme="info"
              />
            </Box>
            <VStack space="2" pt="5">
              <HStack
                alignItems="Center"
                space="xl"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("SOCIAL")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.extended_users?.social_category
                    ? benificiary?.extended_users?.social_category
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" space="2xl">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("MARITAL")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.extended_users?.marital_status
                    ? benificiary?.extended_users?.marital_status
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
          <VStack
            px="5"
            py="3"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("REFERENCE_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                color="iconColor.100"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/reference-details`);
                }}
              />
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary?.references[0], [
                  "first_name",
                  "middle_name",
                  "last_name",
                  "relation",
                ])}
                size="xs"
                colorScheme="info"
              />
            </Box>

            <VStack space="2" pt="5">
              <HStack
                alignItems="Center"
                space="2xl"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("NAME")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.references[0]?.first_name
                    ? benificiary?.references[0]?.first_name
                    : "-"}{" "}
                  {benificiary?.references[0]?.middle_name
                    ? benificiary?.references[0]?.middle_name
                    : "-"}{" "}
                  {benificiary?.references[0]?.last_name
                    ? benificiary?.references[0]?.last_name
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack
                alignItems="Center"
                space="2xl"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("RELATION")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.references[0]?.relation
                    ? benificiary?.references[0]?.relation
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" space="2xl">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4">
                  {t("CONTACT")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {benificiary?.references[0]?.contact_number
                    ? benificiary?.references[0]?.contact_number
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
