import React from "react";
import {
  Box,
  Text,
  Stack,
  HStack,
  Radio,
  TextArea,
  Button,
  VStack,
} from "native-base";
import { H1, H2, H3, H4, IconByName, t, update } from "@shiksha/common-lib";
function Shortlisted({ status, setStatus, update, data }) {
  console.log(data);
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      width="Fill(1072px)"
      background="#CAE9FF"
      border="1px solid #AFB1B6"
    >
      <VStack marginLeft="24px" flexDirection="column" alignItems="flex-start">
        <H2 marginTop="3%">{t("INTERVIEW_CONDUCTED")}</H2>
        <HStack>
          <IconByName name="TimeLineIcon"></IconByName>
          <Text marginTop="3%">16th May , 11:00 {t("TO")} 12:00</Text>
          <IconByName name="MapPinLineIcon"></IconByName>
          <Text marginTop="3%">{t("ON_PHONE")}</Text>
        </HStack>
        <Box gap="5px">
          <H4>1.{t("DID_THE_INTERVIEW_TAKE_SUCCESSFULLY")}?*</H4>
          <Radio.Group>
            <Stack
              direction={{
                md: "row",
              }}
              space={6}
            >
              <Radio value="1" size="sm">
                {t("YES")}
              </Radio>
              <Radio value="2" size="sm">
                {t("NO")}
              </Radio>
            </Stack>
          </Radio.Group>
          <H4>2.{t("NAME_OF_THE_PERSON_WHO_TOOK_THE_INTERVIEW")}* -</H4>
          <TextArea
            h={"10"}
            // background={"#FFFFFF"}
            placeholder="Add Answer"
          ></TextArea>
          <H4>3.{t("REMARKS")}*</H4>
          <TextArea
            marginBottom={"5"}
            h={"10"}
            placeholder="Add Answer"
            // background={"#FFFFFF"}
          ></TextArea>
        </Box>
        <HStack margin={"5"} marginTop={"3"} marginLeft={"0px"} space={6}>
          <Button
            onPress={(e) => setStatus(false)}
            borderRadius="100px"
            bg={"success.500"}
          >
            {t("SHORTLISTED")}
          </Button>
          <Button
            borderRadius="100px"
            bg={"#FBBF24"}
            onPress={(e) => update("rejected")}
          >
            {t("REJECTED")}
          </Button>
          <Button borderRadius="100px" bg={"#DC2626"}>
            {t("MARK_FOR_REVIEW")}
          </Button>
        </HStack>
      </VStack>
    </Stack>
  );
}
export default Shortlisted;
