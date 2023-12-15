import React from "react";
import { HStack, VStack, Box, Progress, Divider } from "native-base";
import {
  IconByName,
  arrList,
  Layout,
  FrontEndTypo,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { objProps } from "@shiksha/common-lib";

export default function Profile({ userTokenInfo, footerLinks }) {
  const { id } = userTokenInfo?.authUser;
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const percentage =
      arrList(res, [
        "device_ownership",
        "mobile",
        "device_type",
        "gender",
        "marital_status",
        "social_category",
        "name",
        "contact_number",
        "availability",
      ]) +
      arrList(
        {
          ...res,
          qua_name: facilitator?.qualifications?.qualification_master?.name,
        },
        ["qualification_ids", "qua_name"]
      ) +
      arrList(res, [
        "aadhar_no",
        "aadhaar_verification_mode",
        "aadhar_verified",
      ]);
    setProgress(percentage);
    setLoading(false);
  }, [facilitator]);

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setFacilitator(result);
  }, []);

  const res = objProps(facilitator);

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
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
              {progress !== 300
                ? t("COMPLETE_YOUR_PROFILE")
                : t("PROFILE_COMPLETED")}
            </FrontEndTypo.H2>
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
                {!["quit"].includes(facilitator?.status) && (
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/facilitatorbasicdetail`);
                    }}
                  />
                )}
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(res, [
                    "device_ownership",
                    "mobile",
                    "device_type",
                    "gender",
                    "marital_status",
                    "social_category",
                    "name",
                    "contact_number",
                    "availability",
                  ])}
                  size="xs"
                  colorScheme="red"
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
                <Progress
                  value={arrList(
                    {
                      ...res,
                      qua_name:
                        facilitator?.qualifications?.qualification_master?.name,
                    },
                    ["qualification_ids", "qua_name"]
                  )}
                  size="xs"
                  colorScheme="red"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("QUALIFICATION_DETAILS")}
                    </FrontEndTypo.H3>
                  </HStack>
                  {!["quit"].includes(facilitator?.status) && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      color="textMaroonColor.400"
                      onPress={(e) => {
                        navigate(`/facilitatorqualification`);
                      }}
                    />
                  )}
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
                  {!["quit"].includes(facilitator?.status) && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      color="textMaroonColor.400"
                      onPress={(e) => {
                        navigate(`/profile/edit/array-form/vo_experience`);
                      }}
                    />
                  )}
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
                  {!["quit"].includes(facilitator?.status) && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      color="textMaroonColor.400"
                      onPress={(e) => {
                        navigate(`/profile/edit/array-form/experience`);
                      }}
                    />
                  )}
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
                {!["quit"].includes(facilitator?.status) && (
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="textMaroonColor.400"
                    onPress={(e) => {
                      navigate(`/profile/${facilitator?.id}/aadhaardetails`);
                    }}
                  />
                )}
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(res, [
                    "aadhar_no",
                    "aadhaar_verification_mode",
                    "aadhar_verified",
                  ])}
                  size="xs"
                  colorScheme="red"
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
