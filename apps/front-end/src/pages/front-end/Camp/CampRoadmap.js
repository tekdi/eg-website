import { Layout } from "@shiksha/common-lib";
import { Box, VStack, Image, Text } from "native-base";
import React, { useEffect, useRef } from "react";
import { campService } from "@shiksha/common-lib";

export default function CampRoadmap() {
  const canvasRef = useRef(null);

  //   useEffect(() => {
  //     const responseData = campService.getCampRoadmap();
  //     console.log("responseData roadmap", responseData);
  //   }, []);

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
        100,
        (canvas.height * 1) / 7,
        -100,
        (canvas.height * 6) / 7,
        0,
        canvas.height
      );
      context.strokeStyle = "#666";
      context.lineWidth = 40;
      context.stroke();

      context.strokeStyle = " rgba(255, 190, 24, 1)";
      context.lineWidth = 5;
      context.setLineDash([10, 10, 10]);

      const curveDash = context.bezierCurveTo(
        100,
        canvas.height / 0,
        -100,
        (3 * canvas.height) / 0,
        0,
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
      canvas.height = window.outerHeight * 1.5;
      drawCurve();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    context.setLineDash;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderDynamicBoxes = () => {
    return dynamicBoxes.map((box, index) => (
      <Box
        key={box.id}
        position="absolute"
        left={box.left}
        borderRadius={box.borderRadius}
        width={box.width}
        height={box.height}
        bg={index % 2 === 0 ? "rgba(121, 0, 0, 1)" : "rgba(0, 140, 14, 1)"}
        justifyContent="center"
        alignItems="center"
        marginTop={`${index * 95}px`}
      >
        <Box position="absolute" left="5%" transform="translateY(-50%)">
          <Image
            source={require("./profile.jpeg")}
            alt="Profile Image"
            size="40px"
            borderRadius="full"
          />
        </Box>
        <Text marginLeft={index % 2 === 0 ? "30%" : "30%"} color="white">
          {box.name || `सत्र ${box.id}`}
        </Text>
      </Box>
    ));
  };

  const generateDynamicBoxes = (count) => {
    const boxes = [];
    for (let i = 1; i <= count; i++) {
      boxes.push({
        id: i,
        left: `${(i % 2 === 0 ? 10 : 6) + (i % 2) * 60}%`,
        borderRadius: "20px",
        width: "106px",
        height: "42px",
      });
    }
    return boxes;
  };

  const dynamicBoxes = generateDynamicBoxes(9);

  renderDynamicBoxes();

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

          {renderDynamicBoxes()}
        </VStack>
      </Layout>
    </React.Fragment>
  );
}
