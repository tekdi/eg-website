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
        {items.map((item, key) => (
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
  const [color, setColor] = React.useState();
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
    console.log(data);
    //      setShowModal({ name, ...item });

    setStatusList([
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
        status: "pragati_mobilizer",
        btnStatus: "success",
        name: "PRAGATI_MOBILIZER",
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
      {
        status: "on_hold",
        btnStatus: "error",
        colorScheme: "danger",
        name: "HOLD",
        reason: true,
      },
    ]);
    setEnumOptions(data?.data);
  }, []);

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
        setDisabledBtn(["pragati_mobilizer", "rejected", "quit", "rusticate"]);
        break;
      case "pragati_mobilizer":
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
      case "on_hold":
        setDisabledBtn([
          "rejected",
          "quit",
          "rusticate",
          "selected_for_onboarding",
        ]);
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
      {enumOptions?.FACILITATOR_STATUS?.map(({ title, ...item }) => (
        <AdminTypo.StatusButton
          key={title}
          status={
            item?.value === "rusticate" ||
            item?.value === "on_hold" ||
            item?.value === "quit" ||
            item?.value === "rejected"
              ? "error"
              : "success"
          }
          isDisabled={!disabledBtn.includes(item?.value)}
          onPress={(e) => {
            setShowModal({ title, ...item });
            setReason();
          }}
        >
          {t(title)}
        </AdminTypo.StatusButton>
      ))}
      <Modal
        size={"xl"}
        isOpen={enumOptions?.FACILITATOR_STATUS?.map((e) => e?.title).includes(
          showModal?.title
        )}
        onClose={() => setShowModal()}
      >
        <Modal.Content rounded="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <HStack alignItems="center" space={2} justifyContent="center">
              <AdminTypo.H1 color="textGreyColor.500" bold>
                {t(showModal?.value)}
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
                        showModal.value === "quit"
                          ? "FACILITATOR_REASONS_FOR_QUIT"
                          : showModal.value === "rusticate"
                          ? "FACILITATOR_REASONS_FOR_RUSTICATE"
                          : showModal.value === "rejected"
                          ? "FACILITATOR_REASONS_FOR_REJECTED"
                          : []
                      ]
                    }
                  />
                  {console.log(showModal.value)}
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
                      update(showModal?.value);
                    }
                  }}
                >
                  {t(showModal?.title)}
                </AdminTypo.PrimaryButton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
