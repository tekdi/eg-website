import {
  AdminTypo,
  BodyMedium,
  FrontEndTypo,
  GetEnumValue,
  IconByName,
  Layout,
  CampService,
  enumRegistryService,
  facilitatorRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Pressable,
  Text,
  Center,
  Avatar,
  Alert,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function CampDashboard({ footerLinks }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);
  const [nonRegisteredUser, setNonRegisteredUser] = React.useState([]);
  const [campList, setCampList] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState();
  const [communityLength, setCommunityLength] = React.useState();
  const [ipStatus, setIpStatus] = React.useState();

  React.useEffect(async () => {
    const result = await CampService.campNonRegisteredUser();
    const campList = await CampService.campList();
    const enums = await enumRegistryService.listOfEnum();
    const ip_user_info = await facilitatorRegistryService.getInfo();
    const getData = await benificiaryRegistoryService.getCommunityReferences({
      context: "community.user",
    });

    setCommunityLength(getData?.data.length || 0);
    setIpStatus(ip_user_info?.program_faciltators?.status);
    setEnumOptions(enums?.data || {});
    setNonRegisteredUser(result?.data?.user || []);
    setCampList(campList?.data?.camps);
    setLoading(false);
  }, []);

  return (
    <Layout
      _appBar={{ name: t("MY_CAMP") }}
      loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <Box
        bg="boxBackgroundColour.200"
        borderColor="btnGray.100"
        borderRadius="10px"
        borderWidth="1px"
        padding="6"
        margin={"20px"}
        shadow="AlertShadow"
      >
        {["selected_for_onboarding", "selected_prerak"].includes(ipStatus) ? (
          <VStack>
            {communityLength >= 2 ? (
              <VStack>
                <HStack
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={5}
                >
                  <VStack width={"50%"}>
                    <AdminTypo.H3 color="textMaroonColor.400">
                      {`${nonRegisteredUser?.length} `}
                      {t("BENEFICIARY_STATUS_ENROLLED_IP_VERIFIED")}
                    </AdminTypo.H3>
                    <AdminTypo.H3 color="textMaroonColor.400">
                      {t("LEARNERS")}
                    </AdminTypo.H3>
                  </VStack>
                  <HStack>
                    <Center>
                      {nonRegisteredUser.length > 0 && (
                        <Avatar.Group
                          _avatar={{
                            size: "lg",
                          }}
                          max={3}
                        >
                          {nonRegisteredUser?.map((item) => {
                            return (
                              <Avatar
                                key={item}
                                bg="red.500"
                                {...(item?.profile_photo_1?.fileUrl
                                  ? {
                                      source: {
                                        uri: item?.profile_photo_1?.fileUrl,
                                      },
                                    }
                                  : {})}
                              >
                                {item?.program_beneficiaries[0]
                                  ?.enrollment_first_name
                                  ? item?.program_beneficiaries[0]?.enrollment_first_name?.substring(
                                      0,
                                      2
                                    )
                                  : "NA"}
                              </Avatar>
                            );
                          })}
                        </Avatar.Group>
                      )}
                    </Center>
                  </HStack>
                </HStack>
                <VStack mt={5}>
                  <VStack my={3} space={2}>
                    {campList?.map((item) => {
                      return (
                        <Pressable
                          key={item}
                          onPress={() => {
                            navigate(`/camps/${item?.id}`);
                          }}
                        >
                          <HStack
                            bg="white"
                            p="2"
                            my={2}
                            shadow="FooterShadow"
                            rounded="sm"
                            space="1"
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <VStack>
                              <AdminTypo.H3>{item?.group?.name}</AdminTypo.H3>
                              {item?.group?.description && (
                                <AdminTypo.H6>
                                  {item?.group?.description}
                                </AdminTypo.H6>
                              )}
                            </VStack>
                            <HStack>
                              <IconByName
                                isDisabled
                                name="ErrorWarningLineIcon"
                                color="textMaroonColor.400"
                                _icon={{ size: "20px" }}
                              />
                              <GetEnumValue
                                t={t}
                                enumType={"GROUPS_STATUS"}
                                enumOptionValue={item?.group?.status}
                                enumApiData={enumOptions}
                                color="textMaroonColor.400"
                                ml={2}
                              />
                            </HStack>
                          </HStack>
                        </Pressable>
                      );
                    })}
                  </VStack>
                </VStack>

                {campList?.length < 2 && (
                  <FrontEndTypo.Secondarybutton
                    onPress={() => {
                      navigate(`/camps/new/learners`, { state: "camp" });
                    }}
                  >
                    {campList?.length === 0
                      ? t("START_FIRST_CAMP_REGISTER")
                      : t("START_SECOND_CAMP_REGISTER")}
                  </FrontEndTypo.Secondarybutton>
                )}
                <Alert
                  status="warning"
                  alignItems={"start"}
                  mb="3"
                  mt="4"
                  width={"100%"}
                >
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>{t("CAMP_WARNING")}</BodyMedium>
                  </HStack>
                </Alert>
              </VStack>
            ) : (
              <Alert
                status="warning"
                alignItems={"start"}
                mb="3"
                mt="4"
                width={"100%"}
              >
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>{t("COMMUNITY_MIN_ERROR")}</BodyMedium>
                </HStack>
              </Alert>
            )}
          </VStack>
        ) : (
          <Alert
            status="warning"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CAMP_ACCESS_ERROR")}</BodyMedium>
            </HStack>
          </Alert>
        )}
      </Box>
      <Box padding="6">
        <AdminTypo.H2>{t("HOW_TO_START_CAMP")}</AdminTypo.H2>
        <HStack mt={2}>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/_Tbo0cATRGM?si=G7KEFIkHPLg1mFQy"
            title={t("HOW_TO_START_CAMP")}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </HStack>
      </Box>
    </Layout>
  );
}
