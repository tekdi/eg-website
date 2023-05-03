import React from "react";
import moment from "moment";
import { Button, HStack, Modal, Radio, Input, VStack } from "native-base";
import {
  H1,
  H3,
  H2,
  IconByName,
  facilitatorRegistryService,
  t,
} from "@shiksha/common-lib";
import Chip from "component/Chip";

const CRadio = ({ items, onChange }) => {
  return (
    <Radio.Group
      defaultValue="1"
      accessibilityLabel="pick a size"
      onChange={onChange}
    >
      <HStack alignItems="center" space={3} flexWrap="wrap">
        {items.map((item, key) => (
          <Radio key={key} value={item?.value} size="sm">
            {item?.label}
          </Radio>
        ))}
      </HStack>
    </Radio.Group>
  );
};

export default function StatusButton({ data, setData }) {
  const [showModal, setShowModal] = React.useState();
  const [reason, setReason] = React.useState();
  const [disabledBtn, setDisabledBtn] = React.useState([]);

  const update = async (status) => {
    if (data?.program_faciltator_id && status) {
      const result = await facilitatorRegistryService.update({
        id: data?.program_faciltator_id,
        status: status,
        status_reason: reason,
      });
      setShowModal();
      setData({ ...data, status: status, status_reason: reason });
    }
  };

  React.useEffect(() => {
    switch (data?.status.toLowerCase()) {
      case "lead":
      case "applied":
        setDisabledBtn([]);
        break;
      case "selected":
      case "screened":
      case "approve":
        setDisabledBtn(["Approve", "Reject", "Review_Later"]);
        break;
      case "shortlisted":
        break;
      case "reject":
      case "rejected":
        setDisabledBtn(["Approve", "Reject", "Review_Later"]);
        break;
      case "review later":
      case "review_later":
      case "marked_review":
        setDisabledBtn(["Approve", "Review_Later"]);
        break;
      default:
        setDisabledBtn([]);
    }
  }, [data?.status]);

  return (
    <HStack alignItems="center" justifyContent={"space-between"}>
      <Button
        variant={"outlinePrimary"}
        colorScheme="success"
        onPress={() => {
          setShowModal("Approve");
          setReason();
        }}
        isDisabled={disabledBtn.includes("Approve")}
      >
        {t("APPROVE_APPLICATION")}
      </Button>
      <Modal
        size={"xl"}
        isOpen={showModal === "Approve"}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl" bg="translate">
          <Modal.CloseButton />
          <Modal.Header px="5" borderBottomWidth={0} bg="white" mb="1">
            <VStack>
              <HStack alignItems="center" space={2}>
                <IconByName
                  isDisabled
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "30px" }}
                />
                <H1>{t("APPLICATION_APPROVED")}</H1>
              </HStack>
              <H3>
                {t(
                  "YOU_CAN_NOW_SCHEDULE_AN_INTERVIEW_WITH_THE_APPROVED_CANDIDATE"
                )}
              </H3>
            </VStack>
          </Modal.Header>
          <Modal.Body p="5" bg="white">
            <VStack space={5}>
              <HStack alignItems="center" space={2}>
                <IconByName isDisabled name="MessageLineIcon" />
                <H1>{t("SCHEDULE_AN_INTERVIEW")}</H1>
              </HStack>

              <HStack alignItems="center" space={2}>
                <VStack
                  p="3"
                  space="5"
                  flex={0.7}
                  borderWidth="1"
                  borderStyle="dotted"
                >
                  <HStack alignItems="center">
                    <IconByName isDisabled name="UserLineIcon" />
                    <H2>{t("CANDIDATE")} -</H2>
                    <Chip bg="#e9e9e9">
                      <HStack alignItems="center" space={"2"} p="1">
                        <IconByName isDisabled name="MessageLineIcon" />
                        <H2>Rachana Bhave</H2>
                      </HStack>
                    </Chip>
                  </HStack>
                  <HStack alignItems="center" space={5}>
                    <HStack alignItems="center" space={2}>
                      <IconByName isDisabled name="TimeLineIcon" />
                      <H2 borderBottomWidth="1" borderBottomStyle="dotted">
                        {moment().format("dddd, Do MMM")}
                      </H2>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <Chip bg="#e9e9e9">
                        <H3>11:00</H3>
                      </Chip>
                      <H3>to</H3>
                      <Chip bg="#e9e9e9">
                        <H3>12:00</H3>
                      </Chip>
                    </HStack>
                  </HStack>
                  <HStack alignItems="center" space={5}>
                    <HStack alignItems="center" space={2}>
                      <IconByName isDisabled name="MapPinLineIcon" />
                      <H2>{t("LOCATION")}</H2>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <CRadio
                        items={[
                          { label: "On phone", value: "on_phone" },
                          { label: "Offline", value: "offline" },
                        ]}
                      />
                    </HStack>
                  </HStack>
                  <Input variant={"underlined"} placeholder="Add Address..." />
                  <HStack alignItems="center" space={4}>
                    <HStack alignItems="center" space={2}>
                      <IconByName isDisabled name="Notification2LineIcon" />
                      <H2>{t("ADD_REMINDER")}</H2>
                    </HStack>
                    <Chip bg="#e9e9e9">
                      <HStack alignItems="center" space={"2"} p="1">
                        <H2>{t("10_MINUTES_BEFORE")}</H2>
                      </HStack>
                    </Chip>
                  </HStack>
                </VStack>
                <HStack flex={0.3}></HStack>
              </HStack>
              <HStack alignItems="center" space={2} justifyContent="end">
                <Button variant="outlinePrimary" onPress={() => setShowModal()}>
                  {t("Cancel")}
                </Button>
                <Button variant="primary" onPress={() => update("screened")}>
                  {t("SCHEDULE")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Button
        variant={"outlinePrimary"}
        colorScheme="warning"
        onPress={(e) => setShowModal("Review_Later")}
        isDisabled={disabledBtn.includes("Review_Later")}
      >
        {t("REVIEW_LATER")}
      </Button>
      <Modal
        size={"xl"}
        isOpen={showModal === "Review_Later"}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <HStack alignItems="center" space={2} justifyContent="center">
              <H1>{t("REVIEW_LATER")}</H1>
            </HStack>
          </Modal.Header>
          <Modal.Body pb="5" px="5" pt="0">
            <VStack
              p="3"
              space="5"
              flex={1}
              borderWidth="1"
              borderColor="gray.300"
            >
              <H2>
                {t("PLEASE_MENTION_YOUR_REASON_FOR_REVIEWING_THE_CANDIDATE")}
              </H2>
              <CRadio
                onChange={(e) => setReason(e)}
                items={[
                  {
                    label: "Incomplete Form",
                    value: "Incomplete Form",
                  },
                  { label: "Not Qualified", value: "Not Qualified" },
                  {
                    label: "Less experienced",
                    value: "Less experienced",
                  },
                  { label: "Other", value: "Other" },
                ]}
              />
              {reason &&
              ![
                "Incomplete Form",
                "Not Qualified",
                "Less experienced",
              ].includes(reason) ? (
                <Input
                  onChange={(e) => setReason(e.target.value)}
                  variant={"underlined"}
                  placeholder="Mention your reason..."
                />
              ) : (
                <React.Fragment />
              )}
              <HStack alignItems="center" space={5}>
                <Button
                  flex="1"
                  variant="outlinePrimary"
                  colorScheme="blueGray"
                  onPress={() => setShowModal()}
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  flex="1"
                  variant="primary"
                  onPress={() => update("marked_review")}
                >
                  {t("REVIEW_LATER")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Button
        variant={"outlinePrimary"}
        colorScheme="danger"
        onPress={() => setShowModal("Reject")}
        isDisabled={disabledBtn.includes("Reject")}
      >
        {t("REJECT_APPLICATION")}
      </Button>
      <Modal
        size={"xl"}
        isOpen={showModal === "Reject"}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <HStack alignItems="center" space={2} justifyContent="center">
              <IconByName
                isDisabled
                name="EmotionSadLineIcon"
                _icon={{ size: "30px" }}
              />
              <H1>{t("REJECT_APPLICATION")}</H1>
            </HStack>
          </Modal.Header>
          <Modal.Body pb="5" px="5" pt="0">
            <VStack
              p="3"
              space="5"
              flex={1}
              borderWidth="1"
              borderColor="gray.300"
            >
              <H2>
                {t("PLEASE_MENTION_YOUR_REASON_FOR_REJECTING_THE_CANDIDATE")}
              </H2>
              <CRadio
                onChange={(e) => setReason(e)}
                items={[
                  {
                    label: "Incomplete Form",
                    value: "Incomplete Form",
                  },
                  { label: "Not Qualified", value: "Not Qualified" },
                  {
                    label: "Less experienced",
                    value: "Less experienced",
                  },
                  { label: "Other", value: "Other" },
                ]}
              />
              {reason &&
              ![
                "Incomplete Form",
                "Not Qualified",
                "Less experienced",
              ].includes(reason) ? (
                <Input
                  onChange={(e) => setReason(e.target.value)}
                  variant={"underlined"}
                  placeholder="Mention your reason..."
                />
              ) : (
                <React.Fragment />
              )}
              <HStack alignItems="center" space={5}>
                <Button
                  flex="1"
                  variant="outlinePrimary"
                  colorScheme="blueGray"
                  onPress={() => setShowModal()}
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  flex="1"
                  variant="primary"
                  onPress={() => update("rejected")}
                >
                  {t("REJECT")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Button
        variant={"outlinePrimary"}
        colorScheme="gray"
        onPress={(e) => setShowModal("Schedule")}
        isDisabled
      >
        {t("SCHEDULE_INTERVIEW")}
      </Button>
      <Modal
        size={"xl"}
        isOpen={showModal === "Schedule"}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl">
          <Modal.CloseButton />
          <Modal.Header px="5" borderBottomWidth={0}>
            <HStack alignItems="center" space={3}>
              <IconByName isDisabled name="MessageLineIcon" />
              <H1>{t("SCHEDULE_AN_INTERVIEW")}</H1>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <VStack space={5}>
              <HStack alignItems="center" space={2}>
                <VStack
                  p="3"
                  space="5"
                  flex={0.7}
                  borderWidth="1"
                  borderStyle="dotted"
                >
                  <HStack alignItems="center">
                    <IconByName isDisabled name="UserLineIcon" />
                    <H2> {t("CANDIDATE")} -</H2>
                    <Chip bg="#e9e9e9">
                      <HStack alignItems="center" space={"2"} p="1">
                        <IconByName isDisabled name="MessageLineIcon" />
                        <H2>Rachana Bhave</H2>
                      </HStack>
                    </Chip>
                  </HStack>
                  <HStack alignItems="center" space={5}>
                    <HStack alignItems="center" space={2}>
                      <IconByName isDisabled name="TimeLineIcon" />
                      <H2 borderBottomWidth="1" borderBottomStyle="dotted">
                        {moment().format("dddd, Do MMM")}
                      </H2>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <Chip bg="#e9e9e9">
                        <H3>11:00</H3>
                      </Chip>
                      <H3>to</H3>
                      <Chip bg="#e9e9e9">
                        <H3>12:00</H3>
                      </Chip>
                    </HStack>
                  </HStack>
                  <HStack alignItems="center" space={5}>
                    <HStack alignItems="center" space={2}>
                      <IconByName isDisabled name="MapPinLineIcon" />
                      <H2> {t("LOCATION")}</H2>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <Radio.Group
                        defaultValue="1"
                        accessibilityLabel="pick a size"
                      >
                        <HStack alignItems="center" space={3} flexWrap="wrap">
                          {[
                            { label: "On phone", value: "on_phone" },
                            { label: "Offline", value: "offline" },
                          ].map((item, key) => (
                            <Radio key={key} value={item?.value} size="sm">
                              {item?.label}
                            </Radio>
                          ))}
                        </HStack>
                      </Radio.Group>
                    </HStack>
                  </HStack>
                </VStack>
                <HStack flex={0.3}></HStack>
              </HStack>
              <HStack alignItems="center" space={5} justifyContent="end">
                <Button
                  variant="outlinePrimary"
                  colorScheme="blueGray"
                  onPress={() => setShowModal()}
                >
                  {t("CANCEL")}
                </Button>
                <Button variant="primary" onPress={() => update("Schedule")}>
                  {t("SCHEDULE")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </HStack>
  );
}
