import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HStack, VStack, Box, Progress, Divider, Alert } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  t,
  ImageView,
} from "@shiksha/common-lib";

export default function LearnerProfileView() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = React.useState({});

  return (
    <Layout
      _appBar={{
        name: t("LEARNER_PROFILE"),
        // onPressBackButton: () => {
        //   navigate("/learner/learnerListView");
        // },
      }}
      loading={loading}
      analyticsPageTitle={"LEARNER_PROFILE"}
      pageTitle={t("LEARNER_PROFILE")}
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
            <VStack alignItems="center" pt="20px">
              {beneficiary?.profile_photo_1?.id ? (
                <ImageView
                  source={{
                    document_id: beneficiary?.profile_photo_1?.id,
                  }}
                  width="190px"
                  height="190px"
                />
              ) : (
                <Box
                  bgColor={"profileColor"}
                  width="64px"
                  height="64px"
                  borderRadius={"50%"}
                ></Box>
              )}
            </VStack>

            {/* <Box
              bg="gray.100"
              borderColor="gray.300"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            > */}
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold color="gray.800">
                {t("PROFILE_PROGRESS")}
              </FrontEndTypo.H3>
              <Box paddingTop="2">
                <Progress size="xs" colorScheme="red" />
              </Box>
              <Box flex={1} p={4} bg="white">
                <VStack space={4}>
                  <Box>
                    <Progress value={45} size="lg" />
                  </Box>
                </VStack>
              </Box>
            </VStack>
            {/* </Box> */}

            <Box
              bg="gray.100"
              borderColor="gray.300"
              borderRadius="10px"
              borderWidth="1px"
              pb="6"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <FrontEndTypo.H3 bold color="gray.800">
                  {t("LEARNERS_DETAILS")}
                </FrontEndTypo.H3>
                <Box paddingTop="2">
                  <Progress size="xs" colorScheme="danger" />
                </Box>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
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
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                      <FrontEndTypo.H3>{t("ADD_ADDRESS")}</FrontEndTypo.H3>
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
                  {t("OTHER_DETAILS")}
                </FrontEndTypo.H3>
                <Box paddingTop="2">
                  <Progress size="xs" colorScheme="danger" />
                </Box>
                <VStack space="2" paddingTop="5">
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space="md" alignItems="center">
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                      <FrontEndTypo.H3>
                        {t("DOCUMENT_CHECKLIST")}
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
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
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
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                      <FrontEndTypo.H3>
                        {t("ENROLLMENT_DETAILS")}
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
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                      <FrontEndTypo.H3>{t("PCR_DETAILS")}</FrontEndTypo.H3>
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
                      {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                      <FrontEndTypo.H3>
                        {t("JOURNEY_IN_PROJECT_PRAGATI")}
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
              </VStack>
            </Box>
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
