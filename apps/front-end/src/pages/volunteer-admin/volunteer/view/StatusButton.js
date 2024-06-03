import React from "react";
import { HStack, Modal, Radio, Input, VStack, Box, Alert } from "native-base";
import {
  H1,
  facilitatorRegistryService,
  AdminTypo,
  enumRegistryService,
  checkAadhaar,
  campService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import AadharCompare from "../../../front-end/AadhaarKyc/AadhaarCompare";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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
          <Radio key={item} value={item?.value} size="sm">
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

export default function StatusButton({ data, setData, updateDataCallBack }) {
  const [showModal, setShowModal] = React.useState();
  const [reason, setReason] = React.useState();
  const [disabledBtn, setDisabledBtn] = React.useState([]);
  const [statusList, setStatusList] = React.useState([]);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [isCampList, setIsCampList] = React.useState();
  const [okycResponse] = React.useState(
    JSON.parse(data?.program_faciltators?.okyc_response)
  );
  const [alertModal, setAlertModal] = React.useState();
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = React.useState(false);

  const navigate = useNavigate();

  const update = async (status) => {
    setIsDisable(true);
    if (data?.program_faciltator_id && status) {
      await facilitatorRegistryService.update({
        id: data?.program_faciltator_id,
        status: status,
        status_reason: reason,
      });
      setAlertModal(false);
      setShowModal();
      setData({ ...data, status: status, status_reason: reason });
    }
    setIsDisable(false);
  };

  const updateAadhaarDetails = async () => {
    setIsDisable(true);
    const id = data?.id;
    const dob =
      okycResponse?.aadhaar_data?.dateOfBirth &&
      moment(okycResponse?.aadhaar_data?.dateOfBirth, "D-M-Y").format("Y-M-D");
    const gender = okycResponse?.aadhaar_data?.gender;
    const Namedata = okycResponse?.aadhaar_data?.name?.split(" ");
    const [first_name, middle_name, last_name] = Namedata || [];
    let fullName = { first_name, middle_name, last_name };
    if (!last_name || last_name === "") {
      fullName = { first_name, last_name: middle_name };
    }
    const obj = { ...fullName, id, dob, gender };
    await facilitatorRegistryService.updateAadhaarOkycDetails(obj);
    updateDataCallBack && updateDataCallBack();
  };
  React.useEffect(async () => {
    const resultData = await enumRegistryService.listOfEnum();
    const statusListNew = resultData?.data.FACILITATOR_STATUS.map((item) => {
      let buttonStatus = "success";
      let reasonStatus = false;
      if (["rejected", "quit", "rusticate", "on_hold"].includes(item?.value)) {
        buttonStatus = "error";
        reasonStatus = true;
      }
      return {
        status: item.value,
        name: item.title,
        btnStatus: buttonStatus,
        reason: reasonStatus,
      };
    });
    setStatusList(statusListNew);
    setEnumOptions(resultData?.data);
  }, []);

  React.useEffect(() => {
    switch (data?.status?.toLowerCase()) {
      case "application_screened":
        setDisabledBtn([
          "rejected",
          "shortlisted_for_orientation",
          "rusticate",
          "on_hold",
          "quit",
        ]);
        break;
      case "rejected":
        setDisabledBtn(["on_hold", "application_screened", "quit"]);
        break;
      case "shortlisted_for_orientation":
        setDisabledBtn([
          "quit",
          "rejected",
          "pragati_mobilizer",
          "rusticate",
          "on_hold",
        ]);
        break;
      case "pragati_mobilizer":
        setDisabledBtn([
          "quit",
          "rejected",
          "selected_for_onboarding",
          "rusticate",
          "on_hold",
        ]);
        break;
      case "selected_for_training":
        setDisabledBtn([
          "rejected",
          "quit",
          "selected_for_onboarding",
          "rusticate",
          "on_hold",
        ]);
        break;
      case "selected_for_onboarding":
        setDisabledBtn(["rejected", "selected_prerak", "quit", "rusticate"]);
        break;
      case "selected_prerak":
        setDisabledBtn(["rejected", "quit", "rusticate"]);
        break;
      case "quit":
        setDisabledBtn([
          "application_screened",
          "shortlisted_for_orientation",
          "pragati_mobilizer",
          "selected_for_onboarding",
          "selected_for_training",
          "on_hold",
        ]);
        break;
      case "rusticate":
        setDisabledBtn(["on_hold"]);
        break;
      case "on_hold":
        setDisabledBtn([
          "rusticate",
          "shortlisted_for_orientation",
          "pragati_mobilizer",
          "selected_for_training",
          "quit",
          "applied",
          "application_screened",
          "rejected",
        ]);
        break;
      default:
        setDisabledBtn([
          "pragati_mobilizer",
          "application_screened",
          "rejected",
          "quit",
          "rusticate",
          "on_hold",
        ]);
    }
  }, [data?.status]);

  const isCampExistFunction = async ({ name, ...item }) => {
    if (["rejected", "quit", "rusticate"].includes(item?.status)) {
      const campExist = await campService.campIsExist({ id: data?.id || "" });
      if (campExist?.length > 0) {
        setIsCampList(campExist);
      } else {
        setShowModal({ name, ...item });
        setReason();
      }
    } else {
      setShowModal({ name, ...item });
      setReason();
    }
  };

  return (
    <Box
      display="inline-flex"
      flexWrap="wrap"
      flexDirection="row"
      gap="4"
      my="2"
    >
      {statusList
        ?.filter(({ status }) => disabledBtn.includes(status))
        .map(({ name, ...item }) => (
          <AdminTypo.StatusButton
            key={name}
            {...item}
            status={item?.btnStatus}
            isDisabled={!disabledBtn.includes(item?.status)}
            onPress={(e) => {
              isCampExistFunction({ name, ...item });
            }}
          >
            {t(name)}
          </AdminTypo.StatusButton>
        ))}

      {showModal?.status !== "selected_prerak" && (
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
                    <Input
                      onChange={(e) => {
                        setReason(e?.target?.value);
                      }}
                      variant={"underlined"}
                      placeholder={t("MENTION_YOUR_REASON")}
                    />
                  </VStack>
                ) : (
                  <AdminTypo.H1 textAlign="center" py="5">
                    {t("ARE_YOU_SURE")}
                  </AdminTypo.H1>
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
                          reason?.toLowerCase() !== "other") ||
                        (!showModal?.reason && !isDisable)
                      )
                    }
                    onPress={() => {
                      if (
                        (showModal?.reason &&
                          reason &&
                          reason?.toLowerCase() !== "other") ||
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
      )}
      {showModal?.status == "selected_prerak" && (
        <Modal
          isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
          onClose={() => setShowModal()}
          size={"xl"}
        >
          <Modal.CloseButton />
          <Modal.Content rounded="2xl">
            {["okyc_ip_verified", "yes"].includes(data?.aadhar_verified) && (
              <Modal.Header alignItems="center">
                {t("IDENTITY_VERIFICATION")}
              </Modal.Header>
            )}
            <Modal.Body>
              <VStack space={4}>
                {data?.program_faciltators?.okyc_response ? (
                  <VStack space="4">
                    <AadharCompare
                      {...{
                        user: data,
                        aadhaarCompare: checkAadhaar(
                          data,
                          okycResponse?.aadhaar_data
                        ),
                      }}
                    />
                    {!["yes", "okyc_ip_verified"].includes(
                      data?.aadhar_verified
                    ) && (
                      <Alert status="warning" alignItems={"start"}>
                        <HStack alignItems="center" space="2">
                          <Alert.Icon />
                          {t("AADHAAR_OKYC_AADHAAR_NUMBER_IS_NOT_MATCHING")}
                        </HStack>
                      </Alert>
                    )}
                  </VStack>
                ) : (
                  <VStack p="2" flex="4">
                    <Alert status="warning" alignItems={"start"}>
                      <HStack alignItems="center" space="2">
                        <Alert.Icon />
                        {t("AADHAAR_OKYC_NOT_COMPLETED_BY_PRERAK")}
                      </HStack>
                    </Alert>
                  </VStack>
                )}
              </VStack>
            </Modal.Body>
            {["okyc_ip_verified", "yes"].includes(data?.aadhar_verified) && (
              <Modal.Footer alignSelf="center">
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    setAlertModal(true);
                  }}
                >
                  {t("CONFIRM")}
                </AdminTypo.PrimaryButton>
              </Modal.Footer>
            )}
          </Modal.Content>
        </Modal>
      )}
      {alertModal === true && (
        <Modal
          isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
          onClose={() => setAlertModal(false)}
          size={"lg"}
        >
          <Modal.CloseButton />
          <Modal.Content rounded="2xl">
            <Modal.Body>
              <VStack space="3">
                <Alert status="warning" alignItems={"start"}>
                  <HStack alignItems="center" space="2">
                    <Alert.Icon size="lg" />

                    <AdminTypo.H5 space="4" width={"100%"}>
                      {t("CONFITMATION_MESSAGE_IN_AADHAAROKYC_MODAL")}
                    </AdminTypo.H5>
                  </HStack>
                </Alert>

                <AdminTypo.PrimaryButton
                  isDisabled={isDisable}
                  onPress={(e) => {
                    update(showModal?.status);
                    updateAadhaarDetails();
                  }}
                >
                  <AdminTypo.H4 bold color="white">
                    {t("CONFIRM")}
                  </AdminTypo.H4>
                </AdminTypo.PrimaryButton>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}

      <Modal isOpen={isCampList} onClose={() => setIsCampList()} size={"xl"}>
        <Modal.CloseButton />
        <Modal.Content rounded="2xl">
          <Modal.Body>
            <Alert status="warning">{t("ALREADY_CAMP_REGISTER")}</Alert>
            <VStack p="4" space={4}>
              {isCampList?.map((e) => {
                return (
                  <HStack key={e} justifyContent={"space-between"}>
                    {e?.group?.camp_name}

                    <AdminTypo.PrimaryButton
                      onPress={() =>
                        navigate(
                          `/admin/camps/${e?.group?.camp?.camp_id}/reassignPrerak/${data?.id}`
                        )
                      }
                    >
                      {t("ASSIGN")}
                    </AdminTypo.PrimaryButton>
                  </HStack>
                );
              })}
            </VStack>
          </Modal.Body>
          <Modal.Footer alignSelf="center">
            <AdminTypo.PrimaryButton onPress={() => setIsCampList()}>
              {t("OK")}
            </AdminTypo.PrimaryButton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
