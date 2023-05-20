import { Collapsible, H1, H3, H4, Layout, t } from "@shiksha/common-lib";
import React, { useState } from "react";
import {
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Modal,
  TextArea,
} from "native-base";
import { useNavigate } from "react-router-dom";

const LearnerProfile = () => {
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [modalVisible, setModalVisible] = React.useState(false);
  const [addmodal, setaddmodal] = React.useState(false);

  const navigate = useNavigate();

  const [firstname, setfirstname] = useState("Rachana Wagh");
  const [alreadyreg, setalreadyreg] = useState(true);
  const [regsuccess, setregsuccess] = useState(false);

  const [DOB, setDOB] = useState("10-11-1995");
  const [gender, setgender] = useState("Female");
  const [verify_id, setverify_id] = useState("xxxx xxxx 8880");

  const navToScreen = () => {
    console.log("reached ");

    if (alreadyreg) {
      console.log("reached here");
      setModalVisible(!modalVisible);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <Layout
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {},
        onlyIconsShow: ["backBtn", "userInfo"],
      }}
    >
      {alreadyreg && (
        <VStack bg={"#FDC5C766"} alignItems={"center"} py={5}>
          <HStack width={"90%"} mx={"auto"} alignItems={"center"}>
            <Image
              source={{
                uri: "/error.png",
              }}
              alt=""
              width="15px"
              height="15px"
            />
            <VStack>
              <Text ml={3}>{t("AG_LEARNER_ALREADY_IDENTIFIED")}</Text>
              <Text ml={3} fontSize={10} width={"80%"}>
                {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      )}

      {regsuccess && (
        <HStack bg={"#E6E6E6"} alignItems={"center"} py={5}>
          <HStack width={"90%"} mx={"auto"} alignItems={"center"}>
            <Image
              source={{
                uri: "/check.svg",
              }}
              alt=""
              width="15px"
              height="15px"
            />
            <Text ml={3}>{t("AADHAAR_VERIFICATION_SUCCESSFUL")}</Text>
          </HStack>
        </HStack>
      )}

      <VStack alignItems={"center"} mt={5}>
        <VStack rounded={5} bg={"#AFB1B6"} width={150} height={150}>
          <Image
            source={{
              uri: "",
            }}
            alt=""
            width="15px"
            height="15px"
          />
        </VStack>

        <VStack width={"100%"} mt={3}>
          <Text ml={3} fontSize={"12px"}>
            Added On 12th May 2023
          </Text>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible header={t("PROFILE_DETAILS")}>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Basic</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Educational</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Aadhaar</Text>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible
            defaultCollapse={false}
            header={t("Documents Checklist")}
          >
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Basic</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Educational</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Aadhaar</Text>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible defaultCollapse={false} header={t("Enrollment Details")}>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Basic</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Educational</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Aadhaar</Text>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible defaultCollapse={false} header={t("Camp Details")}>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Basic</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Educational</Text>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <Text>Aadhaar</Text>
            </VStack>
          </Collapsible>
        </VStack>

        <Button
          variant={"primary"}
          bg={"#DFDFDF"}
          width={250}
          marginTop={"5em"}
          onPress={() => navToScreen()}
        >
          <Text color={"black"}>
            <Image
              source={{
                uri: "/dropout.svg",
              }}
              alt="Prerak Orientation"
              resizeMode="contain"
              width="15px"
              height="15px"
              marginRight="10px"
            />
            {t("MARK_AS_DROPOUT")}
          </Text>
        </Button>
      </VStack>
    </Layout>
  );
};

export default LearnerProfile;
