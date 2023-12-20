import { IconByName } from "@shiksha/common-lib";
import { Box, HStack, Stack, Text, VStack, useTheme } from "native-base";
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

export default function Steper({
  type,
  steps,
  progress,
  cColor,
  rColor,
  size,
  bg,
}) {
  progress = !isNaN(parseInt(progress)) ? parseInt(progress) : 0;
  const [per, setPer] = React.useState(0);
  const [stepPer, setStepPer] = React.useState(0);
  const [stage, setStage] = React.useState({});
  const { colors } = useTheme();
  const ncColor = cColor ? cColor : colors?.["textMaroonColor"]?.["400"];
  const nrColor = rColor ? rColor : colors?.["textMaroonColor"]?.["500"];

  React.useEffect(() => {
    if (steps?.length > 0) {
      let newPer = 0;
      let stpeTotal = 0;
      const resultPer = 100 / steps?.length;
      setStepPer(resultPer);
      for (let i = 0; steps?.length > i; i++) {
        const e = parseInt(steps[i].value);
        stpeTotal += e;
        if (stpeTotal >= progress) {
          const newC = e + progress - stpeTotal;
          newPer += resultPer * (newC / e);
          setStage({ ...steps[i], index: i });
          break;
        } else {
          setStage({ ...steps[i], index: i });
          newPer += resultPer;
        }
      }
      setPer(newPer);
    } else {
      setPer(progress);
    }
  }, [progress]);

  if (!type) {
    return (
      <LineSteper
        {...{
          per,
          stepPer,
          steps,
          cColor: ncColor,
          rColor: nrColor,
          size,
          stage,
        }}
      />
    );
  }

  return (
    <CircalSteper
      {...{ steps, size, cColor: ncColor, rColor: nrColor, bg, per, stage }}
    />
  );
}

const LineSteper = ({ per, stepPer, steps, cColor, rColor, size }) => {
  return (
    <Box position="relative">
      <Box
        bg={rColor}
        height={size ? parseInt(size) / 10 : 1}
        w={"100%"}
        position="absolute"
      />
      <Box
        position="absolute"
        bg={cColor}
        height={size ? parseInt(size) / 10 : 1}
        width={`${Math.ceil(steps?.length > 0 ? per : progress)}%`}
      />
      <HStack justifyContent={"space-between"}>
        {steps?.length > 0 ? (
          steps?.map((e, key) => (
            <Circal
              key={key}
              text={e.label}
              color={rColor}
              size={size}
              borderWidth={(key + 1) * stepPer <= per ? 0 : 1}
              left={-1}
              bg={key * stepPer <= per ? cColor : "white"}
            />
          ))
        ) : (
          <Circal
            color={rColor}
            size={size}
            borderWidth={0}
            left={-1}
            bg={cColor}
          />
        )}
        <Circal
          color={rColor}
          size={size}
          bg={
            steps?.length * stepPer <= per
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
};

const CircalSteper = ({ steps, size, cColor, rColor, bg, per, stage }) => {
  const nSize = parseInt(size ? size : "40px");
  const fontSize = Math.floor(nSize / 5);
  return (
    <HStack space={4}>
      <Stack
        style={{
          background: `radial-gradient(closest-side, ${
            bg ? bg : "#F4F4F7"
          } 59%, transparent 70% 100%), conic-gradient(${cColor} ${per}%, ${rColor} 0)`,
          animation: "progress 2s 1 forwards",
        }}
        w={`${nSize}px`}
        h={`${nSize}px`}
        rounded="full"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize={`${fontSize === 0 ? 1 : fontSize}px`}>
          {steps?.length > 0 ? (
            <HStack>
              <Text fontWeight={600}>
                {per === 100 ? stage?.index + 1 : stage?.index}
              </Text>
              <Text color="#9E9E9E">/{steps?.length}</Text>
            </HStack>
          ) : (
            `${per}%`
          )}
        </Text>
      </Stack>
      {steps?.constructor?.name === "Array" && steps?.length > 0 && (
        <VStack>
          <HStack space={1} alignItems="center">
            {steps
              ?.map((e, key) => (
                <Text
                  key={key}
                  fontSize="8px"
                  fontWeight="400"
                  color={
                    stage?.index > key
                      ? cColor
                      : stage?.index === key
                      ? "gray.500"
                      : "gray.400"
                  }
                >
                  {e?.label}
                </Text>
              ))
              .reduce((prev, curr) => [
                prev,
                <IconByName
                  key={prev}
                  name="ArrowRightSLineIcon"
                  isDisabled
                  _icon={{ size: "10px" }}
                />,
                curr,
              ])}
          </HStack>
          <Text fontSize="18px" fontWeight="700">
            {stage?.index + 1}. {stage?.label}
          </Text>
        </VStack>
      )}
    </HStack>
  );
};
