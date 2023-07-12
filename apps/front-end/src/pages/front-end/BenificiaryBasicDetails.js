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
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ProfilePhoto from "./facilitator/ProfilePhoto";

export default function BenificiaryBasicDetails() {
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});

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

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [benificiary]);

  return (
    <Layout _appBar={{ name: t("BASIC_DETAILS"), onPressBackButton }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack px="16px" space="24px">
          <ProfilePhoto
            editLink={`/beneficiary/${benificiary?.id}/upload/1`}
            profile_photo_1={benificiary?.profile_photo_1}
            profile_photo_2={benificiary?.profile_photo_2}
            profile_photo_3={benificiary?.profile_photo_3}
          />
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textMaroonColor.400" bold pl="2">
                {benificiary?.first_name ? benificiary?.first_name : "-"}
                &nbsp;
                {benificiary?.middle_name?.trim() === "null"
                  ? ""
                  : benificiary?.middle_name}
                &nbsp;
                {benificiary?.last_name == "null" ? "" : benificiary?.last_name}
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
                value={arrList(
                  {
                    ...benificiary,
                    device_type: benificiary?.core_beneficiaries?.device_type,
                    device_ownership:
                      benificiary?.core_beneficiaries?.device_ownership,
                    mark_as_whatsapp_number:
                      benificiary?.core_beneficiaries?.mark_as_whatsapp_number,
                  },
                  [
                    "email_id",
                    "mobile",
                    "alternative_mobile_number",
                    "device_type",
                    "device_ownership",
                    "mark_as_whatsapp_number",
                  ]
                )}
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
                  {t("ALTERNATIVE_NUMBER")}
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
                  {benificiary?.email_id !== "null"
                    ? benificiary?.email_id
                    : "-"}
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
              {/* <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/address`);
                }}
              /> */}
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
                  {[
                    benificiary?.address == "null" ? "" : benificiary?.address,
                    benificiary?.state,
                    benificiary?.district,
                    benificiary?.block,
                    benificiary?.village,
                    benificiary?.grampanchayat,
                  ]
                    .filter((e) => e)
                    .join(", ")}
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
              <FrontEndTypo.H3 fontWeight="700" color="textGreyColor.800" bold>
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
            <Box>
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
            <VStack space="2" pt="5">
              <HStack
                alignItems="Center"
                space="xl"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("FATHER")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {`${
                    benificiary?.core_beneficiaries?.father_first_name
                      ? benificiary?.core_beneficiaries?.father_first_name
                      : "-"
                  } ${
                    benificiary?.core_beneficiaries?.father_middle_name
                      ? benificiary?.core_beneficiaries?.father_middle_name
                      : ""
                  } ${
                    benificiary?.core_beneficiaries?.father_last_name
                      ? benificiary?.core_beneficiaries?.father_last_name
                      : ""
                  }`}
                </FrontEndTypo.H3>
              </HStack>

              <HStack
                alignItems="Center"
                space="xl"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.4"
                  pb="2"
                >
                  {t("MOTHER")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {`${
                    benificiary?.core_beneficiaries?.mother_first_name
                      ? benificiary?.core_beneficiaries?.mother_first_name
                      : "-"
                  } ${
                    benificiary?.core_beneficiaries?.mother_middle_name
                      ? benificiary?.core_beneficiaries?.mother_middle_name
                      : ""
                  } ${
                    benificiary?.core_beneficiaries?.mother_last_name
                      ? benificiary?.core_beneficiaries?.mother_last_name
                      : ""
                  }`}
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
              <FrontEndTypo.H3 fontWeight="700" color="textGreyColor.800" bold>
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
                  {benificiary?.extended_users?.social_category ? (
                    <GetEnumValue
                      t={t}
                      enumType={"BENEFICIARY_SOCIAL_STATUS"}
                      enumOptionValue={
                        benificiary?.extended_users?.social_category
                      }
                      enumApiData={enumOptions}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" space="2xl">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.4" pb="2">
                  {t("MARITAL")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.3">
                  {/* {benificiary?.extended_users?.marital_status
                    ? t(benificiary?.extended_users?.marital_status)
                    : "-"} */}
                  {benificiary?.extended_users?.marital_status ? (
                    <GetEnumValue
                      t={t}
                      enumType={"MARITAL_STATUS"}
                      enumOptionValue={
                        benificiary?.extended_users?.marital_status
                      }
                      enumApiData={enumOptions}
                    />
                  ) : (
                    "-"
                  )}
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
                  "contact_number",
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
                  {`${
                    benificiary?.references[0]?.first_name
                      ? benificiary?.references[0]?.first_name
                      : "-"
                  } ${
                    benificiary?.references[0]?.middle_name
                      ? benificiary?.references[0]?.middle_name
                      : ""
                  } ${
                    benificiary?.references[0]?.last_name
                      ? benificiary?.references[0]?.last_name
                      : ""
                  }`}
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
