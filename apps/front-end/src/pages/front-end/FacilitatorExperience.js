import React from "react";
import { useState } from "react";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Center,
  Link,
} from "native-base";
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
  const [arrexperience, setArrExperience] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = userTokenInfo?.authUser ? userTokenInfo?.authUser : {};
    setFacilitator(user);
    if (type === "vo_experience") {
      setExperience(user?.vo_experience ? user?.vo_experience : []);
    } else {
      setExperience(user?.experience ? user?.experience : []);
    }
  }, [type]);
  console.log(facilitator);

  React.useEffect(() => {
    const arrPersonal = facilitator?.experience?.map((item) => {
      const { name, type_of_document } = item.reference;
      return { ...item, ...{ name, type_of_document } };
    });

    setArrExperience(arrPersonal);
    console.log("----------------", arrPersonal);
  }, []);
  console.log("arr", arrexperience);
  return (
    <Layout
      _appBar={{
        name:
          type === "vo_experience"
            ? t("VOLUNTEER_EXPERIENCE")
            : t("WORK_EXPERIENCE"),
      }}
    >
      <VStack bg="bgGreyColor.200">
        <VStack px="5" pt="3">
          {experience.map((exp, index) => (
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
                    navigate(``);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(arrexperience, [
                    "role_title",
                    "organization",
                    "description",
                    "experience_in_years",
                    "related_to_teaching",
                    "name",
                    "document_reference",
                    "contact_number",
                    "type_of_document",
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
                    {t("TEACHING_RELATED")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.related_to_teaching ? exp?.related_to_teaching : "-"}
                  </FrontEndTypo.H3>
                </HStack>

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
                    {t("REFERENCE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.reference?.name ? exp?.reference?.name : "-"}
                  </FrontEndTypo.H3>
                </HStack>

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
                    {t("CONTACT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {exp?.reference?.contact_number
                      ? exp?.reference?.contact_number
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>

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
                    {exp?.reference?.type_of_document
                      ? exp?.reference?.type_of_document
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          ))}
        </VStack>
        {type === "vo_experience" ? (
          <Link
            _text={{
              _light: {
                color: "cyan.500",
              },
              color: "cyan.300",
            }}
            href={""}
          >
            +Add more volunteer Experience
          </Link>
        ) : (
          <Link
            _text={{
              _light: {
                color: "cyan.500",
              },
              color: "cyan.300",
            }}
            href={""}
          >
            +Add more work Experience
          </Link>
        )}
      </VStack>
    </Layout>
  );
}
