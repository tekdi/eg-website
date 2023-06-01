import React from "react";
import { Box, Text, Stack, HStack, Radio, VStack } from "native-base";
import { AdminTypo, FloatingInput, IconByName, t } from "@shiksha/common-lib";

function Shortlisted({ status, setStatus, update, data }) {
  console.log(data);
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      background="#CAE9FF"
      rounded="lg"
    >
      <VStack marginLeft="24px" flexDirection="column" alignItems="flex-start">
        <AdminTypo.H2 fontSize="26px" marginTop="3%">
          {t("INTERVIEW_CONDUCTED")}
        </AdminTypo.H2>
        <HStack>
          <IconByName
            color="interviewIconColor"
            name="TimeLineIcon"
          ></IconByName>
          <AdminTypo.H5 bold color="interviewIconColor" marginTop="3%">
            16th May , 11:00 {t("TO")} 12:00
          </AdminTypo.H5>
          <IconByName
            color="interviewIconColor"
            name="MapPinLineIcon"
          ></IconByName>
          <AdminTypo.H5 bold color="interviewIconColor" marginTop="3%">
            {t("ON_PHONE")}
          </AdminTypo.H5>
        </HStack>
        <Box paddingTop="14px" gap="10px">
          <AdminTypo.H5 bold>
            1.{t("DID_THE_INTERVIEW_TAKE_SUCCESSFULLY")}?*
          </AdminTypo.H5>
          <Radio.Group>
            <HStack space={"128px"}>
              <Radio value="1" size="sm">
                {t("YES")}
              </Radio>
              <Radio value="2" size="sm">
                {t("NO")}
              </Radio>
            </HStack>
          </Radio.Group>
          <Box width={"450px"} paddingTop="20px" gap={"5"}>
            <FloatingInput
              schema={{ title: t("NAME_OF_THE_PERSON_WHO_TOOK_THE_INTERVIEW") }}
            />
            <FloatingInput schema={{ title: t("REMARKS") }} />
          </Box>
        </Box>
        <HStack
          height="49px"
          margin={"5"}
          marginTop={"3"}
          marginLeft={"0px"}
          space={6}
        >
          <AdminTypo.StatusButton
            status={"success"}
            onPress={(e) => setStatus(false)}
            rounded="full"
            bg={"success.500"}
          >
            {t("SHORTLISTED")}
          </AdminTypo.StatusButton>
          <AdminTypo.StatusButton
            status="warning"
            _text={{ color: "black" }}
            onPress={(e) => update("rejected")}
          >
            {t("REJECTED")}
          </AdminTypo.StatusButton>
          <AdminTypo.StatusButton status="danger">
            {t("MARK_FOR_REVIEW")}
          </AdminTypo.StatusButton>
        </HStack>
      </VStack>
    </Stack>
  );
}
export default Shortlisted;
