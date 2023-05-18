import {
  BodySmall,
  facilitatorRegistryService,
  H2,
  IconByName,
  Layout,
  t,
  ButtonStyle,
  SelectStyle
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, Pressable, VStack, Box, Stack, Button,Text,View, Center ,NativeBaseProvider,selected,Alert,Badge,Select,Image} from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ userTokenInfo }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;

  const styles = {
    inforBox: { style: {background: 'linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)'}},
    AddAnAgShadowBox: { style: { boxShadow: '2px 3px 0px #790000' ,  border:'1px solid #790000', borderRadius:'10px', padding:'50px'}},
  }

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  return (
    <Layout _appBar={{ profile_url: facilitator?.documents?.[0]?.name }}>
      <VStack space="5" bg="gray.200">
        <HStack
          p="5"
          space="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          bg="info.200"
          {... styles.inforBox}
        >
          <IconByName
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack >
            <Box>
              <H2>{t("APPLICATION_UNDER_REVIEW")}</H2>
              <BodySmall>{t("MEANWHILE_PROFILE")}</BodySmall>
            </Box>
          </VStack>
          <Text fontSize="lg" bold color="textMaroonColor.400" pl="1">{t("WELCOME")} Rachana</Text>

        </HStack>
        <Stack  bg="bgPinkColor.300" space="6" p={4}>  
        <Text fontSize="lg" bold color="textMaroonColor.400">{t("UPLOAD_YOUR_DOCUMENTS")}</Text>
            <Text fontSize="sm">You need to upload these documents before attending your Pragati orientation</Text>
            <HStack space="2">
              <IconByName
                  isDisabled
                  name="CheckboxCircleLineIcon"
                  _icon={{ size: "20px" }}
                />
                <VStack>
                <Text fontSize="sm" bold>{t("QUALIFICATION_PROOF")}</Text>
                <Text fontSize="xs">(This can be your highest grade or graduation certificate)</Text>
                </VStack>
            </HStack>
            <HStack space="2">
              <IconByName
                  isDisabled
                  name="CheckboxCircleLineIcon"
                  _icon={{ size: "20px" }}
                />
                <VStack>
                    <Text fontSize="sm" bold>{t("WORK_EXPERIENCE_PROOF")}</Text>
                    <Text fontSize="xs">(This can be letter of recommendation from your company/workplace)</Text>
                </VStack>
            </HStack>
            <HStack space="2">
              <IconByName
                  isDisabled
                  name="CheckboxCircleLineIcon"
                  _icon={{ size: "20px" }}
                />
                <VStack>
                  <Text fontSize="sm" bold>{t("VOLUNTEER_EXPERIENCE_PROOF")}</Text>
                  <Text fontSize="xs">(This can be references or letter of recommendation from the organization)</Text>
                </VStack>
            </HStack>
            <HStack>
              
          <ButtonStyle shadow="RedFillShadow"  width="100%" fontSize="lg" endIcon={<IconByName
                  isDisabled
                  name="Upload2FillIcon"
                  _icon={{ size: "25px" }}
                />} bold>
           <Text fontSize="lg" bold color="white"> {t("UPLOAD_NOW")}</Text>
                </ButtonStyle>  
            </HStack>
        </Stack>
        {/* Application status Interview */}
        <Stack space="5" p="5">
          <Text fontSize="sm" bold>{t("INTERVIEW_DETAILS")}</Text>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="UserLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">{t("CONDUCTED_BY")}: IP Name</Text>
          </HStack>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="TimeLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">9th April, 11 am</Text>
          </HStack>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="MapPinLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">{t("ONLINE")}: Google Meet</Text>
          </HStack>
          <HStack space="2">
          <Button shadow="RedOutlineShadow"  variant='redOutlineBtn' rounded="full" width="50%">
              <Text fontSize="lg" bold color="textMaroonColor.400">{t("REJECT")} </Text>
            </Button>
            <ButtonStyle shadow="RedFillShadow" width="50%"><Text fontSize="lg" bold color="white">
              {t("ACCEPT")}</Text>
            </ButtonStyle>
          </HStack>
        </Stack>
        {/* Application Shortlist */}
        <Stack bg="bgPinkColor.300" space="6" p={4}>
          <Text fontSize="sm" bold>{t("ORIENTATION_DETAILS")}</Text>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="UserLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">{t("CONDUCTED_BY")}: IP Name</Text>
          </HStack>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="TimeLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">9th April, 11 am</Text>
          </HStack>
          <HStack space="5">
          <IconByName
                  isDisabled
                  name="MapPinLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm">{t("ONLINE")}: Google Meet</Text>
          </HStack>
          <HStack space="2">
          <Button  shadow="RedOutlineShadow" variant='redOutlineBtn' rounded="full" width="50%">
              <Text fontSize="lg" bold color="textMaroonColor.400">{t("REJECT")} </Text>
            </Button>
            <ButtonStyle shadow="RedFillShadow" width="50%"><Text fontSize="lg" bold color="white">{t("ACCEPT")}</Text>
            </ButtonStyle>
          </HStack>
          <HStack>
          <IconByName
                  isDisabled
                  name="FileTextLineIcon"
                  _icon={{ size: "20px" }}
                />
                <Text fontSize="sm" space="1" pl="2">{t("DOCUMENTS_YOU_NEED_TO_CARRY")}</Text>
          </HStack>
          <Text fontSize="sm">Make sure you have the following list of documents with you when you attend the orientation.</Text>
          <View style={{ marginBottom: 10 }} space="3">
            <Text style={{ fontSize: 14 }}>{`\u2022 Original Aadhaar Card`}</Text>
            <Text style={{ fontSize: 14 }}>{`\u2022 Graduation Certificates`}</Text>
            <Text style={{ fontSize: 14 }}>{`\u2022 Work Experience Proof`}</Text>
            <Text style={{ fontSize: 14 }}>{`\u2022 Volunteer Experience Proof`}</Text>
          </View>
        </Stack>
        <HStack px="2">
          <svg width="32" height="22" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20848 15.2996C6.59344 14.806 0.882137 9.25199 0.818298 9.19126C0.566054 8.93902 0.407233 8.67743 0.363636 8.43764C0.318481 8.18851 0.394777 7.97052 0.597195 7.76811C0.7856 7.5797 1.01604 7.48005 1.26362 7.48005C1.56569 7.48005 1.87554 7.6233 2.13402 7.88333L4.72341 10.3715C4.76857 10.4151 4.82773 10.4369 4.88534 10.4369C4.94607 10.4369 5.00524 10.4136 5.05039 10.3684C5.1407 10.2781 5.1407 10.1317 5.05195 10.0414L0.91795 5.77195C0.503771 5.35777 0.309138 4.72405 0.80117 4.23202C0.989575 4.04361 1.22002 3.94396 1.46759 3.94396C1.76966 3.94396 2.07952 4.08721 2.33799 4.34724L6.56697 8.47034C6.61213 8.51394 6.6713 8.5373 6.73046 8.5373C6.78963 8.5373 6.85036 8.51394 6.89551 8.46878C6.98582 8.37847 6.98738 8.23211 6.89707 8.14024L1.81793 2.93343C1.58282 2.69831 1.44112 2.41648 1.41621 2.14244C1.39285 1.86373 1.49095 1.60525 1.70115 1.39505C1.88956 1.20665 2.12 1.10699 2.36757 1.10699C2.66965 1.10699 2.9795 1.25024 3.23797 1.50872L8.41832 6.55983C8.46348 6.60342 8.52264 6.62678 8.58181 6.62678C8.64098 6.62678 8.7017 6.60342 8.74686 6.55827C8.83717 6.46796 8.83873 6.3216 8.74842 6.22973L4.98655 2.36354C4.74988 2.12687 4.60819 1.8466 4.58483 1.57256C4.56148 1.29384 4.65957 1.03537 4.86977 0.825166C5.05818 0.636761 5.28862 0.537109 5.5362 0.537109C5.83827 0.537109 6.14812 0.680359 6.4066 0.940389C7.78615 2.29503 11.3876 5.83735 11.5091 5.96814C11.9715 6.28734 12.065 5.80465 12.0883 5.49168C12.1148 5.12733 11.6975 3.85521 11.9404 2.71077C12.3483 1.18952 13.5239 1.43865 13.5504 1.4511C14.195 1.75318 14.072 2.20472 13.8431 3.11249L13.8198 3.29155C13.58 4.47803 15.2274 7.99388 15.3488 8.25702C15.995 9.67084 16.7393 12.5374 14.2744 15.0022C11.5729 17.7037 8.22836 16.3195 7.20848 15.2996Z" fill="url(#paint0_radial_553_126543)"/>
            <defs>
            <radialGradient id="paint0_radial_553_126543" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.79756 4.48736) rotate(-45) scale(14.1704)">
            <stop offset="0.3533" stop-color="#F9DDBD"/>
            <stop offset="0.8723" stop-color="#FFD29C"/>
            </radialGradient>
            </defs>
            </svg>
        </HStack>
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
       
        <Stack bg="white" space="5" p="5">
          <Text fontSize="lg" bold>{t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}</Text>
              <ButtonStyle rounded={"full"} width="100%" shadow="RedFillShadow">
              <Text fontSize="lg" bold color="white">{t("AADHAR_NUMBER_KYC")}</Text>
              </ButtonStyle> 
              <Button rounded={"full"} width="100%"  variant='redOutlineBtn' shadow="RedOutlineShadow">
              <Text color="textMaroonColor.400" fontSize="lg" bold>{t("SCAN_QR_CODE")}</Text>
            </Button>
        </Stack>
        <HStack px="2">
          <svg width="32" height="22" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20848 15.2996C6.59344 14.806 0.882137 9.25199 0.818298 9.19126C0.566054 8.93902 0.407233 8.67743 0.363636 8.43764C0.318481 8.18851 0.394777 7.97052 0.597195 7.76811C0.7856 7.5797 1.01604 7.48005 1.26362 7.48005C1.56569 7.48005 1.87554 7.6233 2.13402 7.88333L4.72341 10.3715C4.76857 10.4151 4.82773 10.4369 4.88534 10.4369C4.94607 10.4369 5.00524 10.4136 5.05039 10.3684C5.1407 10.2781 5.1407 10.1317 5.05195 10.0414L0.91795 5.77195C0.503771 5.35777 0.309138 4.72405 0.80117 4.23202C0.989575 4.04361 1.22002 3.94396 1.46759 3.94396C1.76966 3.94396 2.07952 4.08721 2.33799 4.34724L6.56697 8.47034C6.61213 8.51394 6.6713 8.5373 6.73046 8.5373C6.78963 8.5373 6.85036 8.51394 6.89551 8.46878C6.98582 8.37847 6.98738 8.23211 6.89707 8.14024L1.81793 2.93343C1.58282 2.69831 1.44112 2.41648 1.41621 2.14244C1.39285 1.86373 1.49095 1.60525 1.70115 1.39505C1.88956 1.20665 2.12 1.10699 2.36757 1.10699C2.66965 1.10699 2.9795 1.25024 3.23797 1.50872L8.41832 6.55983C8.46348 6.60342 8.52264 6.62678 8.58181 6.62678C8.64098 6.62678 8.7017 6.60342 8.74686 6.55827C8.83717 6.46796 8.83873 6.3216 8.74842 6.22973L4.98655 2.36354C4.74988 2.12687 4.60819 1.8466 4.58483 1.57256C4.56148 1.29384 4.65957 1.03537 4.86977 0.825166C5.05818 0.636761 5.28862 0.537109 5.5362 0.537109C5.83827 0.537109 6.14812 0.680359 6.4066 0.940389C7.78615 2.29503 11.3876 5.83735 11.5091 5.96814C11.9715 6.28734 12.065 5.80465 12.0883 5.49168C12.1148 5.12733 11.6975 3.85521 11.9404 2.71077C12.3483 1.18952 13.5239 1.43865 13.5504 1.4511C14.195 1.75318 14.072 2.20472 13.8431 3.11249L13.8198 3.29155C13.58 4.47803 15.2274 7.99388 15.3488 8.25702C15.995 9.67084 16.7393 12.5374 14.2744 15.0022C11.5729 17.7037 8.22836 16.3195 7.20848 15.2996Z" fill="url(#paint0_radial_553_126543)"/>
            <defs>
            <radialGradient id="paint0_radial_553_126543" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.79756 4.48736) rotate(-45) scale(14.1704)">
            <stop offset="0.3533" stop-color="#F9DDBD"/>
            <stop offset="0.8723" stop-color="#FFD29C"/>
            </radialGradient>
            </defs>
            </svg>
          <Text fontSize="lg" bold color="textMaroonColor.400" pl="1">{t("WELCOME")} Rachana</Text>
        </HStack>
        {/* potential prerak  */}
        <RedOutlineButton background="#FCEEE2" mx="5" width="20%" shadow="RedBoxShadow">
        <Image
                source={{
                  uri: "/addAg.svg",
                }}
                alt="Add AG"
                size={"sm"}
                resizeMode="contain"
              />
           <Text color="textMaroonColor.400" fontSize="lg" bold>Add an AG</Text> 
            </RedOutlineButton>
        <Stack px="3">
        <Text fontSize="lg" bold mx="5">It’s Time to Start Mobilizing!</Text>
            <Alert mx={3} status="info" colorScheme="info" textAlign={Center} my="4">
            <VStack space={2} flexShrink={1} >
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />You will need to Enroll atleast 15 AG learners to set up a viable camp
                </HStack> 
              </HStack>
            </VStack>
          </Alert>
          
            <Button variant='redOutlineBtn' rounded="full" width="100%" shadow="RedOutlineShadow">
              <Text fontSize="lg" bold color="textMaroonColor.400">{t("ADD_AN_AG_LEARNER")} </Text>
            </Button>
          </Stack>
        <VStack p="5" space="5">
          {!form_step_number ||
          (form_step_number && parseInt(form_step_number) < 13) ? (
            <Pressable onPress={(e) => navigate("/form")}>
              <HStack
                borderWidth="1"
                p="5"
                rounded="full"
                justifyContent="center"
              >
                <H2>{t("COMPLETE_FORM")}</H2>
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
      </VStack>
      <HStack pb="2" justifyContent='space-around'>
      <SelectStyle placeholder="Status : All" mt={1} width="150px">
          <Select.Item label="UX Research" value="ux" />
          <Select.Item label="Web Development" value="web" />
        </SelectStyle>
        <SelectStyle  placeholder="Sort By" mt={1} width="150px">
          <Select.Item label="UX Research" value="ux" />
          <Select.Item label="Web Development" value="web" />
        </SelectStyle>
      </HStack>
      <HStack justifyContent="space-around" py="2" alignItems="center">
        <IconByName name="AccountCircleLineIcon" width="60px"></IconByName>
         <VStack>
          <Text bold>Khushboo Verma</Text>
          <BodySmall>+91-809876157</BodySmall>
         </VStack>
         <Badge colorScheme="info" rounded="8" _text={{fontSize: 12}}>Identified</Badge>
      </HStack>
      <HStack justifyContent="space-around" py="2" alignItems="center">
        <IconByName name="AccountCircleLineIcon" width="60px"></IconByName>
         <VStack>
          <Text bold>Khushboo Verma</Text>
          <BodySmall>+91-809876157</BodySmall>
         </VStack>
         <Badge colorScheme="success" rounded="8" _text={{fontSize: 12}}>Enrolled</Badge>
      </HStack>
      <NativeBaseProvider>
      <Box flex={1} bg="white" color="textGreyColor.100" safeAreaTop width="100%" shadow="FooterShadow"  alignSelf="center">
        
        <HStack bg="white" alignItems="center" safeAreaBottom shadow={6} width="100%">
          <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1}>
            <Center>
            <IconByName
                        isDisabled
                        name="Home4LineIcon"
                        _icon={{ size: "20px" }}
                      />
              <Text fontSize="12">
              {t("HOME")}
              </Text>
            </Center>
          </Pressable>
          <Pressable cursor="pointer"   py="2" flex={1}>
            <Center>
            <IconByName
                        isDisabled
                        name="UserLineIcon"
                        _icon={{ size: "20px" }}
                      />
              <Text fontSize="12">
              {t("LEARNERS")}
              </Text>
            </Center>
          </Pressable>
          <Pressable cursor="pointer" color="#C92A42" borderTopColor="#C92A42" borderTopWidth="4" borderRadius="5px" py="2" flex={1}>
            <Center>
            <IconByName
                        isDisabled
                        name="CameraLineIcon"
                        _icon={{ size: "20px" }}
                      />
              <Text fontSize="12" color="#C92A42">
              {t("MY_CAMP")}
              </Text>
            </Center>
          </Pressable>
          <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1}>
            <Center>
            <IconByName
                        isDisabled
                        name="DashboardLineIcon"
                        _icon={{ size: "20px" }}
                      />
              <Text fontSize="12">
              {t("DASHBOARD")}
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>
    </NativeBaseProvider>
    </Layout>
  );
}
