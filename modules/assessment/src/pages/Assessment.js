import React from "react";
import { courseRegistryService, useWindowSize } from "@shiksha/common-lib";
import { Box, Center } from "native-base";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { sampleJSON } from "components/sampleJSON";
import { SunbirdPlayer } from "@shiksha/common-lib";
import { duration } from "moment";
import { useParams } from "react-router-dom";


function Player() {
  const [width, height] = useWindowSize();
  const [assessmentData, setassessmentData] = useState();
  const [type , setType] = useState('Course')
  const { context,context_id,do_id } = useParams();

 
  useEffect(async () => {
    
    console.log(do_id);
    const assesmentData = await courseRegistryService.getAssessment(do_id)
    setassessmentData(assesmentData)
    
  }, []);

  const navigate = useNavigate();
  const handleExitButton = () => {
    {
      navigate(-1);
    }
  };

  const handleTrackData = async (
    { score, attempts, ...props },
    playerType = "quml"
  ) => {
    let data = {};
    console.log(props.duration)
   let trackDataold = localStorage.getItem("trackDATA")
   let trackData = JSON.parse(trackDataold)
    // const programData = await subjectListRegistryService.getProgramId();
    // if (playerType === "quml") {
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
      console.log("score",score);
      let score_txt=score ? score.toString() : "0";
      let duration_txt=props.duration.toString();
      data = {
        test_id: "do_113935969671700480155",
        spent_time: duration_txt,
        score: score_txt,
        status: "completed",
        score_details: newFormatData,
        context:"events",
        context_id:313,
      };
    // }
    //  else {
    //   data = {
        
    //     status: "completed",
    //     score: score ? score : 0,
    //     scoreDetails: JSON.stringify(props),
        
    //   };
    // }
        courseRegistryService.testTrackingCreate(data)

    console.log("AFTER SUBMIT")
   console.log(data)
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
