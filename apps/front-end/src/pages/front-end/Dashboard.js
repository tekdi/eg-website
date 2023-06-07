import {
  BodySmall,
  facilitatorRegistryService,
  H2,
  IconByName,
  Layout,
  t,
  ButtonStyle,
  SelectStyle,
  RedOutlineButton,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import {
  HStack,
  Pressable,
  VStack,
  Box,
  Stack,
  Button,
  Text,
  View,
  Center,
  Alert,
  Badge,
  Select,
  Image,
  selected,
  Container,
} from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;

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

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  return (
    <Layout
      _appBar={{
        profile_url: facilitator?.documents?.[0]?.name,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="primary.50" pb="5">
        <VStack space="5">
          {["lead", "applied", ""].includes(facilitator.status) && (
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
                    {t("YOUR_APPLICATION_IS_UNDER_REVIEW")}
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H4>{t("MEANWHILE_PROFILE")}</FrontEndTypo.H4>
                </VStack>
              </HStack>
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
          )}
          {facilitator.status === "application_screened" ||
            (facilitator.status === "screened" && (
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
                      {t("SELECTED_FOR_INTERVIEW")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("CONGRATULATIONS_YOU_ARE_SELECTED_FOR_THE_INTERVIEW")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
                <Stack space="5" p="5">
                  <FrontEndTypo.H3 bold>
                    {t("INTERVIEW_DETAILS")}
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
                    <FrontEndTypo.H3>
                      {t("ONLINE")}: Google Meet
                    </FrontEndTypo.H3>
                  </HStack>
                  <HStack space="2">
                    <FrontEndTypo.Secondarybutton width="50%">
                      {t("REJECT")}
                    </FrontEndTypo.Secondarybutton>
                    <FrontEndTypo.Primarybutton width="50%">
                      {t("ACCEPT")}
                    </FrontEndTypo.Primarybutton>
                  </HStack>
                  <HStack flex="1" my="6">
                    <Image
                      source={{
                        uri: "/hello.svg",
                      }}
                      alt="Add AG"
                      size={"30px"}
                      resizeMode="contain"
                    />
                    <FrontEndTypo.H1 color="textMaroonColor.400">
                      {t("WELCOME")} {facilitator?.first_name},
                    </FrontEndTypo.H1>
                  </HStack>
                </Stack>
                <Stack bg="white" space="5" p="5">
                  <FrontEndTypo.H2 bold>
                    {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
                  </FrontEndTypo.H2>
                  <FrontEndTypo.Primarybutton width="100%">
                    {t("AADHAR_NUMBER_KYC")}
                  </FrontEndTypo.Primarybutton>
                  <FrontEndTypo.Secondarybutton width="100%">
                    {t("SCAN_QR_CODE")}
                  </FrontEndTypo.Secondarybutton>
                </Stack>
                <Stack bg="bgPinkColor.300" space="6" p={4}>
                  <FrontEndTypo.H2 color="textMaroonColor.400">
                    {t("UPLOAD_YOUR_DOCUMENTS")}
                  </FrontEndTypo.H2>
                  <FrontEndTypo.H3>
                    {t("YOU_NEED_TO_UPLOAD_THESE_DOCUMENTS")}
                  </FrontEndTypo.H3>
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
                    >
                      {t("UPLOAD_NOW")}
                    </FrontEndTypo.Secondarybutton>
                  </HStack>
                </Stack>
              </Stack>
            ))}
          {/* {facilitator.status==="shortlisted_for_orientation" &&
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
            <HStack flex="1" py="6" px="4">
               <Image
              source={{
                uri: "/hello.svg",
              }}
              alt="Add AG"
              size={"30px"}
              resizeMode="contain"
            />
              <FrontEndTypo.H1 color="textMaroonColor.400">
                {t("WELCOME")} {facilitator?.first_name},
              </FrontEndTypo.H1>
            </HStack>
            {facilitator.status==="applied"&&<Stack bg="white" space="5" p="5">
              <FrontEndTypo.H2 bold>
                {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
              </FrontEndTypo.H2>
              <FrontEndTypo.Primarybutton
                width="100%"
                {t("AADHAR_NUMBER_KYC")}
              ></FrontEndTypo.Primarybutton>
              <FrontEndTypo.Secondarybutton
                width="100%"
                {t("SCAN_QR_CODE")}
              ></FrontEndTypo.Secondarybutton>
            </Stack>}
          </Stack>} */}
          {facilitator.status === "shortlisted_for_orientation" && (
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
                    {t("CONGRATULATIONS_YOURE_SHORTLISTED_FOR_THE_ORIENTATION")}
                  </FrontEndTypo.H4>
                </VStack>
              </HStack>{" "}
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
              <HStack flex="1" my="6">
                <Image
                  source={{
                    uri: "/hello.svg",
                  }}
                  alt="Add AG"
                  size={"32px"}
                  resizeMode="contain"
                />
                <FrontEndTypo.H1 color="textMaroonColor.400">
                  {t("WELCOME")} {facilitator?.first_name},
                </FrontEndTypo.H1>
              </HStack>
              <Stack bg="white" space="5" p="5">
                <FrontEndTypo.H2 bold>
                  {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
                </FrontEndTypo.H2>
                <FrontEndTypo.Primarybutton width="100%">
                  {t("AADHAR_NUMBER_KYC")}
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton width="100%">
                  {t("SCAN_QR_CODE")}
                </FrontEndTypo.Secondarybutton>
              </Stack>
              <Stack bg="bgPinkColor.300" space="6" p={4}>
                <FrontEndTypo.H2 color="textMaroonColor.400">
                  {t("UPLOAD_YOUR_DOCUMENTS")}
                </FrontEndTypo.H2>
                <FrontEndTypo.H3>
                  {t("YOU_NEED_TO_UPLOAD_THESE_DOCUMENTS")}
                </FrontEndTypo.H3>
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
                  >
                    {t("UPLOAD_NOW")}
                  </FrontEndTypo.Secondarybutton>
                </HStack>
              </Stack>
            </Stack>
          )}
          {/* <HStack space="2" alignItems="Center" width="100%" justifyContent="space-evenly" px="5">
              <VStack  space={2} width="50%">
                <Button alignItems="Center" variant='outline'  py="5">
                    <IconByName
                        isDisabled
                        name="UserAddLineIcon"
                        _icon={{ size: "60px" }}
                      />
                      <Text fontSize="md">{t("ADD_AN_AG")}</Text>
                </Button>
              </VStack>
            
              <VStack width="50%" space={2} >
              <Button  variant='outline'   py="5">
                <IconByName
                    isDisabled
                    name="BriefcaseLineIcon"
                    _icon={{ size: "60px" }}
                  />
                  <Text fontSize="md">{t("PRERAK_DUTIES")}</Text>
                </Button>
              </VStack>
          </HStack> */}
          {/* potential prerak  */}
          {["potential_prerak"].includes(facilitator.status) && (
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
                    {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H4>
                    {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
                  </FrontEndTypo.H4>
                </VStack>
              </HStack>
              <HStack flex="1" p="3" my="6">
                <FrontEndTypo.H1 color="textMaroonColor.400">
                  {t("WELCOME")} {facilitator?.first_name},
                </FrontEndTypo.H1>
              </HStack>
              <RedOutlineButton
                background="#FCEEE2"
                mx="5"
                p="10"
                width="40%"
                shadow="RedBoxShadow"
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
                <Alert mx={"3"} status="info" colorScheme="info" my="4">
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
                </Alert>
                <FrontEndTypo.Secondarybutton width="100%">
                  <FrontEndTypo.H4 bold color="textMaroonColor.400">
                    {t("ADD_AN_AG_LEARNER")}{" "}
                  </FrontEndTypo.H4>
                </FrontEndTypo.Secondarybutton>
              </Stack>
            </Stack>
          )}
          {["lead", "applied", ""].includes(facilitator.status) && (
            <Stack>
              <VStack p="5" space="5">
                {!form_step_number ||
                (form_step_number && parseInt(form_step_number) < 10) ? (
                  <Pressable onPress={(e) => navigate("/form")}>
                    <HStack
                      borderWidth="1"
                      p="5"
                      rounded="full"
                      justifyContent="center"
                    >
                      <FrontEndTypo.H2>{t("COMPLETE_FORM")}</FrontEndTypo.H2>
                    </HStack>
                  </Pressable>
                ) : (
                  <React.Fragment />
                )}
                <ChipStatus
                  status={facilitator?.status}
                  flex="1"
                  py="5"
                  rounded="full"
                  _text={{ textAlign: "center", textTransform: "capitalize" }}
                  justifyContent="center"
                />
              </VStack>
              <VStack>
                <Pressable
                  alignItems={"center"}
                  onPress={(e) => navigate("/beneficiary")}
                >
                  <HStack
                    borderWidth="1"
                    p="3"
                    rounded="full"
                    justifyContent="center"
                    width={"300px"}
                  >
                    <FrontEndTypo.H2>
                      {t("CREATE_BENEFICIARIES")}
                    </FrontEndTypo.H2>
                  </HStack>
                </Pressable>
              </VStack>
            </Stack>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}
