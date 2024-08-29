import React, { useState, useEffect } from "react";
import {
  BodyMedium,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  objProps,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import {
  Actionsheet,
  Alert,
  Box,
  Divider,
  HStack,
  Progress,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropType from "prop-types";

export default function BenificiaryProfileView({ userTokenInfo }) {
  const { t } = useTranslation();
  const [isOpenDropOut, setIsOpenDropOut] = useState(false);
  const [isOpenReactive, setIsOpenReactive] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState({});
  const [benificiaryDropoutReasons, setBenificiaryDropoutReasons] = useState();
  const [benificiaryRejectReasons, setBenificiaryRejectReasons] = useState();
  const [benificiaryReactivateReasons, setBenificiaryReactivateReasons] =
    useState();
  const [reasonValue, setReasonValue] = useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const navigate = useNavigate();

  useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBenificiaryDropoutReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_DROPOUT_REASONS,
    );
    setBenificiaryReactivateReasons(result?.data?.REACTIVATE_REASONS);
    setBenificiaryRejectReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER,
    );
  }, []);

  const res = objProps(benificiary);

  const dropoutApiCall = async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "dropout",
      reason_for_status_update: reasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setIsDisable(false);
      setReasonValue("");
      setIsOpenDropOut(false);
    }
  };

  const reactivateApiCall = async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "identified",
      reason_for_status_update: reactivateReasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setIsDisable(false);
      setReactivateReasonValue("");
      setIsOpenReactive(false);
    }
  };

  const RejectApiCall = async () => {
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "rejected",
      reason_for_status_update: reasonValue,
    };

    const result = await benificiaryRegistoryService.statusUpdate(bodyData);

    if (result) {
      setReasonValue("");
      setIsOpenReject(false);
    }
  };
  useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    setLoading(false);
  }, [reactivateReasonValue, reasonValue]);

  function renderDropoutButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      // case "enrolled":
      // case "approved_ip":
      // case "registered_in_camp":
      // case "pragati_syc":
      // case "activate":
      // case "enrolled_ip_verified":
      case null:
        return (
          <Box
            bg="boxBackgroundColour.100"
            borderBottomColor={"garyTitleCardBorder"}
            borderBottomWidth={"1px"}
            borderBottomStyle={"solid"}
          >
            <VStack>
              <VStack space="2">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    <FrontEndTypo.H3
                      onPress={(e) => setIsOpenDropOut(true)}
                      fontWeight={"600"}
                      color="textRed.350"
                    >
                      {t("MARK_AS_DROPOUT")}
                    </FrontEndTypo.H3>
                  </HStack>

                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={(e) => setIsOpenDropOut(true)}
                        _icon={{ size: "20", color: "#D53546" }}
                      />
                    )}
                </HStack>
              </VStack>
            </VStack>
          </Box>
        );
      default:
        return null;
    }
  }
  function renderReactivateButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "rejected":
      case "dropout":
        return (
          <FrontEndTypo.Secondarybutton
            onPress={(e) => setIsOpenReactive(true)}
          >
            {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
          </FrontEndTypo.Secondarybutton>
        );
      default:
        return null;
    }
  }

  function renderRejectButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      // case "enrolled":
      // case "approved_ip":
      // case "registered_in_camp":
      // case "pragati_syc":
      // case "activate":
      // case "enrolled_ip_verified":
      case null:
        return (
          <Box bg="white">
            <VStack>
              <VStack space="2">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                    <FrontEndTypo.H3
                      onPress={(e) => setIsOpenReject(true)}
                      fontWeight={"600"}
                      color="textRed.350"
                    >
                      {t("REJECT")}
                    </FrontEndTypo.H3>
                  </HStack>

                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={(e) => setIsOpenReject(true)}
                        _icon={{ size: "20", color: "#D53546" }}
                      />
                    )}
                </HStack>
              </VStack>
              {/* <Divider
                orientation="horizontal"
                bg="btnGray.100"
                thickness="1"
              /> */}
            </VStack>
          </Box>
        );
      default:
        return null;
    }
  }

  return (
    <Layout
      _appBar={{
        name: t("BENEFICIARY_PROFILE"),
        onPressBackButton: (e) => {
          navigate("/beneficiary/list");
        },

        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser || {}}
      loading={loading}
      analyticsPageTitle={"BENEFICIARY_PROFILE"}
      pageTitle={t("BENEFICIARY_PROFILE")}
    >
      {benificiary?.is_deactivated ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <FrontEndTypo.H2>{t("DEACTIVATED_PAGE_MSG")}</FrontEndTypo.H2>
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px">
          <VStack paddingLeft="16px" paddingRight="16px" space="24px">
            <VStack alignItems="Center" pt="20px">
              <FrontEndTypo.H1 mb="4" fontWeight="600">
                {t("LEARNER_PROFILE")}
              </FrontEndTypo.H1>
              <HStack alignItems={"center"} space={4} mb={6}>
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
              </HStack>
              {![
                "enrolled_ip_verified",
                "sso_id_verified",
                "registered_in_neev_camp",
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
                    benificiary?.program_beneficiaries
                      ?.enrollment_middle_name !== "null" &&
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
                width="fit-content"
                status={benificiary?.program_beneficiaries?.status}
                is_duplicate={benificiary?.is_duplicate}
                is_deactivated={benificiary?.is_deactivated}
                rounded={"sm"}
              />
            </VStack>
            {(benificiary?.program_beneficiaries?.status == "dropout" ||
              benificiary?.program_beneficiaries?.status == "rejected") && (
              <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>
                    {t(
                      "PLEASE_REACTIVATE_THE_LEARNER_TO_ACCESS_THE_DETAILS_TAB",
                    )}
                  </BodyMedium>
                </HStack>
              </Alert>
            )}
            <Box>
              <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
                {t("PROFILE_PROGRESS")}
              </FrontEndTypo.H3>
              <Box mt={3}>
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
                    ],
                  )}
                  size="xs"
                  colorScheme="danger"
                />
              </Box>
            </Box>
            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("PROFILE_DETAILS")}
            </FrontEndTypo.H3>
            <Box
              bg="boxBackgroundColour.100"
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              shadow={"LearnerProfileViewShadow"}
              pb="4"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <VStack space="2">
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack space="md" alignItems="Center">
                      <FrontEndTypo.H3
                        fontWeight={"600"}
                        color="floatingLabelColor.500"
                      >
                        {t("BASIC_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>

                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/basicdetails`);
                          }}
                          color="floatingLabelColor.500"
                          _icon={{ size: "20" }}
                        />
                      )}
                  </HStack>
                  <Divider
                    orientation="horizontal"
                    bg="btnGray.100"
                    thickness="1"
                  />
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack alignItems="Center" space="md">
                      {/* <IconByName
                        name="MapPinLineIcon"
                        _icon={{ size: "20" }}
                      /> */}

                      <FrontEndTypo.H3
                        fontWeight={"600"}
                        color="floatingLabelColor.500"
                      >
                        {t("ADD_YOUR_ADDRESS")}
                      </FrontEndTypo.H3>
                    </HStack>
                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/addressdetails`);
                          }}
                          color="floatingLabelColor.500"
                          _icon={{ size: "20" }}
                        />
                      )}
                  </HStack>
                  {/*
                  <Divider
                    orientation="horizontal"
                    bg="btnGray.100"
                    thickness="1"
                  />
                   <HStack alignItems="Center" justifyContent="space-between">
                    <HStack alignItems="Center" space="md">
                      <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                      <FrontEndTypo.H3 color="textGreyColor.800">
                        {t("AADHAAR_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>
                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/aadhaardetails`);
                          }}
                          color="textMaroonColor.400"
                        />
                      )}
                  </HStack> */}
                </VStack>
              </VStack>
            </Box>

            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("OTHER_DETAILS")}
            </FrontEndTypo.H3>
            <VStack
              shadow={"LearnerProfileViewShadow"}
              bg="boxBackgroundColour.100"
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              px="4"
              p="2"
              pb="3"
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
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("DOCUMENT_CHECKLIST")}
                </FrontEndTypo.H3>
                {![
                  "enrolled",
                  "dropout",
                  "rejected",
                  "ready_to_enroll",
                  "enrolled_ip_verified",
                ].includes(benificiary?.program_beneficiaries?.status) && (
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/docschecklist`);
                    }}
                    color="floatingLabelColor.500"
                    _icon={{ size: "20" }}
                  />
                )}
              </HStack>
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                pr="0"
                p="3"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("EDUCATION_DETAILS")}
                </FrontEndTypo.H3>
                {benificiary?.program_beneficiaries?.status !== "dropout" &&
                  benificiary?.program_beneficiaries?.status !== "rejected" && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={(e) => {
                        navigate(`/beneficiary/${id}/educationdetails`);
                      }}
                      color="floatingLabelColor.500"
                      _icon={{ size: "20" }}
                    />
                  )}
              </HStack>
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("BENEFICIARY_DISABILITY_DETAILS")}
                </FrontEndTypo.H3>

                <IconByName
                  name="ArrowRightSLineIcon"
                  onPress={(e) =>
                    navigate(`/beneficiary/${id}/disability-details`)
                  }
                  color="floatingLabelColor.500"
                  _icon={{ size: "20" }}
                />
              </HStack>
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("ENROLLMENT_DETAILS")}
                </FrontEndTypo.H3>

                {benificiary?.program_beneficiaries?.status !== "dropout" &&
                  benificiary?.program_beneficiaries?.status !== "rejected" && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      color="floatingLabelColor.500"
                      _icon={{ size: "20" }}
                      onPress={(e) => {
                        navigate(`/beneficiary/${id}/enrollmentdetails`);
                      }}
                    />
                  )}
              </HStack>

              {benificiary?.program_beneficiaries?.status ===
                "registered_in_camp" && (
                <HStack
                  justifyContent="space-between"
                  alignItems="Center"
                  p="3"
                  pr="1"
                >
                  <FrontEndTypo.H3
                    color="floatingLabelColor.500"
                    fontWeight={"600"}
                  >
                    {t("PCR_DETAILS")}
                  </FrontEndTypo.H3>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="floatingLabelColor.500"
                    size="sm"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/pcrview`);
                    }}
                    _icon={{ size: "20" }}
                  />
                </HStack>
              )}
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="1"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("JOURNEY_IN_PROJECT_PRAGATI")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  size="sm"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/benificiaryJourney`);
                  }}
                  color="floatingLabelColor.500"
                  _icon={{ size: "20" }}
                />
              </HStack>
            </VStack>

            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("LEARNER_ACTIONS")}
            </FrontEndTypo.H3>
            <VStack
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              shadow={"LearnerProfileViewShadow"}
              px={3}
              py={4}
              backgroundColor={"white"}
            >
              {renderDropoutButton()}
              {renderReactivateButton()}
              {renderRejectButton()}
            </VStack>
          </VStack>
        </VStack>
      )}

      <Actionsheet
        isOpen={isOpenDropOut}
        onClose={(e) => setIsOpenDropOut(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenDropOut(false)}
              />
            </VStack>

            <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </FrontEndTypo.H1>
            <FrontEndTypo.H2 color="textGreyColor.450">
              {t("AG_PROFILE_DROPOUT_MESSAGE")}{" "}
            </FrontEndTypo.H2>
            <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REASON_MEASSGAE")}{" "}
            </FrontEndTypo.H2>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg" w="100%">
                <VStack alignItems="center" space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryDropoutReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reasonValue}
                      onChange={(e) => {
                        setReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  flex={1}
                  onPress={() => {
                    dropoutApiCall();
                  }}
                >
                  {t("MARK_AS_DROPOUT")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      <Actionsheet
        isOpen={isOpenReactive}
        onClose={(e) => setIsOpenReactive(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenReactive(false)}
              />
            </VStack>
            <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </FrontEndTypo.H1>
            <FrontEndTypo.H2 color="textGreyColor.450">
              {t("AG_PROFILE_REACTIVAYE_MESSAGE")}
            </FrontEndTypo.H2>
            <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REACTIVATE_REASON_MEASSGAE")}
            </FrontEndTypo.H2>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg">
                <VStack alignItems="center" bg={"gray.100"} space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryReactivateReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reactivateReasonValue}
                      onChange={(e) => {
                        setReactivateReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  flex={1}
                  onPress={() => {
                    reactivateApiCall();
                  }}
                >
                  {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      {/* Reject Action  Sheet */}
      <Actionsheet
        isOpen={isOpenReject}
        onClose={(e) => setIsOpenReject(false)}
      >
        <Actionsheet.Content>
          <VStack alignItems="end" width="100%">
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setIsOpenReject(false)}
            />
          </VStack>

          <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
            {t("AG_PROFILE_ARE_YOU_SURE")}
          </FrontEndTypo.H1>

          <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
            {t("PLEASE_MENTION_YOUR_REASON_FOR_REJECTING_THE_CANDIDATE")}
          </FrontEndTypo.H2>
          <VStack space="5">
            <VStack space="2" bg="gray.100" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <React.Suspense fallback={<HStack>{t("LOADING")}</HStack>}>
                  <CustomRadio
                    options={{
                      enumOptions: benificiaryRejectReasons?.map((e) => ({
                        ...e,
                        label: e?.title,
                        value: e?.value,
                      })),
                    }}
                    schema={{ grid: 2 }}
                    value={reasonValue}
                    onChange={(e) => {
                      setReasonValue(e);
                    }}
                  />
                </React.Suspense>
              </VStack>
            </VStack>
            <VStack space="5" pt="5">
              <FrontEndTypo.Primarybutton
                flex={1}
                onPress={() => {
                  RejectApiCall();
                }}
              >
                {t("REJECT")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Layout>
  );
}

BenificiaryProfileView.propTypes = {
  userTokenInfo: PropType.object,
};
