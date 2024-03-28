import { FrontEndTypo, Layout } from "@shiksha/common-lib";
import { Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import List from "./CampList/CampList";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "component/BeneficiaryStatus";
import EpcpCard from "./CampList/EpcpCard";
import ExamPreparationCard from "./CampList/ExamPreparationCard";

export default function CampDashboard({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout
      _appBar={{
        name: t("MY_CAMP"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <List userTokenInfo={userTokenInfo} />
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
        <EpcpCard />
        <ExamPreparationCard />
      </VStack>
    </Layout>
  );
}

CampDashboard.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
