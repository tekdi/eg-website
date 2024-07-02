import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HStack, VStack, Box, Divider, Alert } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  enumRegistryService,
  t,
  ImageView,
  objProps,
  campService,
  AdminTypo,
} from "@shiksha/common-lib";

export default function CampProfileView({ userTokenInfo }) {
  const [loading, setloading] = React.useState(false);
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState({});
  const [benificiaryDropoutReasons, setBenificiaryDropoutReasons] =
    React.useState();
  const [benificiaryRejectReasons, setBenificiaryRejectReasons] =
    React.useState();
  const [benificiaryReactivateReasons, setBenificiaryReactivateReasons] =
    React.useState();
  const navigate = useNavigate();
  const [prerakProfile, setPrerakProfile] = React.useState();
  const [loadingList, setLoadingList] = useState(false);
  const location = useLocation();
  const [beneficiary, setBeneficiary] = React.useState({});

  const getPrerakCampProfile = async () => {
    setLoadingList(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      };
      const result = await campService.getPrerakCampProfile(id, payload);
      console.log("result", result);
      setPrerakProfile(result?.faciltator[0]);
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoadingList(false);
    }
  };

  React.useEffect(() => {
    getPrerakCampProfile();
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("PRERAK_PROFILE"),
        onPressBackButton: () => {
          navigate("/camps");
        },
      }}
      loading={loading}
      analyticsPageTitle={"PRERAK_PROFILE"}
      pageTitle={t("PRERAK_PROFILE")}
    >
      {beneficiary?.is_deactivated ? (
        <Alert status="warning" alignItems="start" mb="3" mt="4">
          <HStack alignItems="center" space="2" color="black">
            <Alert.Icon />
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px" bg="gray.200">
          <VStack paddingLeft="16px" paddingRight="16px" space="24px">
            <Box justifyContent={"space-between"} flexWrap="wrap">
              <AdminTypo.H3
                color="textGreyColor.800"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                m="4"
              >
                {t("CAMP")}&nbsp;
                {id}
              </AdminTypo.H3>
              <HStack flex="0.5" justifyContent="center" m="4">
                {prerakProfile?.profile_photo_1?.name ? (
                  <ImageView
                    source={{
                      uri: prerakProfile?.profile_photo_1?.name,
                    }}
                    alt="profile photo"
                    width={"180px"}
                    height={"180px"}
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="textGreyColor.300"
                    _icon={{ size: "190px" }}
                  />
                )}
              </HStack>
              <VStack space="4" flexWrap="wrap">
                <AdminTypo.H3
                  color="textGreyColor.800"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  m="4"
                >
                  {["enrolled_ip_verified", "registered_in_camp"].includes(
                    prerakProfile?.status
                  )
                    ? `${prerakProfile?.first_name ?? "-"} ${
                        prerakProfile?.last_name ?? "-"
                      }`
                    : `${prerakProfile?.first_name ?? "-"} ${
                        prerakProfile?.last_name ?? "-"
                      }`}
                </AdminTypo.H3>
                <HStack
                  bg="textMaroonColor.600"
                  rounded={"md"}
                  alignItems="center"
                  p="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="CellphoneLineIcon"
                    color="white"
                  />

                  <AdminTypo.H6 color="white" bold>
                    {prerakProfile?.mobile}
                  </AdminTypo.H6>
                </HStack>
                <HStack
                  bg="textMaroonColor.600"
                  rounded={"md"}
                  p="2"
                  alignItems="center"
                  space="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="MapPinLineIcon"
                    color="white"
                  />
                  <AdminTypo.H6 color="white" bold>
                    {[
                      prerakProfile?.state,
                      prerakProfile?.district,
                      prerakProfile?.block,
                      prerakProfile?.village,
                      prerakProfile?.grampanchayat,
                    ]
                      .filter((e) => e)
                      .join(",")}
                  </AdminTypo.H6>
                </HStack>
              </VStack>
            </Box>

            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("CAMP_DETAILS")}
              </FrontEndTypo.H3>

              <Box
                bg="boxBackgroundColour.100"
                borderColor="btnGray.100"
                borderRadius="10px"
                borderWidth="1px"
                pb="6"
              >
                <VStack
                  paddingLeft="16px"
                  paddingRight="16px"
                  paddingTop="16px"
                >
                  <VStack space="2" paddingTop="5">
                    <HStack alignItems="Center" justifyContent="space-between">
                      <HStack space="md" alignItems="Center">
                        <IconByName name="AddLineIcon" _icon={{ size: "20" }} />
                        <FrontEndTypo.H3>{t("BASIC_DETAILS")}</FrontEndTypo.H3>
                      </HStack>
                    </HStack>
                    <Divider
                      orientation="horizontal"
                      bg="btnGray.100"
                      thickness="1"
                    />
                    <HStack alignItems="Center" justifyContent="space-between">
                      <HStack space="md" alignItems="Center">
                        <IconByName name="AddLineIcon" _icon={{ size: "20" }} />
                        <FrontEndTypo.H3>{t("KIT_DETAILS")}</FrontEndTypo.H3>
                      </HStack>
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={() => {
                          navigate(`/camps/CampKitDetails/${id}`);
                        }}
                        color="maroon.400"
                      />
                    </HStack>

                    <Divider
                      orientation="horizontal"
                      bg="btnGray.100"
                      thickness="1"
                    />
                    <HStack alignItems="Center" justifyContent="space-between">
                      <HStack space="md" alignItems="Center">
                        <IconByName name="AddLineIcon" _icon={{ size: "20" }} />
                        <FrontEndTypo.H3>
                          {t("CAMP_FACILITIES")}
                        </FrontEndTypo.H3>
                      </HStack>
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={() => {
                          navigate(`/camps/CampFacility/${id}`);
                        }}
                        color="maroon.400"
                      />
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("OTHER_DETAILS")}
              </FrontEndTypo.H3>
              <Box
                bg="boxBackgroundColour.100"
                borderColor="btnGray.100"
                borderRadius="10px"
                borderWidth="1px"
                pb="6"
              >
                <VStack
                  paddingLeft="16px"
                  paddingRight="16px"
                  paddingTop="16px"
                >
                  <VStack space="2" paddingTop="5">
                    <HStack alignItems="Center" justifyContent="space-between">
                      <HStack space="md" alignItems="Center">
                        <IconByName name="AddLineIcon" _icon={{ size: "20" }} />
                        <FrontEndTypo.H3>
                          {t("LEARNERS_DETAILS")}
                        </FrontEndTypo.H3>
                      </HStack>
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={() => {
                          navigate(`/camps/CampLearnerList/${id}`, {
                            state: {
                              academic_year_id:
                                location.state?.academic_year_id,
                              program_id: location.state?.program_id,
                              user_id: location.state?.user_id,
                            },
                          });
                        }}
                        color="maroon.400"
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
                          {t("CAMP_ATTENDANCE")}
                        </FrontEndTypo.H3>
                      </HStack>
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
                          {t("CAMP_PROGRESS")}
                        </FrontEndTypo.H3>
                      </HStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
