import {
  facilitatorRegistryService,
  IconByName,
  Layout,
  RedOutlineButton,
  FrontEndTypo,
  objProps,
  arrList,
  BodyMedium,
  AdminTypo,
  testRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack, Stack, Image, Alert, Modal } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
  const [certificateData, setCertificateData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const fa_id = localStorage.getItem("id");
  const [isEventActive, setIsEventActive] = React.useState(false);
  const [lmsDEtails, setLmsDetails] = React.useState();
  const { id } = userTokenInfo?.authUser || [];
  const [random, setRandom] = React.useState();
  const [events, setEvents] = React.useState("");
  let score = process.env.REACT_APP_SCORE || 79.5;
  let floatValue = parseFloat(score);

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
      const c_data =
        await facilitatorRegistryService.getPrerakCertificateDetails({
          id: fa_id,
        });
      const data =
        c_data?.data?.filter(
          (e) => e?.type === "prerak_camp_execution_training"
        )?.[0] || {};
      setCertificateData(data);
      if (data?.lms_test_tracking?.length > 0) {
        setLmsDetails(data?.lms_test_tracking?.[0]);
      }

      const dataDay = moment.utc(data?.end_date).isSame(moment(), "day");
      const format = "HH:mm:ss";
      const time = moment(moment().format(format), format);
      const beforeTime = moment(data?.start_time, format);
      const afterTime = moment(data?.end_time, format);
      if (time?.isBetween(beforeTime, afterTime) && dataDay) {
        setIsEventActive(true);
      }
    }
    setLoading(false);
  }, []);

  React.useEffect(async () => {
    const getCertificate = await testRegistryService.getCertificate({
      id,
    });
    if (getCertificate?.data?.length > 0) {
      setLmsDetails(getCertificate?.data?.[0]);
    }
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

  const handleRandomise = async () => {
    const doIdArray = modalVisible?.params?.do_id;
    console.log({ doIdArray });
    if (typeof doIdArray === "string") {
      return doIdArray;
    }

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomizedDoId = doIdArray[array[0] % doIdArray.length];
    setRandom(randomizedDoId);
    return randomizedDoId;
  };

  const startTest = async () => {
    try {
      const randomizedDoId = await handleRandomise();
      navigate(`/assessment/events/${modalVisible?.id}/${randomizedDoId}`);
      navigate(0);
    } catch (error) {
      console.error("Error handling randomization:", error);
    }
  };

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
        return expData?.length <= 0;
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
        return expData?.length <= 0;
      }
    }

    if (key === "" || key === "qualifications") {
      const expData =
        facilitator?.qualifications?.qualification_reference_document_id;
      if (expData) {
        isAllow++;
      }
      if (key === "qualifications") {
        return !expData;
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
          {facilitator?.status === "applied" && (
            <InfoBox status={facilitator?.status} progress={progress} />
          )}
          <Stack>
            {facilitator?.program_faciltators?.status ===
              "selected_for_onboarding" &&
              progress !== 100 && (
                <Alert status="warning" alignItems={"start"}>
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>
                      {t("SELECTED_FOR_ONBOARDING_CONGRATULATIONS_MESSAGE")}
                    </BodyMedium>
                  </HStack>
                </Alert>
              )}
            <HStack py="4" flex="1" px="4">
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
            {isEventActive
              ? certificateData?.type == "prerak_camp_execution_training" && (
                  <HStack py="2" flex="1" px="4">
                    <FrontEndTypo.Primarybutton
                      onPress={() => {
                        setModalVisible(certificateData);
                        const doIdArray = certificateData?.params?.do_id;
                        if (doIdArray == null || doIdArray.length === 0) {
                          setEvents("EVENT_ASSESSMENT_NOT_AVAILABLE_MESSAGE");
                        } else {
                          setEvents("TAKE_TEST");
                        }
                      }}
                    >
                      {t("PRERAK_CERTIFICATION_PROGRAM")}
                    </FrontEndTypo.Primarybutton>
                  </HStack>
                )
              : lmsDEtails?.id && (
                  <HStack py="2" flex="1" px="4">
                    <FrontEndTypo.Primarybutton
                      fontSize
                      onPress={() => {
                        setModalVisible(certificateData);
                      }}
                    >
                      {t("PRERAK_CERTIFICATION_PROGRAM")}
                    </FrontEndTypo.Primarybutton>
                  </HStack>
                )}
            <Modal
              isOpen={modalVisible}
              onClose={() => setModalVisible()}
              avoidKeyboard
              size="md"
            >
              <Modal.Content>
                <Modal.Header alignItems={"center"}>
                  <HStack alignItems={"center"}>
                    <AdminTypo.H4 color="textGreyColor.500">
                      {t("PRERAK_CERTIFICATION_PROGRAM")}
                    </AdminTypo.H4>
                  </HStack>
                </Modal.Header>
                <Modal.Body alignItems="center">
                  <VStack>
                    {lmsDEtails === undefined && (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(events)}
                      </AdminTypo.H3>
                    )}
                    {lmsDEtails?.certificate_status === null ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t("CERTIFICATION_IS_PENDING")}
                      </AdminTypo.H3>
                    ) : lmsDEtails?.certificate_status === false &&
                      lmsDEtails?.score >= floatValue ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(`TRAINING_INCOMPLETE`)}
                        {lmsDEtails.score + "%"}
                      </AdminTypo.H3>
                    ) : lmsDEtails?.certificate_status === true ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(`TRAINING_TEST_DOWNLOAD_CERTIFICATE`)}
                        {lmsDEtails.score + "%"}
                      </AdminTypo.H3>
                    ) : lmsDEtails?.certificate_status === false ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t("TRAINING_NOT_PASSED")}
                      </AdminTypo.H3>
                    ) : (
                      <></>
                    )}
                  </VStack>
                </Modal.Body>
                <Modal.Footer alignSelf={"center"}>
                  <HStack space={"6"}>
                    {lmsDEtails === undefined ||
                      (lmsDEtails?.certificate_status === true && (
                        <FrontEndTypo.DefaultButton
                          textColor={"black"}
                          onPress={() => {
                            setModalVisible();
                          }}
                        >
                          {t("GO_BACK")}
                        </FrontEndTypo.DefaultButton>
                      ))}
                    {lmsDEtails?.certificate_status === false && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={() => {
                          setModalVisible();
                        }}
                      >
                        {t("OK")}
                      </FrontEndTypo.DefaultButton>
                    )}
                    {lmsDEtails === undefined &&
                      !(
                        certificateData?.params?.do_id == null ||
                        (Array.isArray(certificateData?.params?.do_id) &&
                          certificateData?.params?.do_id?.length === 0)
                      ) && (
                        <FrontEndTypo.DefaultButton
                          background={"textRed.400"}
                          onPress={startTest}
                        >
                          {t("START_TEST")}
                        </FrontEndTypo.DefaultButton>
                      )}
                    {lmsDEtails?.certificate_status === true && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={() => {
                          navigate(`/certificate`);
                        }}
                      >
                        {t("VIEW_CERTIFICATE")}
                      </FrontEndTypo.DefaultButton>
                    )}
                  </HStack>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Stack>
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
                shadow="RedBlackShadow"
                onPress={(e) => navigate("/beneficiary")}
              >
                <Image
                  source={{
                    uri: "/images/learner/add_learner.png",
                  }}
                  alt="Add AG"
                  size={"sm"}
                  resizeMode="contain"
                />
                <FrontEndTypo.H4 mt="2" color="textBlack.500" bold>
                  {t("ADD_AN_AG")}
                </FrontEndTypo.H4>
              </RedOutlineButton>
              <Stack px="3">
                {facilitator?.program_faciltators?.status ===
                  "pragati_mobilizer" && (
                  <FrontEndTypo.H2 bold mx="8" pb="5px" pt="10">
                    {t("ITS_TIME_TO_START_MOBILIZING")}
                  </FrontEndTypo.H2>
                )}
              </Stack>
            </Stack>
          )}
          {["applied", ""]?.includes(facilitator.status) &&
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
          {!["yes"].includes(facilitator?.aadhar_verified) && (
            <Stack p="5">
              {[undefined].includes(facilitator?.aadhar_no) && (
                <Stack space="3">
                  <Alert status="warning" alignItems={"start"}>
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>
                        {t("ADD_AADHAAR_NUMBER_ERROR_MESSAGE")}
                      </BodyMedium>
                    </HStack>
                  </Alert>
                  <FrontEndTypo.Primarybutton
                    onPress={(e) => navigate(`/profile/edit/aadhaar_details`)}
                  >
                    {t("ADD_AADHAAR_NUMBER")}
                  </FrontEndTypo.Primarybutton>
                </Stack>
              )}
              {["upload"].includes(facilitator?.aadhaar_verification_mode) && (
                <Stack space="3">
                  <Alert status="warning" alignItems={"start"}>
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>
                        {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
                      </BodyMedium>
                    </HStack>
                  </Alert>
                  <FrontEndTypo.Primarybutton
                    onPress={(e) =>
                      navigate(`/aadhaar-kyc/${facilitator?.id}/okyc2`, {
                        state: "/",
                      })
                    }
                  >
                    {t("AADHAR_NUMBER_KYC")}
                  </FrontEndTypo.Primarybutton>
                </Stack>
              )}
            </Stack>
          )}
          {isDocumentUpload() && (
            <Stack bg="bgYellowColor.400" space="6" p={4}>
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
                      color="gray.800"
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
    case "on_hold":
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
