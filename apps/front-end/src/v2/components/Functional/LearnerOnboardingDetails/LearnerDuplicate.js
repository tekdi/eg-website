import {
  H1,
  H3,
  H4,
  IconByName,
  Layout,
  t,
  FrontEndTypo,
  H2,
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

const LearnerDuplicate = () => {
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
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
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
              <FrontEndTypo.H3 color="textGreyColor.600">
                {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
              </FrontEndTypo.H3>
            </VStack>
          </HStack>
        </VStack>
      )}

      {regsuccess && (
        <HStack bg={"#E6E6E6"} alignItems={"center"} py={5}>
          <HStack width={"90%"} mx={"auto"} alignItems={"center"}>
            <IconByName name="CheckboxCircleLineIcon" />
            <FrontEndTypo.H5 ml={3}>
              {t("AADHAAR_VERIFICATION_SUCCESSFUL")}
            </FrontEndTypo.H5>
          </HStack>
        </HStack>
      )}

      <VStack alignItems={"center"} mt={5}>
        <VStack
          rounded={5}
          alignItems={"center"}
          justifyContent={"center"}
          bg="textGreyColor.400"
          width={120}
          height={100}
          borderColor="textGreyColor.300"
          borderWidth="1px"
        >
          <IconByName
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "50px" }}
          />
        </VStack>

        <VStack mt={10} space="3">
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H3 fontWeight={"600"} color="textMaroonColor.400">
              {t("FULL_NAME")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H3>{firstname}</FrontEndTypo.H3>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H3 fontWeight={"600"} color="textMaroonColor.400">
              {t("GENDER")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H3>{gender}</FrontEndTypo.H3>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H3 fontWeight={"600"} color="textMaroonColor.400">
              {t("DATE_OF_BIRTH")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H3>{DOB}</FrontEndTypo.H3>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H3
              fontWeight={"600"}
              color="textMaroonColor.400"
              width="55%"
            >
              {t("VERIFICATION_ID_NUMBER")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H3 ellipsis>{verify_id}</FrontEndTypo.H3>
          </HStack>
          <HStack justifyContent="flex-end">
            <FrontEndTypo.Primarybutton
              my="3"
              onPress={() => navigate("/learnerProfile")}
            >
              {t("ADD_DETAILS")}
            </FrontEndTypo.Primarybutton>
          </HStack>
          <FrontEndTypo.Secondarybutton
            onPress={() => navigate("/learnerProfile")}
          >
            {t("DOCUMENTS_CHECKLIST")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Secondarybutton>
            {t("ADD_RSOS_NIOS_NO")}
          </FrontEndTypo.Secondarybutton>
        </VStack>

        <FrontEndTypo.Primarybutton
          width={250}
          marginTop={"10em"}
          onPress={() => navToScreen()}
        >
          {t("NEXT")}
        </FrontEndTypo.Primarybutton>

        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          size="md"
        >
          <Modal.Content>
            <Modal.Body py={10}>
              <HStack mx={"auto"} alignItems={"top"}>
                <IconByName
                  name="ErrorWarningLineIcon"
                  color="textRed.300"
                  size="20px"
                ></IconByName>
                <FrontEndTypo.H2 color="textGreyColor.600" pl="2">
                  {t("AG_LEARNER_ALREADY_IDENTIFIED")}
                </FrontEndTypo.H2>
              </HStack>
              <VStack pt="3">
                <FrontEndTypo.H5 color="textGreyColor.600">
                  {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
                </FrontEndTypo.H5>
              </VStack>
              <FrontEndTypo.Primarybutton
                py="2"
                width="100%"
                marginTop={"2em"}
                onPress={() => {
                  setaddmodal(!addmodal);
                  setModalVisible(!modalVisible);
                }}
              >
                {t("CONTINUE_ADDING")}
              </FrontEndTypo.Primarybutton>
              <FrontEndTypo.Secondarybutton
                width="100%"
                marginTop={"1em"}
                onPress={() => setModalVisible(!modalVisible)}
              >
                {t("CANCEL_AND_GO_BACK")}
              </FrontEndTypo.Secondarybutton>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={addmodal} onClose={() => setaddmodal(false)} size="md">
          <Modal.Content py="0">
            <Modal.Body>
              <VStack alignItems={"center"}>
                <IconByName
                  name="CheckboxCircleLineIcon"
                  color="textGreyColor.150"
                  _icon={{ size: "50px" }}
                />
                <FrontEndTypo.H1
                  pb="2"
                  color="worksheetBoxText.400"
                  fontWeight={"600"}
                >
                  {t("AG_ADDED_SUCCESSFULLY")}
                </FrontEndTypo.H1>
                <TextArea
                  placeholder="Explain your claim of the AG Learner*"
                  w="100%"
                />
                <FrontEndTypo.Primarybutton
                  width={250}
                  marginTop={"1em"}
                  onPress={() => setaddmodal(!addmodal)}
                >
                  {t("SEND")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </VStack>
    </Layout>
  );
};

export default LearnerDuplicate;
