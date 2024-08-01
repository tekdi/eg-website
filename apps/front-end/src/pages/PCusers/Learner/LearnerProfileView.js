import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HStack, VStack, Box, Divider, Alert, Stack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  t,
  ImageView,
  PcuserService,
} from "@shiksha/common-lib";
import Clipboard from "component/Clipboard";
import { ChipStatus } from "component/BeneficiaryStatus";

export default function LearnerProfileView({ userTokenInfo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = React.useState({});

  const location = useLocation();
  const locationData = location?.state?.state;

  const getLearnerInfo = async () => {
    const payload = {
      academic_year_id: locationData?.academic?.academic_year_id,
      program_id: locationData?.program_id,
      id: id,
    };
    const data = await PcuserService.getLearnerDetails(payload);
    setBeneficiary(data?.result);
  };

  useEffect(() => {
    getLearnerInfo();
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learner/LearnerListView", {
            state: location.state?.filter,
          });
        },
      }}
      loading={loading}
      analyticsPageTitle={"LEARNER_PROFILE"}
      pageTitle={t("LEARNER_PROFILE")}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <VStack alignItems="center" pt="20px">
            {beneficiary?.profile_photo_1?.id ? (
              <ImageView
                source={{
                  document_id: beneficiary?.profile_photo_1?.id,
                }}
                width="190px"
                height="190px"
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "190px" }}
              />
            )}
          </VStack>
          <Stack alignItems={"center"}>
            {![
              "enrolled_ip_verified",
              "registered_in_camp",
              "ineligible_for_pragati_camp",
              "10th_passed",
              "pragati_syc",
            ].includes(beneficiary?.program_beneficiaries?.status) ? (
              <FrontEndTypo.H2 bold color="textMaroonColor.400">
                {beneficiary?.first_name}
                {beneficiary?.middle_name &&
                  beneficiary?.middle_name !== "null" &&
                  ` ${beneficiary.middle_name}`}
                {beneficiary?.last_name &&
                  beneficiary?.last_name !== "null" &&
                  ` ${beneficiary?.last_name}`}
              </FrontEndTypo.H2>
            ) : (
              <FrontEndTypo.H2 bold color="textMaroonColor.400">
                {beneficiary?.program_beneficiaries?.enrollment_first_name}
                {beneficiary?.program_beneficiaries?.enrollment_middle_name &&
                  beneficiary?.program_beneficiaries?.enrollment_middle_name !==
                    "null" &&
                  ` ${beneficiary.program_beneficiaries.enrollment_middle_name}`}
                {beneficiary?.program_beneficiaries?.enrollment_last_name &&
                  beneficiary?.program_beneficiaries?.enrollment_last_name !==
                    "null" &&
                  ` ${beneficiary?.program_beneficiaries?.enrollment_last_name}`}
              </FrontEndTypo.H2>
            )}

            <Clipboard text={beneficiary?.id}>
              <FrontEndTypo.H1 bold>{beneficiary?.id}</FrontEndTypo.H1>
            </Clipboard>
            <ChipStatus
              status={beneficiary?.program_beneficiaries?.status}
              rounded={"sm"}
            />
          </Stack>
          <Box
            bg="gray.100"
            borderColor="gray.300"
            borderRadius="10px"
            borderWidth="1px"
            pb="6"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="gray.800">
                {t("PROFILE_DETAILS")}
              </FrontEndTypo.H3>

              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("BASIC_DETAILS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerBasicDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("ADD_ADDRESS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerAddAddress`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Box
            bg="gray.100"
            borderColor="gray.300"
            borderRadius="10px"
            borderWidth="1px"
            pb="6"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="gray.800">
                {t("OTHER_DETAILS")}
              </FrontEndTypo.H3>

              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("DOCUMENT_CHECKLIST")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerDocumentDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("EDUCATION_DETAILS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerEducationDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("ENROLLMENT_DETAILS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerEnrollmentDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack>
              {/* <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>{t("PCR_DETAILS")}</FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerPCRDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack> */}
              <VStack space="2" paddingTop="5">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space="md" alignItems="center">
                    <FrontEndTypo.H3>
                      {t("JOURNEY_IN_PROJECT_PRAGATI")}
                    </FrontEndTypo.H3>
                  </HStack>

                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(
                        `/learner/learnerListView/${id}/learnerJourneyDetails`,
                        { state: beneficiary }
                      );
                    }}
                    color="maroon.400"
                  />
                </HStack>
                <Divider orientation="horizontal" />
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
