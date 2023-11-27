import { Layout } from "@shiksha/common-lib";
import Chip from "component/Chip";
import { ChipStatus } from "component/Chip";
import { Box, VStack, Image, Text } from "native-base";
import React, { useEffect, useRef } from "react";

export default function CampRoadmap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawCurve = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dark transparent background for the road
      context.fillStyle = "transparent";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Move the origin to the center of the canvas
      context.translate(canvas.width / 2, 0);

      // Cubic Bezier curve for a more pronounced curve
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(
        100,
        canvas.height / 4,
        -100,
        (3 * canvas.height) / 4,
        0,
        canvas.height
      );

      // Set the road color and width
      context.strokeStyle = "#666"; // Dark gray
      context.lineWidth = 40; // Increased road width
      context.stroke();

      context.strokeStyle = " rgba(255, 190, 24, 1)";
      context.lineWidth = 5; // Adjust line width as needed
      context.setLineDash([10, 10, 10]); // Set dash pattern

      const curveDash = context.bezierCurveTo(
        100,
        canvas.height / 0,
        -100,
        (3 * canvas.height) / 0,
        0,
        canvas.height
      );

      const centerX = curveDash; // X-coordinate for the vertical line

      for (let i = 0; i <= canvas.height; i += 20) {
        const startY = i;
        const endY = i + 90; // Adjust the dash length as needed

        context.moveTo(centerX, startY);
        context.lineTo(centerX, endY);
      }

      context.stroke();

      context.setTransform(1, 0, 0, 1, 0, 0);
    };

    const handleResize = () => {
      //   canvas.width = 100;
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

  //   const [dynamicBoxess, setDynamicBoxes] = React.useState([
  //     {
  //       id: 1,
  //       top: "20px",
  //       left: "25%",
  //     },
  //     {
  //       id: 2,
  //       top: "100px",
  //       left: "62%",
  //     },
  //     {
  //       id: 3,
  //       top: "200px",
  //       left: "28%",
  //     },

  //     {
  //       id: 4,
  //       name: "satra 4",
  //       top: "300px",
  //       left: "57%",
  //     },
  //     {
  //       id: 5,
  //       top: "400px",
  //       left: "20%",
  //     },

  //     {
  //       id: 6,
  //       top: "500px",
  //       left: "48%",
  //     },

  //     // Add more box positions as needed
  //   ]);

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
        alignSelf={`flex-start`}
        marginTop={`${index * 90}px`} // Adjusted marginTop for even and odd boxes

        // marginTop={index > 0 ? (index % 2 === 0 ? "280px" : "150px") : "0"} // Adjusted marginTop for even and odd boxes
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
        <Image
          color={"red"}
          bgColor={"red"}
          alt="Profile Image"
          marginLeft={index % 2 === 0 ? "35%" : "35%"}
          source={require("./arrow.png")}
        />
      </Box>
    ));
  };

  const generateDynamicBoxes = (count) => {
    const boxes = [];
    for (let i = 1; i <= count; i++) {
      boxes.push({
        id: i,
        left: `${(i % 2 === 0 ? 4 : 8) + (i % 2) * 60}%`, // Adjust left position based on index
        borderRadius: "20px",
        width: "106px",
        height: "42px",
      });
    }
    return boxes;
  };

  const dynamicBoxes = generateDynamicBoxes(90);

  // ...

  // Render the dynamic boxes

  renderDynamicBoxes();

  return (
    <React.Fragment>
      <Layout>
        <VStack>
          <canvas height={"100%"} ref={canvasRef} />
          {/* Road element */}
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

          {/* Dynamic boxes */}
          {/* Profile Image */}

          {/* Text */}
          {renderDynamicBoxes()}
        </VStack>
      </Layout>
    </React.Fragment>
  );
}
