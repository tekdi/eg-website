import React from "react";
import { courseRegistryService, useWindowSize } from "@shiksha/common-lib";
import { Box, Center } from "native-base";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { sampleJSON } from "components/sampleJSON";
import { SunbirdPlayer } from "@shiksha/common-lib";


function Player() {
  const [width, height] = useWindowSize();
  const [assessmentData, setassessmentData] = useState();
  const [type , setType] = useState('Course')

  useEffect(() => {
    // const storedUserString = localStorage.getItem("topicData");
    // const storedUser = JSON.parse(storedUserString);
    setassessmentData(sampleJSON);
  }, []);

  const navigate = useNavigate();
  const handleExitButton = () => {
    {
      navigate(-1);
    }
  };


  const handleTrackData = async (
    { score, trackData, attempts, ...props },
    playerType = "quml"
  ) => {
    let data = {};
    const duration = props.duration
    //will be replaced by test ID
    // const programData = await subjectListRegistryService.getProgramId();
    if (playerType === "quml") {
      
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
      data = {
        test_id: "test_123",
        spent_time: duration.toString(),
        score: score,
        status: "completed",
        scoreDetails: JSON.stringify(newFormatData),
      };
    } else {
      data = {
        test_id: "test_123",
        spent_time: duration.toString(),
        score: score ? score : 0,
        status: "completed",
        scoreDetails: props,
     
      };
    }
    courseRegistryService.testTrackingCreate(data)

    console.log("TRACK DATA"  , data)

  };

  return (
    
    <SunbirdPlayer
      {...{ width, height: height - 64 }}
      {...assessmentData}
      userData={{
        firstName: localStorage.getItem("fullName"),
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
          handleTrackData(
            data,
            "application/vnd.sunbird.questionset"
          );
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
      public_url="http://localhost:5000"
    />

   
  );
}

export default Player;
