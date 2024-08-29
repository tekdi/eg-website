import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HStack, VStack, Box, Progress, Divider, Alert } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  ImageView,
  PcuserService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Menu from "component/Beneficiary/Menu";

export default function PrerakProfileView({ userTokenInfo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();
  const [prerakProfile, setPrerakProfile] = React.useState();

  const getPrerakProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        id: id,
        academic_year_id: location?.state?.academic_year_id,
      };
      const result = await PcuserService.getPrerakProfile(payload);
      setPrerakProfile(result?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrerakProfile();
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("PRERAK_PROFILE"),
        onPressBackButton: () => {
          navigate("/preraks");
        },
      }}
      loading={loading}
      analyticsPageTitle={"PRERAK_PROFILE"}
      pageTitle={t("PRERAK_PROFILE")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack paddingBottom="64px">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <Box justifyContent={"space-between"} flexWrap="wrap">
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
            <VStack space="4" alignItems={"Center"}>
              <FrontEndTypo.H2 bold color="textMaroonColor.400">
                {prerakProfile?.first_name} {" " + prerakProfile?.last_name}
              </FrontEndTypo.H2>

              <FrontEndTypo.H3>{prerakProfile?.mobile}</FrontEndTypo.H3>
              <ChipStatus
                w="fit-content"
                status={prerakProfile?.program_faciltators?.status}
                is_duplicate={prerakProfile?.is_duplicate}
                is_deactivated={prerakProfile?.is_deactivated}
                rounded={"sm"}
              />
            </VStack>
          </Box>

          <FrontEndTypo.H3 bold color="gray.800">
            {t("PROFILE_DETAILS")}
          </FrontEndTypo.H3>

          <Menu
            menus={[
              {
                title: "BASIC_DETAILS",
                onPress: () => navigate(`/preraks/${id}/basicdetails`),
              },
              {
                title: "EDUCATION_DETAILS",
                onPress: () => navigate(`/preraks/${id}/educationdetails`),
              },
            ]}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

PrerakProfileView.propTypes = {
  userTokenInfo: PropTypes.any,
};
