import {
  facilitatorRegistryService,
  IconByName,
  Layout,
  RedOutlineButton,
  FrontEndTypo,
  objProps,
  arrList,
} from "@shiksha/common-lib";
import { HStack, VStack, Stack, Image } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// styles
const styles = {
  inforBox: {
    style: {
      background:
        "linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)",
    },
  },
  AddAnAgShadowBox: {
    style: {
      boxShadow: "2px 3px 0px #790000",
      border: "1px solid #790000",
      borderRadius: "10px",
      padding: "50px",
    },
  },
};

export default function Dashboard({ userTokenInfo, footerLinks }) {
  const { t } = useTranslation();
  const [facilitator, setFacilitator] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    const res = objProps(facilitator);
    setProgress(
      arrList(
        {
          ...res,
          qua_name: facilitator?.qualifications?.qualification_master?.name,
        },
        [
          "device_ownership",
          "mobile",
          "device_type",
          "gender",
          "marital_status",
          "social_category",
          "name",
          "contact_number",
          "availability",
          "aadhar_no",
          "aadhaar_verification_mode",
          "aadhar_verified",
          "qualification_ids",
          "qua_name",
        ]
      )
    );
  }, [facilitator]);

  const isDocumentUpload = (key = "") => {
    let isAllow = 0;
    if (key === "" || key === "experience") {
      const expData = Array.isArray(facilitator?.experience)
        ? facilitator?.experience.filter((e) => e?.reference?.document_id)
        : [];
      if (expData?.length > 0) {
        isAllow++;
      }
      if (key === "experience") {
        if (expData?.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    }
    if (key === "" || key === "vo_experience") {
      const expData = facilitator?.vo_experience?.filter(
        (e) => e?.reference?.document_id
      );
      if (expData?.length > 0) {
        isAllow++;
      }
      if (key === "vo_experience") {
        if (expData?.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    }

    if (key === "" || key === "qualifications") {
      const expData =
        facilitator?.qualifications?.qualification_reference_document_id;
      if (expData) {
        isAllow++;
      }
      if (key === "qualifications") {
        if (expData) {
          return false;
        } else {
          return true;
        }
      }
    }
    return isAllow < 3;
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
        facilitator,
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="primary.50" pb="5" style={{ zIndex: -1 }}>
        <VStack space="5">
          <InfoBox status={facilitator?.status} progress={progress} />
          <Stack>
            <HStack py="6" flex="1" px="4">
              <Image
                source={{
                  uri: "/hello.svg",
                }}
                alt="Add AG"
                size={"30px"}
                resizeMode="contain"
              />
              <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
                {t("WELCOME")} {facilitator?.first_name},
              </FrontEndTypo.H1>
            </HStack>
          </Stack>
          {/* {["application_screened", "screened"].includes(
            facilitator.status
          ) && (
            <Stack>
              <Stack space="5" p="5">
                <FrontEndTypo.H3 bold>{t("INTERVIEW_DETAILS")}</FrontEndTypo.H3>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="UserLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>
                    {t("CONDUCTED_BY")}: IP Name
                  </FrontEndTypo.H3>
                </HStack>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="TimeLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>9th April, 11 am</FrontEndTypo.H3>
                </HStack>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="MapPinLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>{t("ONLINE")}: Google Meet</FrontEndTypo.H3>
                </HStack>
                <HStack space="2">
                  <FrontEndTypo.Secondarybutton width="50%">
                    {t("REJECT")}
                  </FrontEndTypo.Secondarybutton>
                  <FrontEndTypo.Primarybutton width="50%">
                    {t("ACCEPT")}
                  </FrontEndTypo.Primarybutton>
                </HStack>
              </Stack>
            </Stack>
          )} */}
          {/* {facilitator.status === "shortlisted_for_orientation" && (
            <Stack>
            <HStack
              {...styles.inforBox}
              p="5"
              borderBottomWidth="1"
              borderBottomColor={"gray.300"}
              shadows="BlueOutlineShadow"
            >
              <IconByName
                flex="0.1"
                isDisabled
                name="UserLineIcon"
                _icon={{ size: "25px" }}
              />
              <VStack flex="0.9">
                <FrontEndTypo.H3 bold>
                  {t("SHORTLISTED_FOR_ORIENTATION")}
                </FrontEndTypo.H3>
                <FrontEndTypo.H4>
                  {t("YOUR_IP_WILL_SHARE_DETAILS_SOON")}
                </FrontEndTypo.H4>
              </VStack>
            </HStack>
            </Stack>
          )} */}

          {/* Used shortlisted_for_orientation */}
          {/* {facilitator.status === "shortlisted_for_orientation" && (
            <Stack>
              <Stack bg="bgPinkColor.300" space="6" p={4}>
                <FrontEndTypo.H3 bold>
                  {t("ORIENTATION_DETAILS")}
                </FrontEndTypo.H3>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="UserLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>
                    {t("CONDUCTED_BY")}: IP Name
                  </FrontEndTypo.H3>
                </HStack>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="TimeLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>9th April, 11 am</FrontEndTypo.H3>
                </HStack>
                <HStack space="5">
                  <IconByName
                    isDisabled
                    name="MapPinLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3>{t("ONLINE")}: Google Meet</FrontEndTypo.H3>
                </HStack>
                <HStack space="2">
                  <FrontEndTypo.Secondarybutton width="50%">
                    {t("REJECT")}
                  </FrontEndTypo.Secondarybutton>
                  <FrontEndTypo.Primarybutton width="50%">
                    {t("ACCEPT")}
                  </FrontEndTypo.Primarybutton>
                </HStack>
                <HStack>
                  <IconByName
                    isDisabled
                    name="FileTextLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <FrontEndTypo.H3 bold space="1" pl="2">
                    {t("DOCUMENTS_YOU_NEED_TO_CARRY")}
                  </FrontEndTypo.H3>
                </HStack>
                <FrontEndTypo.H3>
                  {t("MAKE_SURE_YOU_HAVE_THE_FOLLOWING_LIST_OF_DOCUMENTS")}
                </FrontEndTypo.H3>
                <View style={{ marginBottom: 10 }} space="3">
                  <FrontEndTypo.H3
                    style={{ fontSize: 14 }}
                  >{`\u2022 Original Aadhaar Card`}</FrontEndTypo.H3>
                  <FrontEndTypo.H3
                    style={{ fontSize: 14 }}
                  >{`\u2022 Graduation Certificates`}</FrontEndTypo.H3>
                  <FrontEndTypo.H3
                    style={{ fontSize: 14 }}
                  >{`\u2022 Work Experience Proof`}</FrontEndTypo.H3>
                  <FrontEndTypo.H3
                    style={{ fontSize: 14 }}
                  >{`\u2022 Volunteer Experience Proof`}</FrontEndTypo.H3>
                </View>
              </Stack>
            </Stack>
          )} */}
          {/* <HStack
            space="2"
            alignItems="Center"
            width="100%"
            justifyContent="space-evenly"
            px="5"
          >
            <VStack space={2} width="50%">
              <Button alignItems="Center" variant="outline" py="5">
                <IconByName
                  isDisabled
                  name="UserAddLineIcon"
                  _icon={{ size: "60px" }}
                />
                <Text fontSize="md">{t("ADD_AN_AG")}</Text>
              </Button>
            </VStack>
            <VStack width="50%" space={2}>
              <Button variant="outline" py="5">
                <IconByName
                  isDisabled
                  name="BriefcaseLineIcon"
                  _icon={{ size: "60px" }}
                />
                <Text fontSize="md">{t("PRERAK_DUTIES")}</Text>
              </Button>
            </VStack>
          </HStack> */}
          {/* potential prerak */}
          {[
            "pragati_mobilizer",
            "selected_prerak",
            "selected_for_training",
            "selected_for_onboarding",
          ].includes(facilitator.status) && (
            <Stack>
              <RedOutlineButton
                background="#FCEEE2"
                mx="5"
                p="10"
                width="40%"
                shadow="RedBoxShadow"
                onPress={(e) => navigate("/beneficiary")}
              >
                <Image
                  source={{
                    uri: "/addAg.svg",
                  }}
                  alt="Add AG"
                  size={"sm"}
                  resizeMode="contain"
                />
                <FrontEndTypo.H4 color="textMaroonColor.400" bold>
                  {t("ADD_AN_AG")}
                </FrontEndTypo.H4>
              </RedOutlineButton>
              <Stack px="3">
                <FrontEndTypo.H2 bold mx="8" pb="5px" pt="10">
                  {t("ITS_TIME_TO_START_MOBILIZING")}
                </FrontEndTypo.H2>
                {/* <Alert mx={"3"} status="info" colorScheme="info" my="4">
                  <VStack space={"2"} flexShrink={"1"}>
                    <HStack
                      flexShrink={"1"}
                      space={"2"}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <HStack flexShrink={"1"} space={"2"} alignItems="center">
                        <Alert.Icon />
                        {t("YOU_WILL_NEED_TO_ENROLL_ATLEAST_15_AG_LEARNERS_TO")}
                      </HStack>
                    </HStack>
                  </VStack>
                </Alert> */}
              </Stack>
            </Stack>
          )}

          {["lead", "applied", ""]?.includes(facilitator.status) &&
            progress !== 100 && (
              <Stack>
                <VStack p="5" pt={1}>
                  <FrontEndTypo.Primarybutton
                    onPress={(e) => navigate("/profile/edit/basic_details")}
                    bold
                    flex="1"
                  >
                    {t("COMPLETE_FORM")}
                  </FrontEndTypo.Primarybutton>
                </VStack>
              </Stack>
            )}
          {!["yes", "in_progress"].includes(facilitator?.aadhar_verified) && (
            <Stack bg="white" space="5" p="5">
              <FrontEndTypo.H2 bold>
                {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
              </FrontEndTypo.H2>
              <FrontEndTypo.Primarybutton
                onPress={(e) =>
                  navigate(`/aadhaar-kyc/${facilitator?.id}/okyc2`, {
                    state: "/",
                  })
                }
                width="100%"
              >
                {t("AADHAR_NUMBER_KYC")}
              </FrontEndTypo.Primarybutton>
              {/* <FrontEndTypo.Secondarybutton
                width="100%"
                onPress={(e) =>
                  navigate(`/aadhaar-kyc/${facilitator?.id}/QR`, {
                    state: "/",
                  })
                }
              >
                {t("SCAN_QR_CODE")}
              </FrontEndTypo.Secondarybutton> */}
              <FrontEndTypo.Primarybutton
                onPress={() => {
                  navigate(`/aadhaar-kyc/${facilitator?.id}/upload`, {
                    state: "/",
                  });
                }}
              >
                {t("AADHAR_UPLOAD_KYC")}
              </FrontEndTypo.Primarybutton>
            </Stack>
          )}
          {isDocumentUpload() && (
            <Stack bg="bgPinkColor.300" space="6" p={4}>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("UPLOAD_YOUR_DOCUMENTS")}
              </FrontEndTypo.H2>
              <FrontEndTypo.H3>
                {t("YOU_NEED_TO_UPLOAD_THESE_DOCUMENTS")}
              </FrontEndTypo.H3>
              {isDocumentUpload("qualifications") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("QUALIFICATION_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_YOUR_HIGHEST_GRADE")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )}
              {isDocumentUpload("experience") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("WORK_EXPERIENCE_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_LETTER_OF")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )}
              {isDocumentUpload("vo_experience") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("VOLUNTEER_EXPERIENCE_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_REFERENCE_OR_LETTER_OF")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )}
              <HStack>
                <FrontEndTypo.Secondarybutton
                  width="100%"
                  endIcon={
                    <IconByName
                      isDisabled
                      name="Upload2FillIcon"
                      _icon={{ size: "25px" }}
                    />
                  }
                  onPress={(e) => navigate("/profile")}
                >
                  {t("UPLOAD_NOW")}
                </FrontEndTypo.Secondarybutton>
              </HStack>
            </Stack>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}

const InfoBox = ({ status, progress }) => {
  let infoBox;
  const { t } = useTranslation();

  switch (status) {
    case "application_screened":
    case "screened":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("SELECTED_FOR_INTERVIEW")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("CONGRATULATIONS_YOU_ARE_SELECTED_FOR_THE_INTERVIEW")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "shortlisted_for_orientation":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("SHORTLISTED_FOR_ORIENTATION")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("CONGRATULATIONS_YOURE_SHORTLISTED_FOR_THE_ORIENTATION")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "pragati_mobilizer":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "rusticate":
    case "quit":
    case "rejected":
      infoBox = (
        <HStack
          // {...styles.inforBox}
          bg="red.600"
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="Forbid2LineIcon"
            color="white"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold color="white">
              {t(status?.toUpperCase())}
            </FrontEndTypo.H3>
          </VStack>
        </HStack>
      );
      break;
    default:
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("YOUR_APPLICATION_IS_UNDER_REVIEW")}
            </FrontEndTypo.H3>
            {progress === 100 ? (
              <FrontEndTypo.H4>{t("PROFILE_COMPLETED")}</FrontEndTypo.H4>
            ) : (
              <FrontEndTypo.H4>{t("MEANWHILE_PROFILE")}</FrontEndTypo.H4>
            )}
          </VStack>
        </HStack>
      );
      break;
  }

  return infoBox;
};
