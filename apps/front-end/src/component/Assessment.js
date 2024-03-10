import React from "react";
import {
  H2,
  testRegistryService,
  useWindowSize,
  SunbirdPlayer,
  Loading,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, VStack, Text } from "native-base";
import { useTranslation } from "react-i18next";

function Player({ setAlert }) {
  const [width, height] = useWindowSize();
  const { t } = useTranslation();
  const [assessmentData, setAssessmentData] = React.useState();
  const [type, setType] = React.useState();
  const { context, context_id, do_id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [showExitButton, setShowExitButton] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
  const [response, setResponse] = React.useState(false);
  const id = localStorage.getItem("id");

  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage = t("REFRESH_ASSESSMENT_MESSAGE");
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  React.useEffect(async () => {
    const getCertificate = await testRegistryService.getCertificate({ id });
    const data = getCertificate?.data?.filter(
      (e) => e?.events?.filter((i) => i.id == context_id).length > 0
    );
    if (data?.length > 0) {
      setModalVisible2(true);
    }
  }, []);

  React.useEffect(async () => {
    const { error, ...assesmentData } = await testRegistryService.getAssessment(
      do_id
    );
    if (!error) {
      const updatedAssessmentData = await updateAllowSkipProperty(
        assesmentData
      );
      setAssessmentData(updatedAssessmentData);
      setType("Course");
    } else {
      console.log(error);
      setAlert(error);
    }
    setLoading(false);
  }, []);

  const updateAllowSkipProperty = (data) => {
    const updatedData = JSON.parse(JSON.stringify(data));
    // Creating a deep copy of JSON data that
    //we are getting from SUNBIRD API

    // Helper function that will recursively update "allowSkip" property from YES TO NO from all places.
    const updateAllowSkipRecursive = (obj) => {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === "object") {
          updateAllowSkipRecursive(obj[key]); // Recursive call for nested objects
        } else if (key === "allowSkip" && obj[key] === "Yes") {
          obj[key] = "No"; // Update "allowSkip" to "No"
        }
      }
    };

    updateAllowSkipRecursive(updatedData);

    return updatedData;
  };
  const navigate = useNavigate();

  const handleExitButton = () => {
    navigate("/");
  };

  const handleTrackData = async (
    { score, attempts, ...props },
    playerType = "quml"
  ) => {
    setModalVisible(true);
    let data = {};

    let trackDataold = localStorage.getItem("trackDATA");
    let trackData = JSON.parse(trackDataold);
    const newFormatData = trackData.reduce((oldData, newObj) => {
      const dataExist = oldData.findIndex(
        (e) => e.sectionId === newObj["item"]["sectionId"]
      );
      if (dataExist >= 0) {
        oldData[dataExist]["data"].push(newObj);
      } else {
        oldData = [
          ...oldData,
          {
            sectionId: newObj["item"]["sectionId"],
            sectionName: newObj["sectionName"] ? newObj["sectionName"] : "",
            data: [newObj],
          },
        ];
      }
      return oldData;
    }, []);

    const jsonData = newFormatData;

    // Function to calculate total duration for a section
    const calculateSectionDuration = (section) => {
      return section.data.reduce(
        (totalDuration, item) => totalDuration + item.duration,
        0
      );
    };

    // Function to calculate total duration for all sections
    const calculateTotalDuration = (jsonData) => {
      return jsonData.reduce(
        (totalDuration, section) =>
          totalDuration + calculateSectionDuration(section),
        0
      );
    };

    // Calculate and log the total duration
    const totalDuration = calculateTotalDuration(jsonData);

    let score_txt = score ? score.toString() : "0";

    data = {
      test_id: do_id,
      spent_time: totalDuration,
      score: score_txt,
      status: "completed",
      score_details: newFormatData,
      context: context,
      context_id: context_id,
    };
    const response = await testRegistryService.testTrackingCreate(data);
    if (response == 200) {
      setResponse("EXAM_SUBMITTED_SUCCESSFULLY");
    } else {
      setResponse("MAX_RETRY");
    }
    setModalVisible(false);
    setModalVisible3(true);
    setShowExitButton(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <VStack>
      <VStack p="5" bg="textRed.400" alignItems={"center"}>
        <H2 color="white">{localStorage.getItem("fullName")}</H2>
      </VStack>
      <Modal isOpen={modalVisible} avoidKeyboard size="lg">
        <Modal.Content>
          <Modal.Body alignItems="center">
            <Text> {t("AFTER_SUBMIT")}</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={modalVisible2}
        avoidKeyboard
        size="lg"
        onClose={() => navigate("/")}
      >
        <Modal.Content>
          <Modal.Body alignItems="center">
            <Text> {t("TEST_ALREADY_TAKEN")}</Text>
            <FrontEndTypo.DefaultButton
              textColor={"black"}
              onPress={() => navigate("/")}
            >
              {t("GO_BACK")}
            </FrontEndTypo.DefaultButton>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={modalVisible3}
        avoidKeyboard
        size="lg"
        onClose={() => navigate("/")}
      >
        <Modal.Content>
          <Modal.Body alignItems="center">
            <Text> {t(response)}</Text>
            <FrontEndTypo.DefaultButton
              textColor={"black"}
              onPress={() => navigate("/")}
            >
              {t("GO_BACK")}
            </FrontEndTypo.DefaultButton>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <VStack alignItems={"center"}>
        <SunbirdPlayer
          {...{
            width,
            height: height - 64,
            showExitButton,
            setShowExitButton,
            loading,
            setLoading,
          }}
          {...assessmentData}
          userData={{
            firstName: localStorage.getItem("fullName"),
            lastName: "",
          }}
          setTrackData={(data) => {
            if (
              [
                "assessment",
                "SelfAssess",
                "QuestionSet",
                "QuestionSetImage",
              ].includes(type)
            ) {
              handleTrackData(data);
            } else if (
              ["application/vnd.sunbird.questionset"].includes(
                assessmentData?.mimeType
              )
            ) {
              const lastData = data?.summary?.find(
                (e) => e?.endpageseen !== undefined
              );

              if (lastData?.endpageseen === true) {
                handleTrackData(data, "application/vnd.sunbird.questionset");
              }
            } else if (
              [
                "application/pdf",
                "video/mp4",
                "video/webm",
                "video/x-youtube",
                "application/vnd.ekstep.h5p-archive",
              ].includes(assessmentData?.mimeType)
            ) {
              handleTrackData(data, "pdf-video");
            } else {
              if (
                ["application/vnd.ekstep.ecml-archive"].includes(
                  assessmentData?.mimeType
                )
              ) {
                if (Array.isArray(data)) {
                  const score = data.reduce(
                    (old, newData) => old + newData?.score,
                    0
                  );
                  handleTrackData({ ...data, score: `${score}` }, "ecml");
                  setTrackData(data);
                } else {
                  handleTrackData({ ...data, score: `0` }, "ecml");
                }
              }
            }
          }}
          handleExitButton={handleExitButton}
          public_url={process.env.REACT_APP_SUNBIRD_PLAYER_URL}
          // public_url="http://localhost:5000"
        />
      </VStack>
    </VStack>
  );
}

export default Player;
