import { H1, H3, H4, Layout, t,SelectBottomStyle } from "@shiksha/common-lib";
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
  Box
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
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("JAN_AADHAAR_CARD")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          space="2"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
         <Text fontSize="sm" bold color="textMaroonColor.400">{t("AADHAAR_CARD")}</Text>
        
              <SelectBottomStyle
                selectedValue={service}
                accessibilityLabel="Select"
                placeholder="Select"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon fontSize="sm" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setService(itemValue)}
              >
                {selectData.map((item, i) => {
                  return <Select.Item key={i} label={item} value={item} />;
                })}
              </SelectBottomStyle> 
          
         
        </HStack>

        <HStack
          mt={8}
          space="2"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("PHOTO")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("MOBILE_NUMBER")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("MARKSHEET")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("BANK_PASSBOOK")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("BIRTH_CERTIFICATE")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("CASTE_CERTIFICATE")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("TRANSFER_CERTIFICATE")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("AFFIDAVIT")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("CBOSIGN")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>

        <HStack
          mt={8}
          mb={8}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="sm" bold color="textMaroonColor.400">{t("CBOSIGNTRANSFER")}</Text>
          <SelectBottomStyle
            selectedValue={service}
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
          </SelectBottomStyle>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default Docschecklist;
