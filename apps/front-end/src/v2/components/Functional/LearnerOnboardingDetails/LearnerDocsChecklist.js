import {
  Layout,
  t,
  benificiaryRegistoryService,
  FrontEndTypo,
  BodyMedium,
  getBeneficaryDocumentationStatus,
  SelectStyle,
} from "@shiksha/common-lib";
import React, { useState } from "react";
import { VStack, HStack, Select, CheckIcon, Alert } from "native-base";
import { useNavigate, useParams } from "react-router-dom";

const LearnerDocsChecklist = ({ footerLinks, setAlert }) => {
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [selectData, setselectData] = useState([]);
  const [status, setStatus] = useState({});
  const [checkList, setCheckList] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const [benificiary, setBenificiary] = React.useState({});
  const [msgshow, setmsgshow] = React.useState(false);
  const [loading, setloading] = React.useState(true);
  const [isDisable, setIsDisable] = React.useState(false);

  React.useEffect(async () => {
    let data = await benificiaryRegistoryService.getOne(id);
    let docStatus = data?.result?.program_beneficiaries?.documents_status;
    setBenificiary(data?.result);
    setloading(false);
    setmsgshow(getBeneficaryDocumentationStatus(docStatus));
    if (data.result?.program_beneficiaries?.documents_status) {
      setStatus(
        JSON.parse(data.result?.program_beneficiaries?.documents_status)
      );
    }
  }, []);
  React.useEffect(async () => {
    let data = await benificiaryRegistoryService.getDocumentStatus();
    setselectData(data);
  }, []);
  const navigate = useNavigate();

  React.useEffect(async () => {
    const keysLength = Object.keys(status).length;
    if (benificiary?.program_beneficiaries?.status === "ready_to_enroll") {
      setButtonPress(true);
    } else {
      setButtonPress(false);
    }
    const allValuesMatch = Object.values(status).every(
      (value) => value === "not_applicable" || value === "complete"
    );
    if (keysLength === 10 && allValuesMatch) {
      setCheckList(true);
    } else {
      setCheckList(false);
      setButtonPress(false);
    }
    let data = {
      edit_page_type: "document_status",
      documents_status: status,
    };
    if (Object.keys(status).length > 0) {
      let dataOutput = await benificiaryRegistoryService.getStatusUpdate(
        id,
        data
      );
    }
  }, [status]);

  const readyToEnrollApiCall = async () => {
    setIsDisable(true);
    if (
      !benificiary?.program_beneficiaries?.enrollment_status ||
      benificiary?.program_beneficiaries?.enrollment_status === "identified"
    ) {
      let bodyData = {
        user_id: benificiary?.id?.toString(),
        status: "ready_to_enroll",
        reason_for_status_update: "documents_completed",
      };
      const result = await benificiaryRegistoryService.statusUpdate(bodyData);
      if (result) {
        setAlert({ type: "success", title: t("DOCUMENT_COMPLETED") });
        navigate(`/beneficiary/profile/${id}`);
      }
    }
    setButtonPress(true);
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("DOCUMENTS_CHECKLIST"),
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      {[
        "dropout",
        "rejected",
        "ready_to_enroll",
        "enrolled_ip_verified",
      ].includes(benificiary?.program_beneficiaries?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack width={"90%"} margin={"auto"} mt={3}>
          <FrontEndTypo.H1 bold color="textGreyColor.900" mt="3">
            {t("MANDATORY")}
          </FrontEndTypo.H1>
          {/* <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
              {t("JAN_AADHAAR_CARD")}
            </FrontEndTypo.H3>
            <Select
              selectedValue={status?.jan_adhar || ""}
              accessibilityLabel="Select"
              placeholder={status?.jan_adhar || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, jan_adhar: itemValue })
              }
            >
              {Array.isArray(selectData) &&
                selectData.map((item, i) => {
                  return (
                    <Select.Item
                      key={i}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
            </Select>
          </HStack>

          <HStack
            mt={8}
            space="2"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
              {t("AADHAAR_CARD")}
            </FrontEndTypo.H3>

            <Select
              selectedValue={status?.aadhaar || ""}
              accessibilityLabel="Select"
              placeholder={status?.aadhaar || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon fontSize="sm" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, aadhaar: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </Select>
          </HStack> */}

          <VStack mt={4} space="2">
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("PHOTO")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.photo || ""}
              accessibilityLabel="Select"
              borderRadius="5px"
              placeholder={status?.photo || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, photo: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("MOBILE_NUMBER")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.mobile || ""}
              accessibilityLabel="Select"
              borderRadius="5px"
              placeholder={status?.mobile || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, mobile: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("MARKSHEET")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.marksheet || ""}
              placeholder={status?.marksheet || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              borderRadius="5px"
              onValueChange={(itemValue) =>
                setStatus({ ...status, marksheet: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("BANK_PASSBOOK")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.bank || ""}
              accessibilityLabel="Select"
              borderRadius="5px"
              placeholder={status?.bank || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, bank: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8} mb={10}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("BIRTH_CERTIFICATE")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.birth || ""}
              accessibilityLabel="Select"
              placeholder={status?.birth || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              borderRadius="5px"
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, birth: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>
          <FrontEndTypo.H1 bold color="textGreyColor.900">
            {t("MAY_BE_REQUIRED")}
          </FrontEndTypo.H1>
          <VStack mt={4}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("CASTE_CERTIFICATE")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.caste || ""}
              accessibilityLabel="Select"
              borderRadius="5px"
              placeholder={status?.caste || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, caste: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("TRANSFER_CERTIFICATE")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.transfer || ""}
              accessibilityLabel="Select"
              borderRadius="5px"
              placeholder={status?.transfer || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, transfer: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("AFFIDAVIT")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.notary || ""}
              accessibilityLabel="Select"
              placeholder={status?.notary || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              borderRadius="5px"
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, notary: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("CBOSIGN")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.cbo || ""}
              accessibilityLabel="Select"
              placeholder={status?.cbo || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              borderRadius="5px"
              onValueChange={(itemValue) =>
                setStatus({ ...status, cbo: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>

          <VStack mt={8} mb={8}>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("CBOSIGNTRANSFER")}
            </FrontEndTypo.H4>
            <SelectStyle
              selectedValue={status?.cbo_sign || ""}
              accessibilityLabel="Select"
              placeholder={status?.cbo_sign || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              borderRadius="5px"
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, cbo_sign: itemValue })
              }
            >
              {selectData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </SelectStyle>
          </VStack>
          {checkList ? (
            buttonPress ? (
              <FrontEndTypo.ColourPrimaryButton
                isDisabled={isDisable}
                mb={1}
                type="submit"
              >
                {t("MARK_AS_COMPLETE")}
              </FrontEndTypo.ColourPrimaryButton>
            ) : (
              <VStack>
                <Alert status="warning" alignItems={"start"} mb="3">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium justifyContent="Center">
                      {t("DOCUMENT_INSTRUCTION_MESSAGE")}
                    </BodyMedium>
                  </HStack>
                </Alert>

                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  mb={1}
                  type="submit"
                  onPress={() => {
                    readyToEnrollApiCall();
                  }}
                >
                  {t("MARK_AS_COMPLETE")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            )
          ) : (
            <React.Fragment></React.Fragment>
          )}

          <FrontEndTypo.Primarybutton
            isDisabled={isDisable}
            mt="4"
            mb={8}
            type="submit"
            onPress={() => {
              navigate(-1);
            }}
          >
            {t("SAVE")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      )}
    </Layout>
  );
};

export default LearnerDocsChecklist;
