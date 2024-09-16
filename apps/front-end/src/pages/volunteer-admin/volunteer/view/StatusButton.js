import React, { useEffect } from "react";
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
import PropTypes from "prop-types";

const CRadio = ({ items, onChange }) => {
  const { t } = useTranslation();
  return (
    <Radio.Group
      onChange={onChange}
      accessibilityLabel="pick a size"
      defaultValue="1"
    >
      <HStack space={3} flexWrap="wrap" alignItems="center">
        {items?.map((item) => (
          <Radio value={item?.value} key={item} size="sm">
            {t(item?.title)}
          </Radio>
        ))}
      </HStack>
    </Radio.Group>
  );
};

CRadio.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
};

export default function StatusButton({ data, setData, updateDataCallBack }) {
  const [showModal, setShowModal] = React.useState();
  const [reason, setReason] = React.useState();
  const [disabledBtn, setDisabledBtn] = React.useState([]);
  const [statusList, setStatusList] = React.useState([]);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [isCampList, setIsCampList] = React.useState();
  const [okycResponse] = React.useState(
    JSON.parse(data?.program_faciltators?.okyc_response),
  );
  const [alertModal, setAlertModal] = React.useState();
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = React.useState(false);

  const navigate = useNavigate();

  const update = async (status) => {
    setIsDisable(true);
    if (data?.program_faciltator_id && status) {
      await facilitatorRegistryService.update({
        status_reason: reason,
        status: status,
        id: data?.program_faciltator_id,
      });
      setAlertModal(false);
      setShowModal();
      setData({ ...data, status_reason: reason, status: status });
    }
    setIsDisable(false);
  };

  const updateAadhaarDetails = async () => {
    setIsDisable(true);
    const dob =
      okycResponse?.aadhaar_data?.dateOfBirth &&
      moment(okycResponse?.aadhaar_data?.dateOfBirth, "D-M-Y").format("Y-M-D");
    const Namedata = okycResponse?.aadhaar_data?.name?.split(" ");
    const gender = okycResponse?.aadhaar_data?.gender;
    const id = data?.id;
    const [first_name, middle_name, last_name] = Namedata || [];
    let fullName = { first_name, middle_name, last_name };
    if (!last_name || last_name === "") {
      fullName = { first_name, last_name: middle_name };
    }
    const obj = { ...fullName, id, dob, gender };
    await facilitatorRegistryService.updateAadhaarOkycDetails(obj);
    updateDataCallBack && updateDataCallBack();
  };

  useEffect(() => {
    const init = async () => {
      const resultData = await enumRegistryService.listOfEnum();
      const statusListNew = resultData?.data.FACILITATOR_STATUS.map((item) => {
        let buttonStatus = "success";
        let reasonStatus = false;
        if (
          ["rusticate", "on_hold", "rejected", "quit"].includes(item?.value)
        ) {
          reasonStatus = true;
          buttonStatus = "error";
        }
        return {
          name: item.title,
          status: item.value,
          reason: reasonStatus,
          btnStatus: buttonStatus,
        };
      });
      setStatusList(statusListNew);
      setEnumOptions(resultData?.data);
    };
    init();
  }, []);

  React.useEffect(() => {
    switch (data?.status?.toLowerCase()) {
      case "rejected":
        setDisabledBtn(["on_hold", "application_screened", "quit"]);
        break;
      case "application_screened":
        setDisabledBtn([
          "rejected",
          "shortlisted_for_orientation",
          "rusticate",
          "on_hold",
          "quit",
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
      case "shortlisted_for_orientation":
        setDisabledBtn([
          "quit",
          "rejected",
          "pragati_mobilizer",
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
      case "selected_prerak":
        setDisabledBtn(["rejected", "quit", "rusticate"]);
        break;
      case "selected_for_onboarding":
        setDisabledBtn(["rejected", "selected_prerak", "quit", "rusticate"]);
        break;
      case "rusticate":
        setDisabledBtn(["on_hold"]);
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
      flexDirection="row"
      flexWrap="wrap"
      my="2"
      display="inline-flex"
      gap="4"
    >
      {statusList
        ?.filter(({ status }) => disabledBtn.includes(status))
        .map(({ name, ...item }) => (
          <AdminTypo.StatusButton
            key={name}
            {...item}
            isDisabled={!disabledBtn.includes(item?.status)}
            onPress={(e) => {
              isCampExistFunction({ name, ...item });
            }}
            status={item?.btnStatus}
          >
            {t(name)}
          </AdminTypo.StatusButton>
        ))}

      {alertModal === true && (
        <Modal
          onClose={() => setAlertModal(false)}
          size={"lg"}
          isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
        >
          <Modal.CloseButton />
          <Modal.Content rounded="2xl">
            <Modal.Body>
              <VStack space="3">
                <Alert alignItems={"start"} status="warning">
                  <HStack space="2" alignItems="center">
                    <Alert.Icon size="lg" />
                    <AdminTypo.H5 space="4" width={"100%"}>
                      {t("CONFITMATION_MESSAGE_IN_AADHAAROKYC_MODAL")}
                    </AdminTypo.H5>
                  </HStack>
                </Alert>

                <AdminTypo.PrimaryButton
                  onPress={(e) => {
                    update(showModal?.status);
                    updateAadhaarDetails();
                  }}
                  isDisabled={isDisable}
                >
                  <AdminTypo.H4 color="white" bold>
                    {t("CONFIRM")}
                  </AdminTypo.H4>
                </AdminTypo.PrimaryButton>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
      {showModal?.status == "selected_prerak" && (
        <Modal
          size={"xl"}
          onClose={() => setShowModal()}
          isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
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
                        aadhaarCompare: checkAadhaar(
                          data,
                          okycResponse?.aadhaar_data,
                        ),
                        user: data,
                      }}
                    />
                    {!["yes", "okyc_ip_verified"].includes(
                      data?.aadhar_verified,
                    ) && (
                      <Alert alignItems={"start"} status="warning">
                        <HStack space="2" alignItems="center">
                          <Alert.Icon />
                          {t("AADHAAR_OKYC_AADHAAR_NUMBER_IS_NOT_MATCHING")}
                        </HStack>
                      </Alert>
                    )}
                  </VStack>
                ) : (
                  <VStack flex="4" p="2">
                    <Alert alignItems={"start"} status="warning">
                      <HStack space="2" alignItems="center">
                        <Alert.Icon />
                        {t("AADHAAR_OKYC_NOT_COMPLETED_BY_PRERAK")}
                      </HStack>
                    </Alert>
                  </VStack>
                )}
              </VStack>
            </Modal.Body>
            {["yes", "okyc_ip_verified"].includes(data?.aadhar_verified) && (
              <Modal.Footer alignSelf="center">
                <AdminTypo.PrimaryButton
                  width="100%"
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
      {showModal?.status !== "selected_prerak" && (
        <Modal
          onClose={() => setShowModal()}
          isOpen={statusList?.map((e) => e?.name).includes(showModal?.name)}
          size={"xl"}
        >
          <Modal.Content rounded="2xl">
            <Modal.CloseButton />
            <Modal.Header borderBottomWidth={0}>
              <HStack justifyContent="center" alignItems="center" space={2}>
                <AdminTypo.H1 color="textGreyColor.500" bold>
                  {t(showModal?.name)}
                </AdminTypo.H1>
              </HStack>
            </Modal.Header>
            <Modal.Body pt="0" pb="5" px="5">
              <VStack space="5">
                {showModal?.reason ? (
                  <VStack
                    borderColor="gray.300"
                    p="5"
                    borderWidth="1"
                    flex={1}
                    space="5"
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
                      placeholder={t("MENTION_YOUR_REASON")}
                      onChange={(e) => {
                        setReason(e?.target?.value);
                      }}
                      variant={"underlined"}
                    />
                  </VStack>
                ) : (
                  <AdminTypo.H1 py="5" textAlign="center">
                    {t("ARE_YOU_SURE")}
                  </AdminTypo.H1>
                )}
                <HStack space={5} width="100%" justifyContent="space-between">
                  <AdminTypo.Secondarybutton onPress={() => setShowModal()}>
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton
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
                    isDisabled={
                      !(
                        (showModal?.reason &&
                          reason &&
                          reason?.toLowerCase() !== "other") ||
                        (!showModal?.reason && !isDisable)
                      )
                    }
                  >
                    {t(showModal?.name)}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}

      <Modal size={"xl"} isOpen={isCampList} onClose={() => setIsCampList()}>
        <Modal.CloseButton />
        <Modal.Content rounded="2xl">
          <Modal.Body>
            <Alert status="warning">{t("ALREADY_CAMP_REGISTER")}</Alert>
            <VStack space={4} p="4">
              {isCampList?.map((e) => {
                return (
                  <HStack justifyContent={"space-between"} key={e}>
                    {e?.group?.camp_name}
                    <AdminTypo.PrimaryButton
                      width="100%"
                      onPress={() =>
                        navigate(
                          `/admin/camps/${e?.group?.camp?.camp_id}/reassignPrerak/${data?.id}`,
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
            <AdminTypo.PrimaryButton
              width="100%"
              onPress={() => setIsCampList()}
            >
              {t("OK")}
            </AdminTypo.PrimaryButton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

StatusButton.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  updateDataCallBack: PropTypes.func,
};
