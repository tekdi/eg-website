import {
  Collapsible,
  H1,
  H3,
  H4,
  Layout,
  t,
  IconByName,
  FrontEndTypo,
} from "@shiksha/common-lib";
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
            <IconByName
              name="ErrorWarningLineIcon"
              color="textRed.300"
              size="20px"
            />

            <VStack pl="3">
              <FrontEndTypo.H2 color="textGreyColor.600">
                {t("AG_LEARNER_ALREADY_IDENTIFIED")}
              </FrontEndTypo.H2>
              <FrontEndTypo.H5 color="textGreyColor.600">
                {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
              </FrontEndTypo.H5>
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
        <VStack>
          <IconByName
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "120px" }}
          />
        </VStack>

        <VStack width="100%" pl="4">
          <FrontEndTypo.H3 color="textGreyColor.600">
            Added On 12th May 2023
          </FrontEndTypo.H3>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible
            fontSize="sm"
            color="textGreyColor.600"
            bold
            header={t("PROFILE_DETAILS")}
          >
            <VStack
              mt={4}
              borderBottomWidth={"1px"}
              borderColor="textGreyColor.600"
            >
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("BASIC")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack
              mt={4}
              borderBottomWidth={"1px"}
              borderColor="textGreyColor.600"
            >
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("EDUCATIONAL")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack
              mt={4}
              borderBottomWidth={"1px"}
              borderColor="textGreyColor.600"
            >
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("AADHAAR")}
              </FrontEndTypo.H3>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible
            defaultCollapse={false}
            fontSize="sm"
            color="textGreyColor.600"
            bold
            header={t("Documents Checklist")}
          >
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("BASIC")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("EDUCATIONAL")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("AADHAAR")}
              </FrontEndTypo.H3>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible
            defaultCollapse={false}
            fontSize="sm"
            color="textGreyColor.600"
            bold
            header={t("Enrollment Details")}
          >
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("BASIC")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("EDUCATIONAL")}
              </FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("AADHAAR")}
              </FrontEndTypo.H3>
            </VStack>
          </Collapsible>
        </VStack>

        <VStack width={"100%"}>
          <Collapsible defaultCollapse={false} header={t("Camp Details")}>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3>{t("BASIC")}</FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3>{t("EDUCATIONAL")}</FrontEndTypo.H3>
            </VStack>
            <VStack mt={4} borderBottomWidth={"1px"} borderColor={"#666666"}>
              <FrontEndTypo.H3>{t("AADHAAR")}</FrontEndTypo.H3>
            </VStack>
          </Collapsible>
        </VStack>

        <FrontEndTypo.Secondarybutton
          width={250}
          marginTop={"5em"}
          onPress={() => navToScreen()}
        >
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
        </FrontEndTypo.Secondarybutton>
      </VStack>
    </Layout>
  );
};

export default LearnerProfile;
