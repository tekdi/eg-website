import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HStack, VStack, Box, Progress, Divider, Alert } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  t,
  ImageView,
  arrList,
  objProps,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import moment from "moment";

export default function LearnerProfileView({ userTokenInfo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState({});
  const [beneficiary, setBeneficiary] = React.useState({});
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");
  const [reasonValue, setReasonValue] = React.useState("");
  const [alert, setAlert] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const [isDisableOpportunity, setIsDisableOpportunity] = React.useState(false);

  const res = objProps(benificiary);

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    const Address = [
      result?.result?.state,
      result?.result?.district,
      result?.result?.block,
      result?.result?.village,
      result?.result?.grampanchayat,
    ]
      .filter((e) => e)
      .join(", ");
    let fullName = [
      result?.result?.program_beneficiaries?.enrollment_first_name,
      result?.result?.program_beneficiaries?.enrollment_middle_name,
      result?.result?.program_beneficiaries?.enrollment_last_name,
    ]
      .filter((e) => e)
      .join(" ");
    const userDetails = {
      "Student Name": fullName,
      name: fullName,
      email:
        result?.result?.email_id || `${result?.result?.first_name}@gmail.com`,
      "Date Of Birth": result?.result?.dob,
      birth_date: result?.result?.dob,
      "mobile number": result?.result?.mobile,
      phone: result?.result?.mobile,
      contact: result?.result?.mobile,
      Address,
      createdAt: moment().format("YYYY-MM-DD HH:mm"),
      user_id: id,
    };
    localStorage.setItem("userData", JSON.stringify(userDetails));
    setBenificiary(result?.result);
    const orgResult = await benificiaryRegistoryService.getOrganisation({
      id: userTokenInfo?.authUser?.program_faciltators?.parent_ip,
    });
    if (
      ["enrolled_ip_verified", "registered_in_camp", "10th_passed"].includes(
        result?.result?.program_beneficiaries?.status
      ) &&
      orgResult?.data?.name.toLowerCase() == "tekdi"
    ) {
      setIsDisableOpportunity(true);
    } else {
      setIsDisableOpportunity(false);
    }
    setLoading(false);
  }, [reactivateReasonValue, reasonValue]);

  return (
    <Layout
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learner/learnerListView");
        },
      }}
      loading={loading}
      analyticsPageTitle={"LEARNER_PROFILE"}
      pageTitle={t("LEARNER_PROFILE")}
    >
      {beneficiary?.is_deactivated ? (
        <Alert status="warning" alignItems="start" mb="3" mt="4">
          <HStack alignItems="center" space="2" color="black">
            <Alert.Icon />
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px" bg="gray.200">
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
                <Box
                  bgColor={"profileColor"}
                  width="64px"
                  height="64px"
                  borderRadius={"50%"}
                ></Box>
              )}
            </VStack>

            <Box
              bg="gray.100"
              borderColor="gray.300"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <FrontEndTypo.H3 bold color="gray.800">
                  {t("PROFILE_PROGRESS")}
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
                          `/learner/learnerListView/${id}/learnerBasicDetails`
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
                          `/learner/learnerListView/${id}/learnerAddAddress`
                        );
                      }}
                      color="maroon.400"
                    />
                  </HStack>
                  <Divider orientation="horizontal" />
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
                      <FrontEndTypo.H3>
                        {t("DOCUMENT_CHECKLIST")}
                      </FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        navigate(
                          `/learner/learnerListView/${id}/learnerDocumentDetails`
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
                      <FrontEndTypo.H3>
                        {t("EDUCATION_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        navigate(
                          `/learner/learnerListView/${id}/learnerEducationDetails`
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
                      <FrontEndTypo.H3>
                        {t("ENROLLMENT_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        navigate(
                          `/learner/learnerListView/${id}/learnerEnrollmentDetails`
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
                      <FrontEndTypo.H3>{t("PCR_DETAILS")}</FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        navigate(
                          `/learner/learnerListView/${id}/LearnerPCRDetails`
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
                      <FrontEndTypo.H3>
                        {t("JOURNEY_IN_PROJECT_PRAGATI")}
                      </FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        navigate(
                          `/learner/learnerListView/${id}/LearnerJourneyDetails`
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
      )}
    </Layout>
  );
}
