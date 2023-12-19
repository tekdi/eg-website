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
  Layout,
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

export default function BenificiaryProfileView(props) {
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);
  const [isOpenReject, setIsOpenReject] = React.useState(false);
  const [loading, setloading] = React.useState(true);
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

  React.useEffect(() => {
    if (benificiary?.aadhar_no === null) {
      setAlert(t("AADHAAR_REQUIRED_MESSAGE"));
    } else {
      setAlert();
    }
  }, [benificiary]);

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
  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    setloading(false);
  }, [reactivateReasonValue, reasonValue]);

  function renderDropoutButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      case "enrolled":
      case "approved_ip":
      case "registered_in_camp":
      case "pragati_syc":
      case "activate":
      case "enrolled_ip_verified":
      case null:
        return (
          <FrontEndTypo.Secondarybutton
            onPress={(e) => setIsOpenDropOut(true)}
            leftIcon={<IconByName name="UserUnfollowLineIcon" isDisabled />}
          >
            {t("MARK_AS_DROPOUT")}
          </FrontEndTypo.Secondarybutton>
        );
      default:
        return <React.Fragment></React.Fragment>;
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
        return <React.Fragment></React.Fragment>;
    }
  }

  function renderRejectButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      case "enrolled":
      case "approved_ip":
      case "registered_in_camp":
      case "pragati_syc":
      case "activate":
      case "enrolled_ip_verified":
      case null:
        return (
          <FrontEndTypo.Secondarybutton
            onPress={(e) => setIsOpenReject(true)}
            leftIcon={<IconByName name="UserUnfollowLineIcon" isDisabled />}
          >
            {t("REJECT")}
          </FrontEndTypo.Secondarybutton>
        );
      default:
        return <React.Fragment></React.Fragment>;
    }
  }

  return (
    <Layout
      _appBar={{
        name: t("BENEFICIARY_PROFILE"),
        onPressBackButton: (e) => {
          navigate(-1);
        },
      }}
      loading={loading}
    >
      {benificiary?.is_deactivated ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("DEACTIVATED_PAGE_MSG")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
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

              {benificiary?.program_beneficiaries?.status !==
              "enrolled_ip_verified" ? (
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
                      "PLEASE_REACTIVATE_THE_LEARNER_TO_ACCESS_THE_DETAILS_TAB"
                    )}
                  </BodyMedium>
                </HStack>
              </Alert>
            )}
            <Box
              bg="boxBackgroundColour.100"
              borderColor="btnGray.100"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <FrontEndTypo.H3 bold color="textGreyColor.800">
                  {t("PROFILE_DETAILS")}
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

                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/basicdetails`);
                          }}
                          color="textMaroonColor.400"
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
                      <IconByName
                        name="MapPinLineIcon"
                        _icon={{ size: "20" }}
                      />

                      <FrontEndTypo.H3 color="textGreyColor.800">
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
                          color="textMaroonColor.400"
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
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
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
                    color="textMaroonColor.400"
                  />
                )}
              </HStack>
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                pr="0"
                p="3"
              >
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("EDUCATION_DETAILS")}
                </FrontEndTypo.H3>
                {benificiary?.program_beneficiaries?.status !== "dropout" &&
                  benificiary?.program_beneficiaries?.status !== "rejected" && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={(e) => {
                        navigate(`/beneficiary/${id}/educationdetails`);
                      }}
                      color="textMaroonColor.400"
                    />
                  )}
              </HStack>
              {alert && (
                <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>{alert}</BodyMedium>
                  </HStack>
                </Alert>
              )}
              {benificiary?.aadhar_no === null ? (
                <HStack
                  justifyContent="space-between"
                  alignItems="Center"
                  p="3"
                >
                  <FrontEndTypo.H3 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H3>
                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        color="textMaroonColor.400"
                        size="sm"
                      />
                    )}
                </HStack>
              ) : (
                <HStack
                  justifyContent="space-between"
                  alignItems="Center"
                  p="3"
                  pr="0"
                >
                  <FrontEndTypo.H3 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H3>

                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={(e) => {
                          navigate(`/beneficiary/${id}/enrollmentdetails`);
                        }}
                        color="textMaroonColor.400"
                      />
                    )}
                </HStack>
              )}
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="1"
              >
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("PCR_DETAILS")}
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
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="1"
              >
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("JOURNEY_IN_PROJECT_PRAGATI")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/BenificiaryJourney`);
                  }}
                />
              </HStack>
            </VStack>
            {renderDropoutButton()}
            {renderReactivateButton()}
            {renderRejectButton()}
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

            <FrontEndTypo.H1 bold color="textGreyColor.450">
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
            <FrontEndTypo.H1 bold color="textGreyColor.450">
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

          <FrontEndTypo.H1 bold color="textGreyColor.450">
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
