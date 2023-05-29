import React from "react";
import {
  HStack,
  VStack,
  Text,
  Box,
  Progress,
  Divider,
  Button,
  Modal,
} from "native-base";
import { IconByName, Layout, t, FrontEndTypo } from "@shiksha/common-lib";
import {
  BodySmall,
  H1,
  H3,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  t,
} from "@shiksha/common-lib";
import CustomRadio from "component/CustomRadio";

const dropoutReasons = [
  {
    label: "Family issue",
    value: "Family issue",
  },
  {
    label: "Community Issue",
    value: "Community Issue",
  },
  {
    label: "Getting Married",
    value: "Getting Married",
  },
  {
    label: "Personal Reasons",
    value: "Personal Reasons",
  },
  {
    label: "Moving away",
    value: "Moving away",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const reactivateReasons = [
  {
    label: "Career Aspirations",
    value: "Career Aspirations",
  },
  {
    label: "Convinced by Prerak",
    value: "Convinced by Prerak",
  },
  {
    label: "Moved back",
    value: "Moved back",
  },
  {
    label: "Issue Resolved",
    value: "Issue Resolved",
  },
  {
    label: "Changed Mind",
    value: "Changed Mind",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export default function AgLearnerProfileView(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [reactivatemodalVisible, setreactivateModalVisible] =
    React.useState(false);
  const [reasonValue, setReasonValue] = React.useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");

  const dropoutApiCall = async () => {
    let bodyData = {
      id: "3",
      status: "dropout",
      reason_for_status_update: reasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setReasonValue("");
      setModalVisible(false);
    }
  };

  const reactivateApiCall = async () => {
    let bodyData = {
      id: "3",
      status: "activate",
      reason_for_status_update: reactivateReasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setReactivateReasonValue("");
      setreactivateModalVisible(false);
    }
  };

  return (
    <Layout _appBar={{ name: t("AG_LEARNER_PROFILE") }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <VStack alignItems="Center">
            <IconByName
              name="AccountCircleLineIcon"
              color="#666666"
              _icon={{ size: "60" }}
            />
            <Text
              fontFamily="Inter"
              fontStyle="normal"
              fontSize="16px"
              color="#790000"
              fontWeight="600px"
            >
              Khushboo Verma
            </Text>
            <Box>{t("IDENTIFIED")}</Box>
          </VStack>

          <Box
            bg="#FAFAFA"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <Text
                fontSize="14px"
                color="#212121"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                {t("PROFILE_DETAILS")}
              </Text>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("BASIC_DETAILS")}
                    </Text>
                  </HStack>

                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="MapPinLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("ADD_YOUR_ADDRESS")}
                    </Text>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("AADHAAR_DETAILS")}
                    </Text>
                  </HStack>

                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
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
                <Text
                  fontSize="14px"
                  color="#212121"
                  fontWeight="700"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  {t("DOCUMENT_CHECKLIST")}
                </Text>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                />
              </HStack>
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
                <Text
                  fontSize="14px"
                  color="#212121"
                  fontWeight="700"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  {t("ENROLLMENT_DETAILS")}
                </Text>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                />
              </HStack>
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
                <Text
                  fontSize="14px"
                  color="#212121"
                  fontWeight="700"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  {t("CAMP_DETAILS")}
                </Text>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                />
              </HStack>
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
                <Text
                  fontSize="14px"
                  color="#212121"
                  fontWeight="700"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  {t("JOURNEY_IN_PROJECT_PRAGATI")}
                </Text>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>
          <Button
            bgColor="white"
            borderColor="#790000"
            borderRadius="100px"
            borderWidth="2px"
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <HStack alignItems="Center">
              <IconByName
                name="UserUnfollowLineIcon"
                isDisabled
                color="#790000"
              />
              <Text
                color="#790000"
                fontSize="14px"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                {t("MARK_AS_DROPOUT")}
              </Text>
            </HStack>
          </Button>
          <Button
            bgColor="#AFF4C6"
            borderColor="white"
            borderRadius="100px"
            borderWidth="2px"
            onPress={() => {
              setreactivateModalVisible(true);
            }}
          >
            <HStack alignItems="Center">
              <Text
                color="#666666"
                fontSize="14px"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
              </Text>
            </HStack>
          </Button>
        </VStack>
      </VStack>
      <Modal
        isOpen={modalVisible}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content
          maxWidth="350"
          style={{ marginBottom: 0, marginTop: "auto" }}
        >
          <Modal.Header p="5" borderBottomWidth="0">
            <H1>{t("AG_PROFILE_ARE_YOU_SURE")}</H1>
            <H3>{t("AG_PROFILE_DROPOUT_MESSAGE")} </H3>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <H3>{t("AG_PROFILE_REASON_MEASSGAE")} </H3>
            <VStack space="5">
              <VStack
                space="2"
                bg="gray.100"
                p="1"
                rounded="lg"
                borderWidth={1}
                borderColor="gray.300"
                w="100%"
              >
                <VStack alignItems="center" space="1" flex="1">
                  <CustomRadio
                    options={{ enumOptions: dropoutReasons }}
                    schema={{ grid: 2 }}
                    value={reasonValue}
                    onChange={(e) => {
                      setReasonValue(e);
                    }}
                  />
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <Button
                  flex={1}
                  variant="primary"
                  onPress={() => {
                    dropoutApiCall();
                  }}
                >
                  {t("MARK_AS_DROPOUT")}
                </Button>
                <Button
                  flex={1}
                  variant="secondary"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  {t("CANCEL")}
                </Button>
              </VStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={reactivatemodalVisible}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content
          maxWidth="350"
          style={{ marginBottom: 0, marginTop: "auto" }}
        >
          <Modal.Header p="5" borderBottomWidth="0">
            <H1>{t("AG_PROFILE_ARE_YOU_SURE")}</H1>
            <H3>{t("AG_PROFILE_REACTIVAYE_MESSAGE")} </H3>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <H3>{t("AG_PROFILE_REACTIVATE_REASON_MEASSGAE")} </H3>
            <VStack space="5">
              <VStack
                space="2"
                bg="gray.100"
                p="1"
                rounded="lg"
                borderWidth={1}
                borderColor="gray.300"
                w="100%"
              >
                <VStack alignItems="center" space="1" flex="1">
                  <CustomRadio
                    options={{ enumOptions: reactivateReasons }}
                    schema={{ grid: 2 }}
                    value={reactivateReasonValue}
                    onChange={(e) => {
                      setReactivateReasonValue(e);
                    }}
                  />
                </VStack>
              </VStack>
              <VStack space="3">
                <Button
                  flex={1}
                  bgColor="#666666"
                  borderColor="white"
                  borderRadius="100px"
                  borderWidth="2px"
                  onPress={() => {
                    reactivateApiCall();
                  }}
                >
                  {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
                </Button>
                <Button
                  flex={1}
                  variant="secondary"
                  onPress={() => {
                    setreactivateModalVisible(false);
                  }}
                >
                  {t("CANCEL")}
                </Button>
              </VStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
