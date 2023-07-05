import React from "react";
import { HStack, Modal, Radio, Input, VStack, Box } from "native-base";
import {
  H1,
  facilitatorRegistryService,
  AdminTypo,
  enumRegistryService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";

const CRadio = ({ items, onChange }) => {
  const { t } = useTranslation();
  return (
    <Radio.Group
      defaultValue="1"
      accessibilityLabel="pick a size"
      onChange={onChange}
    >
      <HStack alignItems="center" space={3} flexWrap="wrap">
        {items?.map((item, key) => (
          <Radio key={key} value={item?.value} size="sm">
            {t(item?.title)}
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

export default function StatusButton({ data, setData }) {
  const [showModal, setShowModal] = React.useState();
  const [reason, setReason] = React.useState();
  const [disabledBtn, setDisabledBtn] = React.useState([]);
  const [statusList, setStatusList] = React.useState([]);
  const [enumOptions, setEnumOptions] = React.useState({});
  const { t } = useTranslation();

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
  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    const statusListNew = data?.data.FACILITATOR_STATUS.map((item) => {
      let buttonStatus = "success";
      if (["rejected", "quit", "rusticate", "on_hold"].includes(item?.value)) {
        buttonStatus = "error";
        return {
          status: item.value,
          name: item.title,
          btnStatus: buttonStatus,
          reason: true,
        };
      } else {
        return {
          status: item.value,
          name: item.title,
          btnStatus: buttonStatus,
        };
      }
    });
    setStatusList(statusListNew);

    setEnumOptions(data?.data);
  }, []);
  React.useEffect(() => {
    switch (data?.status?.toLowerCase()) {
      case "applied":
        setDisabledBtn(["on_hold"]);
        break;
      case "screened":
        setDisabledBtn(["on_hold", "quit"]);
        break;
      case "rejected":
        setDisabledBtn(["on_hold", "selected_prerak"]);
        break;
      case "shortlisted_for_orientation":
        setDisabledBtn(["quit"]);
        break;
      case "pragati_mobilizer":
        setDisabledBtn(["quit"]);
        break;
      case "selected_for_training":
        setDisabledBtn(["quit"]);
        break;
      case "selected_for_onboarding":
        setDisabledBtn(["quit"]);
        break;
      case "selected_prerak":
        setDisabledBtn([]);
        break;
      case "quit":
        setDisabledBtn(["selected_prerak", "on_hold"]);
        break;
      case "rusticate":
        setDisabledBtn(["on_hold", "selected_prerak"]);
        break;
      case "on_hold":
        setDisabledBtn(["rusticate", "quit"]);
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
      {statusList?.map(({ name, ...item }) => (
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
        isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
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
                    items={
                      enumOptions[
                        showModal.status === "quit"
                          ? "FACILITATOR_REASONS_FOR_QUIT"
                          : showModal.status === "rusticate"
                          ? "FACILITATOR_REASONS_FOR_RUSTICATE"
                          : showModal.status === "rejected"
                          ? "FACILITATOR_REASONS_FOR_REJECTED"
                          : showModal.status === "on_hold"
                          ? "FACILITATOR_REASONS_FOR_ON_REJECTED"
                          : []
                      ]
                    }
                  />
                  {reason &&
                  ![
                    "Incomplete Form",
                    "Not Qualified",
                    "Less experienced",
                  ].includes(reason) ? (
                    <Input
                      onChange={(e) => {
                        setReason(e?.target?.value);
                      }}
                      variant={"underlined"}
                      placeholder={t("MENTION_YOUR_REASON")}
                    />
                  ) : (
                    <Input
                      onChange={(e) => {
                        setReason(e?.target?.value);
                      }}
                      variant={"underlined"}
                      placeholder={t("MENTION_YOUR_REASON")}
                    />
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
