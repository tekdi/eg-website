import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Actionsheet,
  Alert,
  ScrollView,
  Stack,
} from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  t,
  ImageView,
  BodyMedium,
  CustomRadio,
  arrList,
  objProps,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import moment from "moment";

export default function CampProfileView({ userTokenInfo }) {
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);
  const [isOpenReject, setIsOpenReject] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState({});
  const [benificiaryDropoutReasons, setBenificiaryDropoutReasons] =
    React.useState();
  const [benificiaryRejectReasons, setBenificiaryRejectReasons] =
    React.useState();
  const [benificiaryReactivateReasons, setBenificiaryReactivateReasons] =
    React.useState();
  const [reasonValue, setReasonValue] = React.useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");
  const [alert, setAlert] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const navigate = useNavigate();
  const [isDisableOpportunity, setIsDisableOpportunity] = React.useState(false);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBenificiaryDropoutReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_DROPOUT_REASONS
    );
    setBenificiaryReactivateReasons(result?.data?.REACTIVATE_REASONS);
    setBenificiaryRejectReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER
    );
  }, []);

  const res = objProps(benificiary);

  return (
    <Layout
      _appBar={{
        name: t("CAMP_PROFILE"),
        onPressBackButton: (e) => {
          navigate("/camps");
        },
      }}
      loading={loading}
      analyticsPageTitle={"CAMP_PROFILE"}
      pageTitle={t("CAMP_PROFILE")}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <VStack alignItems="Center" pt="20px">
            {benificiary?.profile_photo_1?.id ? (
              <ImageView
                source={{
                  document_id: benificiary?.profile_photo_1?.id,
                }}
                // alt="Alternate Text"
                width={"190px"}
                height={"190px"}
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "190px" }}
              />
            )}

            {![
              "enrolled_ip_verified",
              "registered_in_camp",
              "ineligible_for_pragati_camp",
              "10th_passed",
              "pragati_syc",
            ].includes(benificiary?.program_beneficiaries?.status) ? (
              <FrontEndTypo.H2 bold color="textMaroonColor.400">
                {benificiary?.first_name}
                {benificiary?.middle_name &&
                  benificiary?.middle_name !== "null" &&
                  ` ${benificiary.middle_name}`}
                {benificiary?.last_name &&
                  benificiary?.last_name !== "null" &&
                  ` ${benificiary?.last_name}`}
              </FrontEndTypo.H2>
            ) : (
              <FrontEndTypo.H2 bold color="textMaroonColor.400">
                {benificiary?.program_beneficiaries?.enrollment_first_name}
                {benificiary?.program_beneficiaries?.enrollment_middle_name &&
                  benificiary?.program_beneficiaries?.enrollment_middle_name !==
                    "null" &&
                  ` ${benificiary.program_beneficiaries.enrollment_middle_name}`}
                {benificiary?.program_beneficiaries?.enrollment_last_name &&
                  benificiary?.program_beneficiaries?.enrollment_last_name !==
                    "null" &&
                  ` ${benificiary?.program_beneficiaries?.enrollment_last_name}`}
              </FrontEndTypo.H2>
            )}
            <Clipboard text={benificiary?.id}>
              <FrontEndTypo.H1 bold>{benificiary?.id}</FrontEndTypo.H1>
            </Clipboard>
            <ChipStatus
              status={benificiary?.program_beneficiaries?.status}
              is_duplicate={benificiary?.is_duplicate}
              is_deactivated={benificiary?.is_deactivated}
              rounded={"sm"}
            />
            {isDisableOpportunity && (
              <FrontEndTypo.Primarybutton onPress={(e) => navigate("/onest")}>
                {t("OPPORTUNITY")}
              </FrontEndTypo.Primarybutton>
            )}
          </VStack>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            pb="6"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("CAMP_DETAILS")}
              </FrontEndTypo.H3>
              <Box paddingTop="2">
                <Progress
                  value={arrList(
                    {
                      ...res,
                      ...(res?.references?.[0] ? res?.references?.[0] : {}),
                    },
                    [
                      "email_id",
                      "mobile",
                      "alternative_mobile_number",
                      "device_type",
                      "device_ownership",
                      "mark_as_whatsapp_number",
                      "father_first_name",
                      "father_middle_name",
                      "father_last_name",
                      "mother_first_name",
                      "mother_middle_name",
                      "mother_last_name",
                      "social_category",
                      "marital_status",
                      "first_name",
                      "middle_name",
                      "last_name",
                      "relation",
                      "contact_number",
                      "district",
                      "state",
                      "block",
                      "village",
                      "aadhar_no",
                      "aadhaar_verification_mode",
                      "aadhar_verified",
                    ]
                  )}
                  size="xs"
                  colorScheme="danger"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                    <FrontEndTypo.H3>{t("BASIC_DETAILS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/basicdetails`);
                    }}
                    color="textMaroonColor.400"
                  />
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="MapPinLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("KIT_DETAILS")}
                    </FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/addressdetails`);
                    }}
                    color="textMaroonColor.400"
                  />
                </HStack>

                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("CAMP_FACILITIES")}
                    </FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/aadhaardetails`);
                    }}
                    color="textMaroonColor.400"
                  />
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <VStack
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            px="4"
            p="2"
            pb="6"
            divider={
              <Divider
                orientation="horizontal"
                bg="btnGray.100"
                thickness="1"
              />
            }
          >
            <HStack
              justifyContent="space-between"
              alignItems="Center"
              pr="0"
              p="3"
            >
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                {t("LEARNER_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="ArrowRightSLineIcon"
                onPress={(e) => {
                  navigate(`/camps/1234/learnerlist`);
                }}
                color="textMaroonColor.400"
              />
            </HStack>

            <HStack
              justifyContent="space-between"
              alignItems="Center"
              p="3"
              pr="0"
            >
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                {t("CAMP_ATTENDANCE")}
              </FrontEndTypo.H3>

              <IconByName
                name="ArrowRightSLineIcon"
                onPress={(e) => {
                  navigate(`/beneficiary/${id}/enrollmentdetails`);
                }}
                color="textMaroonColor.400"
              />
            </HStack>

            <HStack
              justifyContent="space-between"
              alignItems="Center"
              p="3"
              pr="1"
            >
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                {t("CAMP_PROGRESS")}
              </FrontEndTypo.H3>
              <IconByName
                name="ArrowRightSLineIcon"
                color="#790000"
                size="sm"
                onPress={(e) => {
                  navigate(`/beneficiary/${id}/pcrview`);
                }}
              />
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
