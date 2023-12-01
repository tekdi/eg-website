import React from "react";
import { testRegistryService, useWindowSize } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SunbirdPlayer } from "@shiksha/common-lib";
import { useParams } from "react-router-dom";

function Player() {
  const [width, height] = useWindowSize();
  const [assessmentData, setassessmentData] = useState();
  const [type, setType] = useState("Course");
  const { context, context_id, do_id } = useParams();

  useEffect(async () => {
    const assesmentData = await testRegistryService.getAssessment(do_id);
    setassessmentData(assesmentData);
  }, []);

  const navigate = useNavigate();
  const handleExitButton = () => {
    setTimeout(() => {
      navigate("/");
    }, 2000); // 1000 milliseconds = 1 second
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
    console.log("Total Duration:", totalDuration, "seconds");

    let score_txt = score ? score.toString() : "0";
    let duration_txt = props?.duration ? props.duration.toString() : "0";
    data = {
      test_id: "do_113935969671700480155",
      spent_time: totalDuration,
      score: score_txt,
      status: "completed",
      score_details: newFormatData,
      context: context,
      context_id: context_id,
    };
    testRegistryService.testTrackingCreate(data);
  };

  return (
    <SunbirdPlayer
      {...{ width, height: height - 64 }}
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
    />
  );
}

export default Player;
