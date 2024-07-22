import { FrontEndTypo } from "@shiksha/common-lib";
import { Box, HStack, VStack, Pressable } from "native-base";

const TimelineItem = ({ index, title, description, isLast, space, isDone }) => {
  return (
    <HStack alignItems="flex-start">
      <VStack alignItems="center" position="relative">
        <Box
          _text={{ color: isDone ? "white" : "gray.300" }}
          p={2}
          rounded="full"
          zIndex={1}
          w="6"
          h="6"
          alignItems={"center"}
          justifyContent={"center"}
          {...(isDone
            ? { bg: "eg-blue.600" }
            : { borderWidth: "1px", borderColor: "gray.300" })}
        >
          {index + 1}
        </Box>
        {!isLast && (
          <Box
            bg={isDone ? "eg-blue.600" : "gray.300"}
            width="2px"
            flex={1}
            height={`${parseInt(space * 4) + 1}px`}
            position="absolute"
            top="100%"
            bottom="-50%"
          />
        )}
      </VStack>
      <VStack ml={4} flex={1} pt={description ? 0 : "2px"}>
        <HStack>
          <FrontEndTypo.H3 color={isDone ? "eg-blue.600" : "gray.300"}>
            {title}
          </FrontEndTypo.H3>
        </HStack>
        {description && <FrontEndTypo.H3>{description}</FrontEndTypo.H3>}
      </VStack>
    </HStack>
  );
};

const App = ({ data, _vstack }) => {
  return (
    <VStack space={6} {..._vstack}>
      {data?.map((event, index) => (
        <TimeLineBtn
          space={_vstack?.space || 6}
          key={index}
          index={index}
          {...event}
          isLast={index === 2}
        />
      ))}
    </VStack>
  );
};

function TimeLineBtn(props) {
  if (props?.onPress) {
    return (
      <Pressable onPress={props?.onPress}>
        <TimelineItem {...props} />
      </Pressable>
    );
  } else {
    return <TimelineItem {...props} />;
  }
}

export default App;
