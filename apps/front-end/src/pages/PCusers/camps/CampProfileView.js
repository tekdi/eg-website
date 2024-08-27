import React, { useState, useEffect } from "react";
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
import { ChipStatus } from "component/Chip";
import PropTypes from "prop-types";

export default function CampProfileView({ userTokenInfo }) {
  const [loading, setloading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [prerakProfile, setPrerakProfile] = useState();
  const [loadingList, setLoadingList] = useState(false);
  const location = useLocation();
  const [beneficiary, setBeneficiary] = useState({});
  const [enumOptions, setEnumOptions] = useState({});

  useEffect(() => {
    getPrerakCampProfile();
  }, []);

  const getPrerakCampProfile = async () => {
    setLoadingList(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      };
      const result = await campService.getPrerakCampProfile(id, payload);
      console.log("getPrerakCampProfile", result);
      setPrerakProfile(result?.faciltator[0]);
      // const data = await enumRegistryService.listOfEnum();
      // setEnumOptions(data?.data ? data?.data?.FACILITATOR_STATUS : {});
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoadingList(false);
    }
  };

  const navigateOnClick = (path) => {
    navigate(path, {
      state: {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      },
    });
  };

  return (
    <Layout
      _appBar={{
        name: t("CAMP_DETAILS"),
        onPressBackButton: () => {
          navigate("/camps");
        },
      }}
      loading={loading}
      analyticsPageTitle={"CAMP_DETAILS"}
      pageTitle={t("CAMP_DETAILS")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      {beneficiary?.is_deactivated ? (
        <Alert status="warning" alignItems="start" mb="3" mt="4">
          <HStack alignItems="center" space="2" color="black">
            <Alert.Icon />
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px">
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
                <VStack space="4" alignItems={"Center"}>
                  <FrontEndTypo.H2 bold color="textMaroonColor.400">
                    {prerakProfile?.first_name} {" " + prerakProfile?.last_name}
                  </FrontEndTypo.H2>

                  <FrontEndTypo.H3 color="textMaroonColor.400">
                    <IconByName
                      isDisabled
                      _icon={{ size: "20px" }}
                      name="CellphoneLineIcon"
                      color="textMaroonColor.400"
                    />
                    {prerakProfile?.mobile}
                  </FrontEndTypo.H3>
                  <ChipStatus
                    w="fit-content"
                    status={prerakProfile?.program_faciltators?.status}
                    is_duplicate={prerakProfile?.is_duplicate}
                    is_deactivated={prerakProfile?.is_deactivated}
                    rounded={"sm"}
                  />
                  <HStack rounded={"md"} p="2" alignItems="center" space="2">
                    <IconByName
                      isDisabled
                      _icon={{ size: "20px" }}
                      name="MapPinLineIcon"
                      color="textMaroonColor.400"
                    />
                    <FrontEndTypo.H2 bold color="textMaroonColor.400">
                      {[
                        prerakProfile?.state,
                        prerakProfile?.district,
                        prerakProfile?.block,
                        prerakProfile?.village,
                        prerakProfile?.grampanchayat,
                      ]
                        .filter((e) => e)
                        .join(",")}
                    </FrontEndTypo.H2>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            <VStack space={"4"}>
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("CAMP_DETAILS")}
              </FrontEndTypo.H3>

              <Box
                bg="boxBackgroundColour.100"
                borderColor="btnGray.100"
                borderRadius="10px"
                borderWidth="1px"
                p="4"
              >
                <VStack space="2">
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack space="md" alignItems="Center">
                      <FrontEndTypo.H3>{t("BASIC_DETAILS")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() => {}}
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
                      <FrontEndTypo.H3>{t("KIT_DETAILS")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() =>
                        navigateOnClick(
                          `/camps/CampProfileView/${id}/edit_kit_details`,
                        )
                      }
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
                      <FrontEndTypo.H3>{t("CAMP_FACILITIES")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() =>
                        navigateOnClick(
                          `/camps/CampProfileView/${id}/edit_property_facilities`,
                        )
                      }
                      color="maroon.400"
                    />
                  </HStack>
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
                p="4"
              >
                <VStack space="2">
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack space="md" alignItems="Center">
                      <FrontEndTypo.H3>{t("LEARNERS_DETAILS")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() =>
                        navigateOnClick(`/camps/CampLearnerList/${id}`)
                      }
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
                      <FrontEndTypo.H3>{t("CAMP_ATTENDANCE")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() => {}}
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
                      <FrontEndTypo.H3>{t("CAMP_PROGRESS")}</FrontEndTypo.H3>
                    </HStack>
                    <IconByName
                      name="ArrowRightSFillIcon"
                      onPress={() => {}}
                      color="maroon.400"
                    />
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}

CampProfileView.propTypes = {
  userTokenInfo: PropTypes.object,
};
