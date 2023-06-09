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
  const [qualification, setQualification] = React.useState();

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

  React.useEffect(() => {
    qualifications();
  }, [facilitator]);

  const qualifications = async () => {
    const qua = await facilitatorRegistryService.getQualificationAll();

    const ids = JSON.parse(
      facilitator?.program_faciltators?.qualification_ids
        ? facilitator?.program_faciltators?.qualification_ids
        : "[]"
    );
    const arr = qua.filter((item) => ids.includes(item.id));
    setQualification(arr);
  };
  console.log("qualification", qualification);

  return (
    <Layout _appBar={{ name: t("QUALIFICATION_DETAILS") }}>
      {facilitator?.qualifications.map((qua, index) => (
        <VStack bg="bgGreyColor.200">
          <VStack key={index} px="5" pt="3">
            <VStack
              px="5"
              py="4"
              mb="3"
              borderRadius="10px"
              borderWidth="1px"
              bg="white"
              borderColor="appliedColor"
            >
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3 bold color="textGreyColor.800">
                  {t("QUALIFICATION")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  _icon={{ size: "20" }}
                  onPress={(e) => {
                    navigate(``);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(qua?.qualification_master, [
                    "name",
                    "mobile",
                    "alternative_mobile_number",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                    {t("DEGREE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {qua?.qualification_master?.name
                      ? qua?.qualification_master?.name
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
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
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
                    {qua?.document_reference ? qua?.document_reference : "-"}
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
                    {/* {qualification?.map((item) => item?.name).join(", ")} */}
                    {facilitator?.qualifications?.qualification_master?.type ===
                    "teaching"
                      ? "Yes"
                      : "No"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      ))}
    </Layout>
  );
}
