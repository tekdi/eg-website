import React from "react";
import { useState } from "react";
import { HStack, VStack, Box, Progress, Divider } from "native-base";
import { IconByName, arrList, Layout, FrontEndTypo } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile({ userTokenInfo, footerLinks }) {
  const [facilitator, Setfacilitator] = useState(userTokenInfo?.authUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Layout
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="bgGreyColor.200" pb="10">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <FrontEndTypo.H1 color="textMaroonColor.400" pt="5" bold>
            {t("WELCOME")} {facilitator?.first_name}
          </FrontEndTypo.H1>

          <Box paddingBottom="20px">
            <FrontEndTypo.H2 color="textGreyColor.900">
              {t("COMPLETE_YOUR_PROFILE")}
            </FrontEndTypo.H2>
            <FrontEndTypo.H5 color="textGreyColor.900">
              {t("INCREASE_YOUR_CHANCES_OF_GETTING_SELECTED")}
            </FrontEndTypo.H5>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("BASIC_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  onPress={(e) => {
                    navigate(`/facilitatorbasicdetail`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(facilitator, [
                    "first_name",
                    "email_id",
                    "last_name",
                    "middle_name",
                    "dob",
                    "mobile",
                    "alternate_mobile",
                    "address",
                    "district",
                    "block",
                    "village",
                    "grampanchayat",
                    "gender",
                    "marital_status",
                    "social_category",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                {t("EDUCATION_AND_WORK_DETAILS")}
              </FrontEndTypo.H3>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("QUALIFICATION_DETAILS")}
                    </FrontEndTypo.H3>
                  </HStack>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/facilitatorqualification`);
                    }}
                  />
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="HeartLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("VOLUNTEER_EXPERIENCE")}
                    </FrontEndTypo.H3>
                  </HStack>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/profile/edit/array-form/vo_experience`);
                    }}
                  />
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName
                      name="SuitcaseLineIcon"
                      _icon={{ size: "20" }}
                    />
                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("WORK_EXPERIENCE")}
                    </FrontEndTypo.H3>
                  </HStack>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/profile/edit/array-form/experience`);
                    }}
                  />
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("AADHAAR_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  onPress={(e) => {
                    navigate(`/beneficiary/${facilitator?.id}/aadhaardetails`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
