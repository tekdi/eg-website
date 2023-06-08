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

export default function FacilitatorQualification({
  userTokenInfo,
  footerLinks,
}) {
  const id = localStorage.getItem("id");

  const [facilitator, setfacilitator] = React.useState();

  const navigate = useNavigate();
  const arrPersonal = {
    ...facilitator?.extended_users,
    gender: facilitator?.gender,
  };
  console.log("hello", arrPersonal);

  React.useEffect(() => {
    facilitatorDetails();
  }, []);

  const facilitatorDetails = async () => {
    const result = await facilitatorRegistryService.getOne({ id });

    setfacilitator(result);
  };
  console.log("facilitator", facilitator);
  return (
    <Layout _appBar={{ name: t("BASIC_DETAILS") }}>
      {facilitator?.experience.map((exp, index) => (
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
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("QUALIFICATION")}
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
                    {t("DEGREE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.mobile ? facilitator?.mobile : "-"}
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
                    {t("TEACHING_DEGREE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.email_id ? facilitator?.email_id : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      ))}
    </Layout>
  );
}
