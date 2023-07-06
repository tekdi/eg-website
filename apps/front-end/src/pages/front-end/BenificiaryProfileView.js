import React from "react";
import { useParams } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Actionsheet,
  Alert,
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
} from "@shiksha/common-lib";
import CustomRadio from "component/CustomRadio";
import { useNavigate } from "react-router-dom";

import { ChipStatus } from "component/BeneficiaryStatus";

export default function BenificiaryProfileView(props) {
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);
  const [isOpenReject, setIsOpenReject] = React.useState(false);

  const [reactivatemodalVisible, setreactivateModalVisible] =
    React.useState(false);
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
  const navigate = useNavigate();

  React.useEffect(() => {
    enumAPicall();
  }, []);

  React.useEffect(() => {
    if (benificiary?.aadhar_no === null) {
      setAlert(t("AADHAAR_REQUIRED_MESSAGE"));
    } else {
      setAlert();
    }
  }, [benificiary]);

  const enumAPicall = async () => {
    const result = await enumRegistryService.listOfEnum();
    setBenificiaryDropoutReasons(result?.data?.DROPOUT_REASONS);
    setBenificiaryReactivateReasons(result?.data?.REACTIVATE_REASONS);
    setBenificiaryRejectReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER
    );
  };

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);

    setBenificiary(result?.result);
  };

  const dropoutApiCall = async () => {
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "dropout",
      reason_for_status_update: reasonValue,
    };

    const result = await benificiaryRegistoryService.statusUpdate(bodyData);

    if (result) {
      setReasonValue("");
      setIsOpenDropOut(false);
    }
  };

  const reactivateApiCall = async () => {
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "activate",
      reason_for_status_update: reactivateReasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setReactivateReasonValue("");
      setreactivateModalVisible(false);
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
  React.useEffect(() => {
    benificiaryDetails();
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
          navigate(`/beneficiary/list`);
        },
      }}
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
            <FrontEndTypo.H2 bold color="textMaroonColor.400">
              {benificiary?.first_name}
              {benificiary?.middle_name &&
                benificiary?.middle_name !== "null" &&
                ` ${benificiary.middle_name}`}
              {benificiary?.last_name &&
                benificiary?.last_name !== "null" &&
                ` ${benificiary?.last_name}`}
            </FrontEndTypo.H2>

            <ChipStatus
              status={benificiary?.program_beneficiaries?.status}
              rounded={"sm"}
            />
          </VStack>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("PROFILE_DETAILS")}
              </FrontEndTypo.H3>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
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
                      {t("ADD_YOUR_ADDRESS")}
                    </FrontEndTypo.H3>
                  </HStack>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/beneficiary/edit/${id}/address`);
                    }}
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
                      {t("AADHAAR_DETAILS")}
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

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("DOCUMENT_CHECKLIST")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  size="sm"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/docschecklist`);
                  }}
                />
              </HStack>
            </VStack>
          </Box>
          {alert ? (
            <Alert status="warning" alignItems={"start"} mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{alert}</BodyMedium>
              </HStack>
            </Alert>
          ) : (
            <React.Fragment />
          )}
          {benificiary?.aadhar_no === null ? (
            <Box
              bg="boxBackgroundColour.100"
              borderColor="btnGray.100"
              borderRadius="10px"
              borderWidth="1px"
              paddingBottom="24px"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H3>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="#790000"
                    size="sm"
                  />
                </HStack>
              </VStack>
            </Box>
          ) : (
            <Box
              bg="boxBackgroundColour.100"
              borderColor="btnGray.100"
              borderRadius="10px"
              borderWidth="1px"
              paddingBottom="24px"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H3>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="#790000"
                    size="sm"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/enrollmentdetails`);
                    }}
                  />
                </HStack>
              </VStack>
            </Box>
          )}
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("EDUCATION_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/educationdetails`);
                  }}
                />
              </HStack>
            </VStack>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
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
          </Box>
          {renderDropoutButton()}
          {renderReactivateButton()}
          {renderRejectButton()}
        </VStack>
      </VStack>
      <Actionsheet
        isOpen={isOpenDropOut}
        onClose={(e) => setIsOpenDropOut(false)}
      >
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
          <VStack space="5">
            <VStack space="2" bg="gray.100" p="1" rounded="lg" w="100%">
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
                flex={1}
                onPress={() => {
                  dropoutApiCall();
                }}
              >
                {t("MARK_AS_DROPOUT")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>

      <Actionsheet
        isOpen={isOpenReactive}
        onClose={(e) => setIsOpenReactive(false)}
      >
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
            {t("AG_PROFILE_REACTIVAYE_MESSAGE")}{" "}
          </FrontEndTypo.H2>
          <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
            {t("AG_PROFILE_REACTIVATE_REASON_MEASSGAE")}{" "}
          </FrontEndTypo.H2>
          <VStack space="5">
            <VStack space="2" bg="textMaroonColor.100" p="1" rounded="lg">
              <VStack alignItems="center" space="1" flex="1">
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
            <VStack space="3">
              <FrontEndTypo.Primarybutton
                flex={1}
                onPress={() => {
                  reactivateApiCall();
                }}
              >
                {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </VStack>
        </Actionsheet.Content>
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
