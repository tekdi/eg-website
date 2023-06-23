import React from "react";
import { HStack, VStack, Box, Progress, Divider, Center } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ProfilePhoto from "./ProfilePhoto";

export default function FacilitatorBasicDetails({
  userTokenInfo,
  footerLinks,
}) {
  const [facilitator, setfacilitator] = React.useState();
  const navigate = useNavigate();
  const arrPersonal = {
    ...facilitator?.extended_users,
    gender: facilitator?.gender,
  };
  const [enumOptions, setEnumOptions] = React.useState({});

  React.useEffect(() => {
    facilitatorDetails();
  }, []);

  const facilitatorDetails = async () => {
    const { id } = userTokenInfo?.authUser;
    const result = await facilitatorRegistryService.getOne({ id });
    setfacilitator(result);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [facilitator]);

  return (
    <Layout
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton: (e) => navigate(`/profile`),
      }}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack p="4" space="24px">
          <ProfilePhoto
            profile_photo_1={facilitator?.profile_photo_1}
            profile_photo_2={facilitator?.profile_photo_2}
            profile_photo_3={facilitator?.profile_photo_3}
          />
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
                {`${facilitator?.first_name ? facilitator?.first_name : ""} ${
                  facilitator?.middle_name ? facilitator?.middle_name : ""
                } ${facilitator?.last_name ? facilitator?.last_name : ""}`}
              </FrontEndTypo.H1>
              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/profile/edit/basic_details`);
                }}
              />
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {moment(facilitator?.dob).format("DD/MM/YYYY")
                  ? moment(facilitator?.dob).format("DD/MM/YYYY")
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>
          </VStack>

          <Box
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
                  {t("CONTACT_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/profile/edit/contact_details`);
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
                    {t("SELF")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.mobile ? facilitator?.mobile : "-"}
                  </FrontEndTypo.H3>

                  <IconByName name="CellphoneLineIcon" color="iconColor.100" />
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
                    {t("FAMILY")}
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

                  <IconByName name="SmartphoneLineIcon" color="iconColor.100" />
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
                    {t("EMAIL")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {facilitator?.email_id ? facilitator?.email_id : "-"}
                  </FrontEndTypo.H3>

                  <IconByName name="MailLineIcon" color="iconColor.100" />
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            bg="#FAFAFA"
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
                  {t("ADDRESS_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/profile/edit/address_details`);
                  }}
                />
              </HStack>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("HOME")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {[
                      facilitator?.state,
                      facilitator?.district,
                      facilitator?.block,
                      facilitator?.village,
                      facilitator?.grampanchayat,
                    ]
                      .filter((e) => e)
                      .join(", ")}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
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
                  {t("PERSONAL_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/profile/edit/personal_details`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(arrPersonal, [
                    "gender",
                    "marital_status",
                    "social_category",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("GENDER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {facilitator?.gender ? (
                      <GetEnumValue
                        t={t}
                        enumType={"GENDER"}
                        enumOptionValue={facilitator?.gender}
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("SOCIAL_CATEGORY")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {facilitator?.extended_users?.social_category ? (
                      <GetEnumValue
                        t={t}
                        enumType={"FACILITATOR_SOCIAL_STATUS"}
                        enumOptionValue={
                          facilitator?.extended_users?.social_category
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack alignItems="Center" space="2xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("MARITAL_STATUS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {facilitator?.extended_users?.marital_status ? (
                      <GetEnumValue
                        t={t}
                        enumType={"FACILITATOR_MARITAL_STATUS"}
                        enumOptionValue={
                          facilitator?.extended_users?.marital_status
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          {
            <Box
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
                    {t("REFERENCE_DETAILS")}
                  </FrontEndTypo.H3>
                  <IconByName
                    name="EditBoxLineIcon"
                    color="iconColor.100"
                    onPress={(e) => {
                      navigate(`/profile/edit/reference_details`);
                    }}
                  />
                </HStack>
                <Box paddingTop="2">
                  <Progress
                    value={arrList(facilitator?.references, [
                      "name",
                      "designation",
                      "contact_number",
                    ])}
                    size="xs"
                    colorScheme="info"
                  />
                </Box>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="Center" space="2xl">
                    <FrontEndTypo.H3
                      color="textGreyColor.50"
                      fontWeight="400"
                      flex="0.4"
                    >
                      {t("NAME")}
                    </FrontEndTypo.H3>

                    <FrontEndTypo.H3
                      color="textGreyColor.800"
                      fontWeight="400"
                      flex="0.3"
                    >
                      {facilitator?.references.name
                        ? facilitator?.references.name
                        : "-"}
                    </FrontEndTypo.H3>
                  </HStack>
                  <Divider
                    orientation="horizontal"
                    bg="AppliedColor"
                    thickness="1"
                  />
                  <HStack alignItems="Center" space="2xl">
                    <FrontEndTypo.H3
                      color="textGreyColor.50"
                      fontWeight="400"
                      flex="0.4"
                    >
                      {t("DESIGNATION")}
                    </FrontEndTypo.H3>

                    <FrontEndTypo.H3
                      color="textGreyColor.800"
                      fontWeight="400"
                      flex="0.3"
                    >
                      {facilitator?.references.designation
                        ? facilitator?.references.designation
                        : "-"}
                    </FrontEndTypo.H3>
                  </HStack>
                  <Divider
                    orientation="horizontal"
                    bg="AppliedColor"
                    thickness="1"
                  />
                  <HStack alignItems="Center" space="2xl">
                    <FrontEndTypo.H3
                      color="textGreyColor.50"
                      fontWeight="400"
                      flex="0.4"
                    >
                      {t("CONTACT")}
                    </FrontEndTypo.H3>

                    <FrontEndTypo.H3
                      color="textGreyColor.800"
                      fontWeight="400"
                      flex="0.3"
                    >
                      {facilitator?.references.contact_number
                        ? facilitator?.references.contact_number
                        : "-"}
                    </FrontEndTypo.H3>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          }
          <Box
            bg="#FAFAFA"
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
                  {t("OTHER_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/profile/edit/work_availability_details`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(facilitator, ["availability"])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" space="xl">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t("AVAILABILITY")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {facilitator?.availability
                      ? facilitator?.availability
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
