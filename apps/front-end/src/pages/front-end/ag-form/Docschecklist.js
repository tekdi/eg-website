import { H1, H3, H4, Layout, t } from "@shiksha/common-lib";
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
} from "native-base";
import { useNavigate } from "react-router-dom";

const Docschecklist = () => {
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [service, setService] = React.useState("");
  const [selectData, setselectData] = useState([
    t("NOT_AVAILABLE"),
    t("AVAILABLE"),
    t("COMPLETE"),
    t("UPDATE_REQUIRED"),
  ]);

  const navigate = useNavigate();

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
        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("JAN_AADHAAR_CARD")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("AADHAAR_CARD")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("PHOTO")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("MOBILE_NUMBER")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("MARKSHEET")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("BANK_PASSBOOK")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("BIRTH_CERTIFICATE")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("CASTE_CERTIFICATE")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("TRANSFER_CERTIFICATE")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("AFFIDAVIT")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("CBOSIGN")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>

        <HStack
          mt={8}
          mb={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>{t("CBOSIGNTRANSFER")}</Text>
          <Select
            borderWidth={"0px"}
            borderBottomWidth={"2px"}
            borderRadius={"0"}
            borderColor={"black"}
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select"
            placeholder="Select"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            {selectData.map((item, i) => {
              return <Select.Item key={i} label={item} value={item} />;
            })}
          </Select>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default Docschecklist;
