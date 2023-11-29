import { IconByName, Layout } from "@shiksha/common-lib";
import { Box, VStack, HStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { campService, t } from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

export default function CampRoadmap() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [lessonList, setLessonList] = useState([]);
  const [dynamicBoxes, setDynamicBoxes] = useState([]);

  const renderDynamicBoxes = () => {
    let isFirstCompletedEncountered = false;

    return lessonList.map((item, i) => {
      const isCompleted = item?.session_tracks?.[0]?.status === "complete";
      const isPreviousCompleted =
        i > 0 && lessonList[i - 1]?.session_tracks?.[0]?.status === "complete";

      if (isCompleted && !isFirstCompletedEncountered) {
        isFirstCompletedEncountered = true;
      }

      return (
        <Box
          top={"25px"}
          key={item?.ordering}
          position="absolute"
          left={`${(i % 2 === 0 ? 10 : 0) + (i % 2) * 60}%`}
          borderRadius={"25px"}
          width={"110px"}
          height={"45px"}
          bg={
            isFirstCompletedEncountered && isCompleted
              ? "rgba(0, 140, 14, 1)"
              : isCompleted
              ? "rgba(0, 140, 14, 1)"
              : isPreviousCompleted
              ? "rgba(121, 0, 0, 1)"
              : item?.session_tracks?.[0]?.status === "incomplete"
              ? "rgba(255, 168, 0, 1)"
              : "rgba(121, 0, 0, 1)"
          }
          justifyContent="center"
          alignItems="center"
          marginTop={`${i * 90}px`}
        >
          <HStack
            fontWeight={"bold"}
            color={"white"}
            space={4}
            alignItems={"space-between"}
          >
            {t(`सत्र ${item?.ordering}`)}
            {isCompleted ? (
              <IconByName
                color="white"
                key={""}
                name="CheckLineIcon"
                _icon={{ size: "20px" }}
              />
            ) : item?.session_tracks?.[0]?.status === "incomplete" ? (
              <IconByName
                onClick={() => handleIncompleteClick(item)}
                color="white"
                key={""}
                name="ArrowRightSLineIcon"
                _icon={{ size: "20px" }}
              />
            ) : i === 0 ? (
              <IconByName
                onClick={() => handleIncompleteClick(item)}
                color="white"
                key={""}
                name="ArrowRightSLineIcon"
                _icon={{ size: "20px" }}
              />
            ) : null}
          </HStack>
        </Box>
      );
    });
  };

  function handleIncompleteClick(item) {
    if (
      item?.session_tracks?.[0]?.status !== "complete" &&
      item?.session_tracks?.[0]?.status !== "incomplete"
    ) {
      navigate(`/camps/${id}/roadmap`);
    } else {
      navigate("/camps");
    }
  }

  useEffect(async () => {
    console.log("id", id);
    const responseData = await campService.getLearningLessonList({ id });
    setLessonList(responseData?.data?.learning_lesson_plans_master || []);
    console.log("data", responseData?.data?.learning_lesson_plans_master);

    setDynamicBoxes(responseData?.data?.learning_lesson_plans_master || []);
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawCurve = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "transparent";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.translate(canvas.width / 2, 0);
      context.beginPath();
      context.moveTo(0, 0);

      context.bezierCurveTo(
        0,
        (canvas.height * 1) / 1,
        -0,
        (canvas.height * 6) / 1,
        3,
        canvas.height
      );
      context.strokeStyle = "#666";
      context.lineWidth = 70;
      context.stroke();

      context.strokeStyle = " rgba(255, 190, 24, 1)";
      context.lineWidth = 5;
      context.setLineDash([10, 10, 10]);

      const curveDash = context.bezierCurveTo(
        100,
        canvas.height * 3,
        -100,
        (6 * canvas.height) / 3,
        3,
        canvas.height
      );

      const centerX = curveDash;

      for (let i = 0; i <= canvas.height; i += 20) {
        const startY = i;
        const endY = i + 90;

        context.moveTo(centerX, startY);
        context.lineTo(centerX, endY);
      }

      context.stroke();

      context.setTransform(1, 0, 0, 1, 0, 0);
    };

    const handleResize = () => {
      canvas.height = window.innerHeight * 10;
      drawCurve();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    context.setLineDash;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <VStack>
          <canvas ref={canvasRef} />
          <Box>
            <Box
              width="20%"
              bottom="0"
              backgroundColor={"red"}
              left="50%"
              transform="translateX(-50%)"
              bg="gray.800"
              height="100%"
            ></Box>
          </Box>
          {renderDynamicBoxes(dynamicBoxes)}
        </VStack>
      </Layout>
    </React.Fragment>
  );
}
