import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HStack, VStack, Box, Progress, Divider, Alert } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  t,
  ImageView,
  enumRegistryService,
  PcuserService,
  AdminTypo,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";

export default function PrerakProfileView() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = React.useState({});
  const [enumOptions, setEnumOptions] = useState({});
  const [prerakProfile, setPrerakProfile] = React.useState();
  const [loadingList, setLoadingList] = useState(false);

  const getPrerakProfile = async () => {
    setLoadingList(true);
    try {
      const payload = {
        id: id,
      };
      const result = await PcuserService.getPrerakProfile(payload);

      setPrerakProfile(result?.data);
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data?.FACILITATOR_STATUS : {});
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoadingList(false);
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
          navigate("/prerak/PrerakList");
        },
      }}
      loading={loading}
      analyticsPageTitle={"PRERAK_PROFILE"}
      pageTitle={t("PRERAK_PROFILE")}
    >
      {beneficiary?.is_deactivated ? (
        <Alert status="warning" alignItems="start" mb="3" mt="4">
          <HStack alignItems="center" space="2" color="black">
            <Alert.Icon />
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px" bg="gray.200">
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
              {console.log({ prerakProfile })}
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

            <Box
              bg="gray.100"
              borderColor="gray.300"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <FrontEndTypo.H3 bold color="gray.800">
                  {t("PROFILE_DETAILS")}
                </FrontEndTypo.H3>
                <Box paddingTop="2">
                  <Progress size="xs" colorScheme="danger" />
                </Box>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                      <FrontEndTypo.H3>{t("BASIC_DETAILS")}</FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        // navigate(`/beneficiary/${id}/basicdetails`);
                      }}
                      color="maroon.400"
                    />
                  </HStack>
                  <Divider orientation="horizontal" />
                </VStack>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                      <FrontEndTypo.H3>
                        {t("EDUCATION_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        // navigate(`/beneficiary/${id}/basicdetails`);
                      }}
                      color="maroon.400"
                    />
                  </HStack>
                  <Divider orientation="horizontal" />
                </VStack>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                      <FrontEndTypo.H3>{t("OTHER_FACILITIES")}</FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        // navigate(`/beneficiary/${id}/basicdetails`);
                      }}
                      color="maroon.400"
                    />
                  </HStack>
                  <Divider orientation="horizontal" />
                </VStack>
              </VStack>
            </Box>
            <Box
              bg="gray.100"
              borderColor="gray.300"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <FrontEndTypo.H3 bold color="gray.800">
                  {t("CERTIFICATION_DETAILS")}
                </FrontEndTypo.H3>
                <Box paddingTop="2">
                  <Progress size="xs" colorScheme="danger" />
                </Box>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                      <FrontEndTypo.H3>{t("VIEW_&_DOWNLOAD")}</FrontEndTypo.H3>
                    </HStack>

                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={() => {
                        // navigate(`/beneficiary/${id}/basicdetails`);
                      }}
                      color="maroon.400"
                    />
                  </HStack>
                  <Divider orientation="horizontal" />
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
