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
  AdminTypo,
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
const styles = {
  modalxxl: {
    maxWidth: "950px",
    maxHeight: "440px",
    width: "100%",
    height: "100%",
  },
};
const statusList = [
  {
    status: "screened",
    btnStatus: "success",
    name: "SCREEN_APPLICATION",
  },
  {
    status: "rejected",
    btnStatus: "error",
    name: "REJECT_APPLICATION",
    reason: true,
  },
  {
    status: "shortlisted_for_orientation",
    btnStatus: "success",
    name: "SHORTLIST_FOR_ORIENTATION",
  },
  {
    status: "prerak_mobilizer",
    btnStatus: "success",
    name: "PRERAK_MOBILIZER",
  },
  {
    status: "selected_for_training",
    btnStatus: "success",
    name: "SELECT_FOR_TRAINING",
  },
  {
    status: "selected_for_onboarding",
    btnStatus: "success",
    colorScheme: "success",
    name: "SELECT_FOR_ONBOARDING",
  },
  {
    status: "selected_prerak",
    btnStatus: "success",
    colorScheme: "success",
    name: "SELECT_PRERAK",
  },
  {
    status: "quit",
    btnStatus: "error",
    colorScheme: "danger",
    name: "QUIT",
    reason: true,
  },
  {
    status: "rusticate",
    btnStatus: "error",
    colorScheme: "danger",
    name: "RUSTICATE",
    reason: true,
  },
];

export default function StatusButton({ data, setData }) {
  const [showModal, setShowModal] = React.useState();
  const [reason, setReason] = React.useState();
  const [disabledBtn, setDisabledBtn] = React.useState([]);
  const [color, setColor] = React.useState();

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
    switch (data?.status?.toLowerCase()) {
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
        setDisabledBtn(["prerak_mobilizer", "rejected", "quit", "rusticate"]);
        break;
      case "prerak_mobilizer":
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
        ["rejected", "rusticate"];
        break;
      case "rusticate":
        setDisabledBtn([]);
        break;
      default:
        setDisabledBtn(["screened", "rejected", "quit", "rusticate"]);
    }
  }, [data?.status]);

  return (
    <Box
      display="inline-flex"
      flexWrap="wrap"
      flexDirection="row"
      gap="4"
      my="2"
    >
      {/* <AdminTypo.StatusButton
        status="success"
        onPress={() => {
          setShowModal("screened");
          setReason();
        }}
        isDisabled={!disabledBtn.includes("screened")}
      >
        {t("SCREEN_APPLICATION")}
      </AdminTypo.StatusButton> */}
      {/* <Modal
        size={"xl"}
        isOpen={showModal === "screened"}
        onClose={() => setShowModal()}
      >
        <Modal.Content {...styles.modalxxl}>
          <Modal.CloseButton />
          <Modal.Header bg="white">
            <VStack>
              <HStack justifyContent="center" space={2}>
                <IconByName
                  isDisabled
                  name="CheckboxCircleFillIcon"
                  color="SuccessColor"
                  _icon={{ size: "30px" }}
                />
                <AdminTypo.H2 bold color="textGreyColor.500">
                  {t("APPLICATION_APPROVED")}
                </AdminTypo.H2>
              </HStack>
              <AdminTypo.H6 color="textGreyColor.500" textAlign="center">
                {t(
                  "YOU_CAN_NOW_SCHEDULE_AN_INTERVIEW_WITH_THE_APPROVED_CANDIDATE"
                )}
              </AdminTypo.H6>
            </VStack>
          </Modal.Header>
          <Modal.Body p="5" bg="white">
            <VStack space={5}>
              <HStack alignItems="center" space={2}>
                <IconByName isDisabled name="TimeLineIcon" />
                <AdminTypo.H1 color="textGreyColor.800">
                  {t("SCHEDULE_AN_INTERVIEW")}
                </AdminTypo.H1>
              </HStack>

              <HStack alignItems="center" space={2}>
                <VStack>
                  <HStack justifyContent="flex-end">
                    <HStack alignItems="center" space={"2"} p="1">
                      <AdminTypo.H4 color="textGreyColor.500" bold>
                        for {data?.first_name} {data?.last_name}
                      </AdminTypo.H4>
                    </HStack>
                    <IconByName isDisabled name="UserLineIcon" />
                  </HStack>
                  <HStack alignItems="center" space={5}>
                    <HStack alignItems="center" space={6}>
                      <IconByName
                        isDisabled
                        name="TimeLineIcon"
                        _icon={{ size: "20px" }}
                        color="textGreyColor.100"
                      />
                      <AdminTypo.H6 color="textGreyColor.100">
                        Time
                      </AdminTypo.H6>
                      <AdminTypo.H5
                        borderBottomWidth="1"
                        borderBottomStyle="dotted"
                      >
                        {moment().format("dddd, Do MMM")}
                      </AdminTypo.H5>
                    </HStack>
                    <HStack alignItems="center" space={3} py="2">
                      <Chip bg="#e9e9e9">
                        <H3>11:00</H3>
                      </Chip>
                      <H3>to</H3>
                      <Chip bg="#e9e9e9">
                        <H3>12:00</H3>
                      </Chip>
                    </HStack>
                  </HStack>
                  <HStack alignItems="center" space={4} py="2">
                    <HStack alignItems="center" space={2}>
                      <IconByName
                        isDisabled
                        name="Notification2LineIcon"
                        _icon={{ size: "20px" }}
                        color="textGreyColor.100"
                      />
                      <AdminTypo.H6 color="textGreyColor.100">
                        {t("REMINDER")}
                      </AdminTypo.H6>
                    </HStack>
                    <Chip bg="textGreyColor">
                      <HStack alignItems="center" space={"2"} p="1">
                        <H2>{t("10_MINUTES_BEFORE")}</H2>
                      </HStack>
                    </Chip>
                  </HStack>
                  <HStack alignItems="center" space={5} py="2">
                    <HStack alignItems="center" space={2}>
                      <IconByName
                        isDisabled
                        name="MapPinLineIcon"
                        _icon={{ size: "20px" }}
                        color="textGreyColor.100"
                      />
                      <AdminTypo.H6 color="textGreyColor.100">
                        {t("LOCATION")}
                      </AdminTypo.H6>
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
                  <Input placeholder={t("ADD_ADDRESS")} />
                </VStack>
                <HStack flex={0.3}></HStack>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <HStack width="100%" justifyContent="space-between">
              <AdminTypo.Secondarybutton onPress={() => setShowModal()}>
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton onPress={() => update("screened")}>
                {t("SCHEDULE")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal> */}
      {statusList.map(({ name, ...item }) => (
        <AdminTypo.StatusButton
          key={name}
          {...item}
          status={item?.btnStatus}
          isDisabled={!disabledBtn.includes(item?.status)}
          onPress={(e) => {
            setShowModal({ name, ...item });
            setReason();
          }}
        >
          {t(name)}
        </AdminTypo.StatusButton>
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
              <AdminTypo.H1 color="textGreyColor.500" bold>
                {t(showModal?.name)}
              </AdminTypo.H1>
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
                  <AdminTypo.H6 color="textGreyColor.500" bold>
                    {t("PLEASE_MENTION_YOUR_REASON")}
                  </AdminTypo.H6>
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
              <HStack width="100%" justifyContent="space-between" space={5}>
                <AdminTypo.Secondarybutton onPress={() => setShowModal()}>
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
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
                </AdminTypo.PrimaryButton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
