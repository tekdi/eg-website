import { H1, H3, H4, Layout, t, benificiaryRegistoryService } from "@shiksha/common-lib";
import React, { useState } from "react";
import {
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Modal,
  TextArea,
  Select,
  CheckIcon,
  Box,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";

const Docschecklist = () => {

  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams()
  const [selectData, setselectData] = useState([]);
  const [status, setStatus] = useState({})

  React.useEffect(async () => {
    let data = await benificiaryRegistoryService.getOne(id)
    if (data.result?.program_beneficiaries?.documents_status) {
      setStatus(JSON.parse(data.result?.program_beneficiaries?.documents_status))
    }
  }, [])
  React.useEffect(async () => {
    let data = await benificiaryRegistoryService.getDocumentStatus()
    setselectData(data)
  }, [])
  const navigate = useNavigate();

  React.useEffect(async () => {
    let data = {
      edit_page_type: "document_status",
      documents_status: status
    }
    if (Object.keys(status).length > 0) {
      let dataOutput = await benificiaryRegistoryService.getStatusUpdate(id, data)
    }

  }, [status])



  return (
    <Layout
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate("/agduplicate");
        },
        onlyIconsShow: ["backBtn", "userInfo"],
      }}
    >

      <VStack width={"90%"} margin={"auto"} mt={3}>
        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("JAN_AADHAAR_CARD")}
          </Text>
          <Select
            selectedValue={status?.jan_adhar || ""}
            accessibilityLabel="Select"
            placeholder={status?.jan_adhar || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "jan_adhar": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          space="2"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("AADHAAR_CARD")}
          </Text>

          <Select
            selectedValue={status?.aadhaar || ""}
            accessibilityLabel="Select"
            placeholder={status?.aadhaar || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon fontSize="sm" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "aadhaar": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          space="2"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("PHOTO")}
          </Text>
          <Select
            selectedValue={status?.photo || ""}
            accessibilityLabel="Select"
            placeholder={status?.photo || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "photo": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("MOBILE_NUMBER")}
          </Text>
          <Select
            selectedValue={status?.mobile || ""}
            accessibilityLabel="Select"
            placeholder={status?.mobile || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "mobile": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("MARKSHEET")}
          </Text>
          <Select
            selectedValue={status?.marksheet || ""}
            accessibilityLabel="Select"
            placeholder={status?.marksheet || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "marksheet": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("BANK_PASSBOOK")}
          </Text>
          <Select
            selectedValue={status?.bank || ""}
            accessibilityLabel="Select"
            placeholder={status?.bank || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "bank": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("BIRTH_CERTIFICATE")}
          </Text>
          <Select
            selectedValue={status?.birth || ""}
            accessibilityLabel="Select"
            placeholder={status?.birth || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "birth": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("CASTE_CERTIFICATE")}
          </Text>
          <Select
            selectedValue={status?.caste || ""}
            accessibilityLabel="Select"
            placeholder={status?.caste || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "caste": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("TRANSFER_CERTIFICATE")}
          </Text>
          <Select
            selectedValue={status?.transfer || ""}
            accessibilityLabel="Select"
            placeholder={status?.transfer || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "transfer": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("AFFIDAVIT")}
          </Text>
          <Select
            selectedValue={status?.notary || ""}
            accessibilityLabel="Select"
            placeholder={status?.notary || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "notary": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack mt={8} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("CBOSIGN")}
          </Text>
          <Select
            selectedValue={status?.cbo || ""}
            accessibilityLabel="Select"
            placeholder={status?.cbo || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "cbo": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          mb={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">
            {t("CBOSIGNTRANSFER")}
          </Text>
          <Select
            selectedValue={status?.cbo_sign || ""}
            accessibilityLabel="Select"
            placeholder={status?.cbo_sign || "Select"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setStatus({ ...status, "cbo_sign": itemValue })}
          >
            {selectData?.map((item, i) => {
              return <Select.Item key={i} label={`${t(item.title)}`} value={item.value} />;
            })}
          </Select>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default Docschecklist;
