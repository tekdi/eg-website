import React from "react";
import moment from "moment";
import { Button, HStack, Modal, Radio, Input, VStack, Box } from "native-base";
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

const statusList = [
  {
    status: "rejected",
    colorScheme: "danger",
    name: "REJECT_APPLICATION",
    reason: true,
  },
  {
    status: "shortlisted_for_orientation",
    name: "SHORTLIST_FOR_ORIENTATION",
  },
  {
    status: "potential_prerak",
    name: "POTENTIAL_PRERAK",
  },
  {
    status: "selected_for_training",
    name: "SELECT_FOR_TRAINING",
  },
  {
    status: "selected_for_onboarding",
    colorScheme: "success",
    name: "SELECT_FOR_ONBOARDING",
  },
  {
    status: "selected_prerak",
    colorScheme: "success",
    name: "SELECT_PRERAK",
  },
  {
    status: "quit",
    colorScheme: "danger",
    name: "QUIT",
    reason: true,
  },
  {
    status: "rusticate",
    colorScheme: "danger",
    name: "RUSTICATE",
    reason: true,
  },
];

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
      case "screened":
        setDisabledBtn([
          "rejected",
          "shortlisted_for_orientation",
          "quit",
          "rusticate",
        ]);
        break;
      case "rejected":
        setDisabledBtn(["screened", "quit", "rusticate"]);
        break;
      case "shortlisted_for_orientation":
        setDisabledBtn(["potential_prerak", "rejected", "quit", "rusticate"]);
        break;
      case "potential_prerak":
        setDisabledBtn([
          "selected_for_training",
          "rejected",
          "quit",
          "rusticate",
        ]);
        break;
      case "selected_for_training":
        setDisabledBtn([
          "selected_for_onboarding",
          "rejected",
          "quit",
          "rusticate",
        ]);
        break;
      case "selected_for_onboarding":
        setDisabledBtn(["selected_prerak", "rejected", "quit", "rusticate"]);
        break;
      case "selected_prerak":
        setDisabledBtn(["rejected", "quit", "rusticate"]);
        break;
      case "quit":
        setDisabledBtn(["rejected", "rusticate"]);
        break;
      case "rusticate":
        setDisabledBtn([]);
        break;
      default:
        setDisabledBtn(["screened", "rejected", "quit", "rusticate"]);
    }
  }, [data?.status]);

  return (
    <Box display="inline-flex" flexWrap="wrap" flexDirection="row" gap="4">
      <Button
        variant={"outlinePrimary"}
        colorScheme="success"
        onPress={() => {
          setShowModal("screened");
          setReason();
        }}
        isDisabled={!disabledBtn.includes("screened")}
      >
        {t("SCREEN_APPLICATION")}
      </Button>
      <Modal
        size={"xl"}
        isOpen={showModal === "screened"}
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
                        <H2>
                          {data?.first_name} {data?.last_name}
                        </H2>
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
                          { label: t("ON_PHONE"), value: "on_phone" },
                          { label: t("Offline"), value: "offline" },
                        ]}
                      />
                    </HStack>
                  </HStack>
                  <Input
                    variant={"underlined"}
                    placeholder={t("ADD_ADDRESS")}
                  />
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
                  {t("CANCEL")}
                </Button>
                <Button variant="primary" onPress={() => update("screened")}>
                  {t("SCHEDULE")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {statusList.map(({ name, ...item }) => (
        <Button
          variant={"outlinePrimary"}
          colorScheme="warning"
          {...item}
          isDisabled={!disabledBtn.includes(item?.status)}
          onPress={(e) => {
            setShowModal({ name, ...item });
            setReason();
          }}
        >
          {t(name)}
        </Button>
      ))}
      <Modal
        size={"xl"}
        isOpen={statusList.map((e) => e?.status).includes(showModal?.status)}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <HStack alignItems="center" space={2} justifyContent="center">
              <H1>{t(showModal?.name)}</H1>
            </HStack>
          </Modal.Header>
          <Modal.Body pb="5" px="5" pt="0">
            <VStack space="5">
              {showModal?.reason ? (
                <VStack
                  p="5"
                  space="5"
                  flex={1}
                  borderWidth="1"
                  borderColor="gray.300"
                >
                  <H2>{t("PLEASE_MENTION_YOUR_REASON")}</H2>
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
                      onChange={(e) => setReason(e?.target?.value)}
                      variant={"underlined"}
                      placeholder={t("MENTION_YOUR_REASON")}
                    />
                  ) : (
                    <React.Fragment />
                  )}
                </VStack>
              ) : (
                <H1 textAlign="center" py="5">
                  {t("ARE_YOU_SURE")}
                </H1>
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
                  isDisabled={
                    !(
                      (showModal?.reason &&
                        reason &&
                        reason?.toLowerCase() != "other") ||
                      !showModal?.reason
                    )
                  }
                  onPress={() => {
                    if (
                      (showModal?.reason &&
                        reason &&
                        reason?.toLowerCase() != "other") ||
                      !showModal?.reason
                    ) {
                      update(showModal?.status);
                    }
                  }}
                >
                  {t(showModal?.name)}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
