import {
  AdminTypo,
  BodyMedium,
  FrontEndTypo,
  GetEnumValue,
  IconByName,
  Layout,
  campService,
  enumRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Pressable,
  Center,
  Avatar,
  Alert,
  Modal,
  Stack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "component/Chip";

const campSettingData = (item) => {
  return (
    item?.preferred_start_time === null &&
    item?.preferred_end_time === null &&
    item?.week_off === null
  );
};
export default function CampDashboard({ footerLinks, userTokenInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [nonRegisteredUser, setNonRegisteredUser] = useState([]);
  const [campList, setCampList] = useState();
  const [enumOptions, setEnumOptions] = useState();
  const [communityLength, setCommunityLength] = useState(0);
  const [ipStatus, setIpStatus] = useState();
  const [campSelected, setCampSelected] = useState("");

  useEffect(async () => {
    const result = await campService.campNonRegisteredUser();
    const campList = await campService.campList();
    const enums = await enumRegistryService.listOfEnum();
    if (campList?.data?.camps?.length === 0) {
      const getData = await benificiaryRegistoryService.getCommunityReferences({
        context: "community.user",
      });
      setCommunityLength(getData?.data?.community_response?.length || 0);
    } else {
      setCommunityLength(2);
    }
    setIpStatus(userTokenInfo?.authUser?.program_faciltators?.status);
    setEnumOptions(enums?.data || {});
    setNonRegisteredUser(result?.data?.user || []);
    setCampList(campList?.data?.camps);
    setLoading(false);
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("MY_CAMP"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space="5">
        <VStack
          bg="boxBackgroundColour.200"
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          padding="4"
          shadow="AlertShadow"
        >
          {["selected_for_onboarding", "selected_prerak"].includes(ipStatus) ? (
            <VStack>
              {communityLength >= 2 ? (
                <VStack space={5}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <VStack flex={1}>
                      <AdminTypo.H4 color="textMaroonColor.400">
                        {`${nonRegisteredUser?.length} `}
                        {t("UNMAPPED_LEARNERS")}
                      </AdminTypo.H4>
                    </VStack>
                    <Center>
                      {nonRegisteredUser.length > 0 && (
                        <Avatar.Group
                          _avatar={{
                            size: "sm",
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
                  {campList?.map((item, i) => {
                    const index = i + 1;
                    return (
                      <Pressable
                        key={item}
                        onPress={() => {
                          setCampSelected(item);
                        }}
                        bg="boxBackgroundColour.100"
                        shadow="AlertShadow"
                        borderRadius="10px"
                        py={3}
                        px={5}
                      >
                        <HStack
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Chip rounded="full" alignItems={"center"}>
                            {item?.id}
                          </Chip>
                          <VStack flex={"0.9"}>
                            <FrontEndTypo.H3>
                              {`${t("CAMP")} ${String(index).padStart(2, "0")}`}
                            </FrontEndTypo.H3>
                            {item?.group?.description && (
                              <FrontEndTypo.H6>
                                {item?.group?.description}
                              </FrontEndTypo.H6>
                            )}
                          </VStack>
                          <HStack>
                            <IconByName
                              isDisabled
                              name={
                                ["camp_ip_verified"].includes(
                                  item?.group?.status
                                )
                                  ? "CheckLineIcon"
                                  : "ErrorWarningLineIcon"
                              }
                              color={
                                ["camp_ip_verified"].includes(
                                  item?.group?.status
                                )
                                  ? "textGreen.700"
                                  : "textMaroonColor.400"
                              }
                              _icon={{ size: "20px" }}
                            />
                            <GetEnumValue
                              t={t}
                              enumType={"GROUPS_STATUS"}
                              enumOptionValue={item?.group?.status}
                              enumApiData={enumOptions}
                              color={
                                ["camp_ip_verified"].includes(
                                  item?.group?.status
                                )
                                  ? "textGreen.700"
                                  : "textMaroonColor.400"
                              }
                              ml={2}
                            />
                          </HStack>
                        </HStack>
                      </Pressable>
                    );
                  })}

                  {campList?.length < 2 && (
                    <FrontEndTypo.Secondarybutton
                      onPress={() => {
                        navigate(`/camps/new/learners`, { state: "camp" });
                      }}
                    >
                      <FrontEndTypo.H3 color="textMaroonColor.400">
                        {campList?.length === 0
                          ? t("START_FIRST_CAMP_REGISTER")
                          : t("START_SECOND_CAMP_REGISTER")}
                      </FrontEndTypo.H3>
                    </FrontEndTypo.Secondarybutton>
                  )}
                  <Alert status="warning" alignItems={"start"} width={"100%"}>
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("CAMP_WARNING")}</BodyMedium>
                    </HStack>
                  </Alert>
                </VStack>
              ) : (
                <Alert status="warning" alignItems={"start"} width={"100%"}>
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
        </VStack>
        <VStack>
          <AdminTypo.H3 color="textMaroonColor.400" bold>
            {t("HOW_TO_START_CAMP")}
          </AdminTypo.H3>
          <HStack mt={4}>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/LPjsnW5LKWs?si=wbkJgHcLP3mMuH2W"
              title={t("HOW_TO_START_CAMP")}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </HStack>
        </VStack>
      </VStack>
      <Modal
        isOpen={campSelected}
        onClose={() => setCampSelected()}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body p={5} marginTop={"20px"}>
            <VStack space={4}>
              <FrontEndTypo.Primarybutton
                m="2"
                onPress={() => {
                  navigate(`/camps/${campSelected?.id}`);
                }}
              >
                {t("CAMP_PROFILE")}
              </FrontEndTypo.Primarybutton>
              {["registered", "camp_ip_verified"].includes(
                campSelected?.group?.status
              ) && (
                <Stack space={4}>
                  <FrontEndTypo.Secondarybutton
                    onPress={() => {
                      navigate(`/camps/${campSelected?.id}/settings`);
                    }}
                  >
                    {t("CAMP_SETTINGS")}
                  </FrontEndTypo.Secondarybutton>
                  {campSettingData(campSelected) ? (
                    <Alert mt={4} status="warning">
                      <HStack space={2}>
                        <Alert.Icon />
                        <FrontEndTypo.H3>
                          {t("CAMP_EXECUTION_MESSAGE")}
                        </FrontEndTypo.H3>
                      </HStack>
                    </Alert>
                  ) : (
                    <FrontEndTypo.Primarybutton
                      onPress={() => {
                        navigate(`/camps/${campSelected?.id}/campexecution`);
                      }}
                    >
                      {t("CAMP_EXECUTION")}
                    </FrontEndTypo.Primarybutton>
                  )}
                </Stack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

CampDashboard.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
