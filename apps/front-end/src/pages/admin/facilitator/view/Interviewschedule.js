import { AdminTypo, H1, H2, IconByName, t } from "@shiksha/common-lib";
import { Box, Stack, Button, HStack, Text, VStack } from "native-base";
import React, { useState } from "react";
import Shortlisted from "./Shortlisted";

export default function Interviewschedule() {
  const [status, setStatus] = React.useState(false);
  const [data, setData] = React.useState();
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      width="Fill(1072px)"
      background="#CAE9FF"
      border="1px solid #AFB1B6"
      rounded="lg"
    >
      {status ? (
        <Shortlisted setStatus={setStatus} status={status} />
      ) : (
        <Box paddingTop="5">
          <HStack alignItems="center">
            <Box
              paddingLeft="24px"
              flexDirection="column"
              alignItems="flex-start"
              width="713px"
              height="130px"
            >
              <AdminTypo.H2 fontSize="26px">
                {t("SCHEDULE_AN_INTERVIEW")}
              </AdminTypo.H2>
              <HStack paddingTop="15px" ml="-2%">
                <IconByName
                  color="interviewIconColor"
                  name="TimeLineIcon"
                ></IconByName>
                <AdminTypo.H5 bold marginTop="2%">
                  16th May , 11:00 {t("TO")} 12:00
                </AdminTypo.H5>
                <IconByName
                  color="interviewIconColor"
                  name="MapPinLineIcon"
                ></IconByName>
                <AdminTypo.H5 bold marginTop="2%">
                  {t("ON_PHONE")}
                </AdminTypo.H5>
              </HStack>
            </Box>
            <Box paddingBottom="15px">
              <AdminTypo.Secondarybutton
                background="blueText.50"
                _text={{ fontSize: "16px" }}
                leftIcon={<IconByName name="EditBoxLineIcon" size="sm" />}
                onPress={() => setStatus(true)}
              >
                {t("EDIT_DETAILS")}
              </AdminTypo.Secondarybutton>
            </Box>
          </HStack>
        </Box>
      )}
    </Stack>
  );
}
