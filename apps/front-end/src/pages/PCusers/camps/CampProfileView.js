import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  FrontEndTypo,
  IconByName,
  ImageView,
  PCusers_layout as Layout,
  campService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { Box, Divider, HStack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CampProfileView({ userTokenInfo }) {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [prerakProfile, setPrerakProfile] = useState();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    getPrerakCampProfile();
  }, []);

  const getPrerakCampProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      };
      const result = await campService.getPrerakCampProfile(id, payload);
      setPrerakProfile(result?.faciltator[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const navigateOnClick = (path) => {
    if (path) {
      navigate(path, {
        state: {
          academic_year_id: location.state?.academic_year_id,
          program_id: location.state?.program_id,
          user_id: location.state?.user_id,
        },
      });
    }
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
                <DetailCard
                  title={"BASIC_DETAILS"}
                  path={""}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <DetailCard
                  title={"KIT_DETAILS"}
                  path={`/camps/CampProfileView/${id}/edit_kit_details`}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <DetailCard
                  title={"CAMP_FACILITIES"}
                  path={`/camps/CampProfileView/${id}/edit_property_facilities`}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
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
                <DetailCard
                  title={"LEARNERS_DETAILS"}
                  path={`/camps/CampLearnerList/${id}`}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <DetailCard
                  title={"CAMP_ATTENDANCE"}
                  path={""}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <DetailCard
                  title={"CAMP_PROGRESS"}
                  path={""}
                  navigateOnClick={navigateOnClick}
                  t={t}
                  id={id}
                />
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}

CampProfileView.propTypes = {
  userTokenInfo: PropTypes.object,
};

const DetailCard = ({ title, path, navigateOnClick, t }) => {
  return (
    <HStack alignItems="Center" justifyContent="space-between">
      <HStack space="md" alignItems="Center">
        <FrontEndTypo.H3>{t(title)}</FrontEndTypo.H3>
      </HStack>
      <IconByName
        name="ArrowRightSFillIcon"
        onPress={() => navigateOnClick(path)}
        color="maroon.400"
      />
    </HStack>
  );
};

DetailCard.propTypes = {
  title: PropTypes.string,
  path: PropTypes.string,
  navigateOnClick: PropTypes.func,
  t: PropTypes.func,
};
