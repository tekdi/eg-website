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
  CustomAlert,
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
import Chip from "component/BeneficiaryStatus";

const campSettingData = (item) => {
  return (
    item?.preferred_start_time === null &&
    item?.preferred_end_time === null &&
    item?.week_off === null
  );
};

export default function List({ userTokenInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [nonRegisteredUser, setNonRegisteredUser] = useState([]);
  const [campList, setCampList] = useState();
  const [enumOptions, setEnumOptions] = useState();
  const [communityLength, setCommunityLength] = useState(0);
  const [ipStatus, setIpStatus] = useState();
  const [campSelected, setCampSelected] = useState("");
  const [campCount, setCampCount] = useState();

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
    setCampList(campList?.data);
    setCampCount(
      campList?.data?.pcr_camp?.length + campList?.data?.camps?.length
    );
    setLoading(false);
  }, []);

  return (
    <Stack>
      <VStack p="4" space="5">
        {campList?.camps?.length < 2 && (
          <VStack
            bg="boxBackgroundColour.200"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            padding="4"
            shadow="AlertShadow"
            background={"bgYellowColor.400"}
          >
            {["selected_for_onboarding", "selected_prerak"].includes(
              ipStatus
            ) ? (
              <VStack>
                {communityLength >= 2 ? (
                  <VStack space={5}>
                    <HStack
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <VStack flex={1} space={2}>
                        <FrontEndTypo.H2 color="textMaroonColor.400">
                          {t("PCR_CAMP")}
                        </FrontEndTypo.H2>
                        <FrontEndTypo.H3 color="textMaroonColor.400">
                          {`${nonRegisteredUser?.length} `}
                          {t("UNMAPPED_LEARNERS")}
                        </FrontEndTypo.H3>
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
                    {campList?.pcr_camp?.map((item, i) => {
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
                            <VStack flex={"0.9"}>
                              <FrontEndTypo.H3 color="textMaroonColor.400">
                                {`${t("CAMP")} ${String(index).padStart(
                                  2,
                                  "0"
                                )} (${t("ID")} : ${item?.id})`}
                              </FrontEndTypo.H3>
                              {item?.group?.description && (
                                <FrontEndTypo.H6>
                                  {item?.group?.description}
                                </FrontEndTypo.H6>
                              )}
                            </VStack>
                            <HStack alignItems={"center"}>
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
                                fontSize={"12px"}
                              />
                            </HStack>
                          </HStack>
                        </Pressable>
                      );
                    })}
                    {campCount >= 0 && campCount < 2 && (
                      <FrontEndTypo.Secondarybutton
                        onPress={() => {
                          navigate(`/camps/new/learners`, { state: "camp" });
                        }}
                      >
                        <FrontEndTypo.H3 color="textMaroonColor.400">
                          {campCount == 0
                            ? t("START_FIRST_CAMP_REGISTER")
                            : t("START_SECOND_CAMP_REGISTER")}
                        </FrontEndTypo.H3>
                      </FrontEndTypo.Secondarybutton>
                    )}

                    <CustomAlert status={"danger"} title={t("CAMP_WARNING")} />
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
        )}
        {campList?.camps && (
          <VStack
            bg="boxBackgroundColour.200"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            padding="4"
            shadow="AlertShadow"
            background={"bgYellowColor.400"}
          >
            {["selected_for_onboarding", "selected_prerak"].includes(
              ipStatus
            ) ? (
              <VStack>
                {communityLength >= 2 ? (
                  <VStack space={5}>
                    <HStack
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <FrontEndTypo.H2 color="textMaroonColor.400">
                        {t("MAIN_CAMP")}
                      </FrontEndTypo.H2>
                    </HStack>
                    {campList?.camps?.map((item, i) => {
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
                            <VStack flex={"0.9"}>
                              <FrontEndTypo.H3 color="textMaroonColor.400">
                                {`${t("CAMP")} ${String(index).padStart(
                                  2,
                                  "0"
                                )} (${t("ID")} : ${item?.id})`}
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
                                fontSize={"12px"}
                              />
                            </HStack>
                          </HStack>
                        </Pressable>
                      );
                    })}
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
        )}
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
                {campSelected?.type === "pcr"
                  ? t("PCR_CAMP_PROFILE")
                  : t("MAIN_CAMP_PROFILE")}
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
                    {campSelected?.type === "pcr"
                      ? t("PCR_CAMP_SETTINGS")
                      : t("MAIN_CAMP_SETTINGS")}
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
                      {campSelected?.type === "pcr"
                        ? t("PCR_CAMP_EXECUTION")
                        : t("MAIN_CAMP_EXECUTION")}
                    </FrontEndTypo.Primarybutton>
                  )}
                </Stack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Stack>
  );
}

List.propTypes = {};
