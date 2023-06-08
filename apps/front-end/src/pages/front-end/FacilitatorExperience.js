import React from "react";
import { useState } from "react";
import { HStack, VStack, Box, Progress, Divider, Center } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function FacilitatorExperience({ userTokenInfo, footerLinks }) {
  const id = localStorage.getItem("id");
  const { type } = useParams();
  const [experience, setExperience] = React.useState([]);
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const arrPersonal = {
    ...facilitator?.extended_users,
    gender: facilitator?.gender,
  };

  React.useEffect(() => {
    const user = userTokenInfo?.authUser ? userTokenInfo?.authUser : {};
    setFacilitator(user);
    if (type === "vo_experience") {
      setExperience(user?.vo_experience ? user?.vo_experience : []);
    } else {
      setExperience(user?.experience ? user?.experience : []);
    }
  }, [type]);
  console.log("facilitator", facilitator);

  return (
    <Layout
      _appBar={{
        name:
          type === "vo_experience"
            ? t("VOLUNTEER_EXPERIENCE")
            : t("WORK_EXPERIENCE"),
      }}
    >
      <VStack
        paddingBottom="64px"
        bg="bgGreyColor.200"
        paddingLeft="16px"
        paddingRight="16px"
        space="24px"
      >
        <Box
          marginTop="20px"
          bg="boxBackgroundColour.100"
          borderColor="#E0E0E0"
          borderRadius="10px"
          borderWidth="1px"
          paddingBottom="24px"
        >
          {experience.map((exp, index) => (
            <VStack
              paddingLeft="16px"
              paddingRight="16px"
              paddingTop="16px"
              key={index}
            >
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {type === "vo_experience"
                    ? t("VOLUNTEER_EXPERIENCE")
                    : t("WORK_EXPERIENCE")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/edit/contact-info`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(facilitator, [
                    "email_id",
                    "mobile",
                    "alternative_mobile_number",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("TITLE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.role_title ? exp?.role_title : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("COMPANY")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.organization ? exp?.organization : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />

                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  alignContent="left"
                  position="left"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("DESCRIPTION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.description ? exp?.description : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("YEARS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.experience_in_years ? exp?.experience_in_years : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("TEACHING_RELATED")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.alternative_mobile_number
                      ? facilitator?.alternative_mobile_number
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("REFERENCE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.alternative_mobile_number
                      ? facilitator?.alternative_mobile_number
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("CONTACT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.alternative_mobile_number
                      ? facilitator?.alternative_mobile_number
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("DOCUMENT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.reference?.document_reference?.name
                      ? exp?.reference?.document_reference?.name
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          ))}
        </Box>
        {type === "vo_experience" ? (
          <a href={""}>+Add more volunteer Experience</a>
        ) : (
          <a href={""}>+Add more work Experience</a>
        )}
      </VStack>
    </Layout>
  );
}
