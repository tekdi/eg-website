import { Box, HStack, Text, VStack } from "native-base";
import React from "react";

const Circal = ({ text, color, size, ...props }) => (
  <VStack>
    <Box
      width={size ? size : "12px"}
      height={size ? size : "12px"}
      top={size ? `-${parseInt(size) / 3}` : "-4px"}
      borderWidth={1}
      borderColor={color ? color : "gray.300"}
      rounded="full"
      {...props}
    />
    <Text fontSize={size ? size : "12px"}>{text}</Text>
  </VStack>
);

export default function Steper({ steps, progress, cColor, rColor, size }) {
  progress = !isNaN(parseInt(progress)) ? parseInt(progress) : 0;
  const [per, setPer] = React.useState(0);
  const [stepPer, setStepPer] = React.useState(0);

  React.useEffect(() => {
    let newPer = 0;
    let stpeTotal = 0;
    const resultPer = 100 / steps.length;
    setStepPer(resultPer);
    for (let i = 0; steps.length > i; i++) {
      const e = parseInt(steps[i].value);
      stpeTotal += e;
      if (stpeTotal >= progress) {
        const newC = e + progress - stpeTotal;
        newPer += resultPer * (newC / e);
        break;
      } else {
        newPer += resultPer;
      }
    }
    setPer(newPer);
  }, [progress]);

  return (
    <Box position="relative">
      <Box
        bg={rColor ? rColor : "gray.300"}
        height={size ? parseInt(size) / 10 : 1}
        w={"100%"}
        position="absolute"
      />
      <Box
        position="absolute"
        bg={cColor ? cColor : "gray.500"}
        height={size ? parseInt(size) / 10 : 1}
        width={`${per}%`}
      />
      <HStack justifyContent={"space-between"}>
        {steps.map((e, key) => (
          <Circal
            key={key}
            text={e.label}
            color={rColor}
            size={size}
            borderWidth={(key + 1) * stepPer <= per ? 0 : 1}
            left={-1}
            bg={key * stepPer <= per ? (cColor ? cColor : "gray.500") : "white"}
          />
        ))}
        <Circal
          color={rColor}
          size={size}
          bg={
            steps.length * stepPer <= per
              ? cColor
                ? cColor
                : "gray.500"
              : "white"
          }
          left={size ? `${parseInt(size) / 3}` : "4px"}
        />
      </HStack>
    </Box>
  );
}
