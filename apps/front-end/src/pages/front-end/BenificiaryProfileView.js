import React from "react";
import { useParams } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Actionsheet,
} from "native-base";
import {
  FrontEndTypo,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  t,
} from "@shiksha/common-lib";
import CustomRadio from "component/CustomRadio";
import { useNavigate } from "react-router-dom";

import Chip from "component/Chip";

const dropoutReasons = [
  {
    label: "Family issue",
    value: "family_issue",
  },
  {
    label: "Community Issue",
    value: "community_issue",
  },
  {
    label: "Getting Married",
    value: "getting_married",
  },
  {
    label: "Personal Reasons",
    value: "personal_reasons",
  },
  {
    label: "Moving away",
    value: "moving_away",
  },
  {
    label: "Other",
    value: "other",
  },
];

const reactivateReasons = [
  {
    label: "Career Aspirations",
    value: "career_aspirations",
  },
  {
    label: "Convinced by Prerak",
    value: "convinced_by_prerak",
  },
  {
    label: "Moved back",
    value: "moved_back",
  },
  {
    label: "Issue Resolved",
    value: "issue_resolved",
  },
  {
    label: "Changed Mind",
    value: "changed_mind",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default function BenificiaryProfileView(props) {
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);

  const [reactivatemodalVisible, setreactivateModalVisible] =
    React.useState(false);
  const [reasonValue, setReasonValue] = React.useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);

    setBenificiary(result?.result);
  };

  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState({});
  const dropoutApiCall = async () => {
    let bodyData = {
      id: benificiary?.program_beneficiaries?.id.toString(),
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
      id: benificiary?.program_beneficiaries?.id.toString(),
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
          <VStack alignItems="Center">
            <IconByName
              name="AccountCircleLineIcon"
              color="textGreyColor.200"
              _icon={{ size: "80" }}
            />
            <FrontEndTypo.H2 bold color="textMaroonColor.400">
              {benificiary?.first_name}
              {benificiary?.last_name && ` ${benificiary?.last_name}`}
            </FrontEndTypo.H2>
            <Box>{benificiary?.status || "unidentified"}</Box>
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

          {/* <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("CAMP_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box> */}

          {/* <Box
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
                  color="textMaroonColor.400"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>

          </Box> */}
          {benificiary?.program_beneficiaries?.status === "identified" ||
          benificiary?.program_beneficiaries?.status === "ready_to_enroll" ||
          benificiary?.program_beneficiaries?.status === "enrolled" ||
          benificiary?.program_beneficiaries?.status === "approved_ip" ||
          benificiary?.program_beneficiaries?.status === "registered_in_camp" ||
          benificiary?.program_beneficiaries?.status === "pragati_syc" ||
          benificiary?.program_beneficiaries?.status === "activate" ||
          benificiary?.program_beneficiaries?.status === null ? (
            <FrontEndTypo.Disablebutton
              onPress={(e) => setIsOpenDropOut(true)}
              leftIcon={<IconByName name="UserUnfollowLineIcon" isDisabled />}
            >
              {t("MARK_AS_DROPOUT")}
            </FrontEndTypo.Disablebutton>
          ) : (
            <React.Fragment></React.Fragment>
          )}

          {benificiary?.program_beneficiaries?.status === "rejected" ||
          benificiary?.program_beneficiaries?.status === "dropout" ? (
            <FrontEndTypo.Disablebutton
              onPress={(e) => setIsOpenReactive(true)}
            >
              {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
            </FrontEndTypo.Disablebutton>
          ) : (
            <React.Fragment></React.Fragment>
          )}
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
                <CustomRadio
                  options={{ enumOptions: dropoutReasons }}
                  schema={{ grid: 2 }}
                  value={reasonValue}
                  onChange={(e) => {
                    setReasonValue(e);
                  }}
                />
              </VStack>
            </VStack>
            <VStack space="5" pt="5">
              <FrontEndTypo.Disablebutton
                flex={1}
                onPress={() => {
                  dropoutApiCall();
                }}
              >
                {t("MARK_AS_DROPOUT")}
              </FrontEndTypo.Disablebutton>
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
            <VStack space="2" bg="gray.100" p="1" rounded="lg">
              <VStack alignItems="center" space="1" flex="1">
                <CustomRadio
                  options={{ enumOptions: reactivateReasons }}
                  schema={{ grid: 2 }}
                  value={reactivateReasonValue}
                  onChange={(e) => {
                    setReactivateReasonValue(e);
                  }}
                />
              </VStack>
            </VStack>
            <VStack space="3">
              <FrontEndTypo.Disablebutton
                flex={1}
                onPress={() => {
                  reactivateApiCall();
                }}
              >
                {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
              </FrontEndTypo.Disablebutton>
            </VStack>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Layout>
  );
}
