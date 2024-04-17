import {
  Layout,
  t,
  benificiaryRegistoryService,
  FrontEndTypo,
  BodyMedium,
  getBeneficaryDocumentationStatus,
  enumRegistryService,
} from "@shiksha/common-lib";
import React, { Fragment, useEffect, useState } from "react";
import { VStack, HStack, Select, CheckIcon, Alert } from "native-base";
import { useNavigate, useParams } from "react-router-dom";

const LearnerDocsChecklist = ({ footerLinks }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [selectData, setselectData] = useState([]);
  const [status, setStatus] = useState({});
  const [checkList, setCheckList] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const [benificiary, setBenificiary] = useState({});
  const [msgshow, setmsgshow] = useState(false);
  const [loading, setloading] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [reqEnumData, setReqEnumData] = useState();
  const [optEnumData, setOptEnumData] = useState();
  const [alert, setAlert] = useState();

  useEffect(async () => {
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
  useEffect(async () => {
    let data = await benificiaryRegistoryService.getDocumentStatus();
    setselectData(data);
  }, []);
  const navigate = useNavigate();

  useEffect(async () => {
    const keysLength = Object.keys(status).length;
    if (benificiary?.program_beneficiaries?.status === "ready_to_enroll") {
      setButtonPress(true);
    } else {
      setButtonPress(false);
    }
    const allValuesMatch = Object.values(status).every(
      (value) => value === "not_applicable" || value === "complete"
    );
    if (keysLength === 13 && allValuesMatch) {
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

  useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const data = qData?.data?.DOCUMENT_LIST;
    const reqFilteredDocuments = data.filter(
      (document) => document.type === "required"
    );
    setReqEnumData(reqFilteredDocuments);

    const optionalFilteredDocuments = data?.filter(
      (document) => document.type === "optional"
    );
    setOptEnumData(optionalFilteredDocuments);
  }, []);

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
      pageTitle={"BENEFICIARY"}
      stepTitle={t("DOCUMENTS_CHECKLIST")}
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
          <FrontEndTypo.H3
            fontSize="sm"
            mt={3}
            bold
            color="textMaroonColor.900"
          >
            {t("MANDATORY")}
          </FrontEndTypo.H3>

          {reqEnumData?.map((item, index) => (
            <HStack
              key={index}
              mt={8}
              space="2"
              alignItems="center"
              justifyContent="space-between"
            >
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t(item?.title)}
              </FrontEndTypo.H3>
              <Select
                selectedValue={status[item.value] ? status[item.value] : ""}
                accessibilityLabel="Select"
                placeholder={"Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, [item.value]: itemValue })
                }
              >
                {selectData?.map((selectItem, i) => (
                  <Select.Item
                    key={i}
                    label={t(selectItem.title)}
                    value={selectItem.value}
                  />
                ))}
              </Select>
            </HStack>
          ))}

          <FrontEndTypo.H3
            pt="4"
            pb="0"
            fontSize="sm"
            bold
            color="textMaroonColor.900"
          >
            {t("MAY_BE_REQUIRED")}
          </FrontEndTypo.H3>

          {optEnumData?.map((item, index) => (
            <HStack
              key={index}
              mt={8}
              space="2"
              alignItems="center"
              justifyContent="space-between"
            >
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t(item?.title)}
              </FrontEndTypo.H3>
              <Select
                selectedValue={status[item.value] ? status[item.value] : ""}
                accessibilityLabel="Select"
                placeholder={"Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, [item.value]: itemValue })
                }
              >
                {selectData?.map((selectItem, i) => (
                  <Select.Item
                    key={i}
                    label={t(selectItem.title)}
                    value={selectItem.value}
                  />
                ))}
              </Select>
            </HStack>
          ))}
          {checkList &&
            (buttonPress ? (
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
            ))}
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
