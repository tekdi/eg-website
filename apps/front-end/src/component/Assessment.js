import React from "react";
import {
  H2,
  testRegistryService,
  useWindowSize,
  SunbirdPlayer,
  Loading,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { VStack } from "native-base";

function Player({ setAlert }) {
  const [width, height] = useWindowSize();
  const [assessmentData, setAssessmentData] = React.useState();
  const [type, setType] = React.useState();
  const { context, context_id, do_id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [showExitButton, setShowExitButton] = React.useState(false);

  React.useEffect(async () => {
    const { error, ...assesmentData } = await testRegistryService.getAssessment(
      do_id
    );
    if (!error) {
      setAssessmentData(assesmentData);
      setType("Course");
    } else {
      console.log(error);
      setAlert(error);
    }
    setLoading(false);
  }, []);

  const navigate = useNavigate();
  const handleExitButton = () => {
    navigate("/");
  };

  const handleTrackData = async (
    { score, attempts, ...props },
    playerType = "quml"
  ) => {
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
    testRegistryService.testTrackingCreate(data);
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
      <VStack alignItems={"center"}>
        <SunbirdPlayer
          {...{ width, height: height - 64, showExitButton, setShowExitButton }}
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
              handleTrackData(data, "application/vnd.sunbird.questionset");
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
