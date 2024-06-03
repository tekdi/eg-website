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
      <VStack m="5">
        <AdminTypo.H5 bold color="textGreyColor.800">
          {t("INTERVIEW_CONDUCTED")}
        </AdminTypo.H5>
        <HStack alignItems="center">
          <IconByName color="interviewIconColor" name="TimeLineIcon" />
          <AdminTypo.H6 className="fw-500" color="textGreyColor.800">
            16th May , 11:00 {t("TO")} 12:00
          </AdminTypo.H6>
          <IconByName color="interviewIconColor" name="MapPinLineIcon" />
          <AdminTypo.H6 className="fw-500" color="textGreyColor.800">
            {t("ON_PHONE")}
          </AdminTypo.H6>
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
              required
              schema={{ title: t("NAME_OF_THE_PERSON_WHO_TOOK_THE_INTERVIEW") }}
            />
            <FloatingInput required schema={{ title: t("REMARKS") }} />
          </Box>
        </Box>
        <HStack mt="8" space={6}>
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
