import { AdminTypo, IconByName, t } from "@shiksha/common-lib";
import { Stack, HStack, VStack } from "native-base";
import React, { useState } from "react";
import Shortlisted from "./Shortlisted";

export default function Interviewschedule() {
  const [status, setStatus] = React.useState(false);
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
        <VStack width="100%" p="5">
          <HStack alignItems="center" justifyContent="space-between">
            <VStack justifyContent="center">
              <AdminTypo.H5 bold color="textGreyColor.800">
                {t("SCHEDULE_AN_INTERVIEW")}
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
            </VStack>
            <AdminTypo.Secondarybutton
              background="blueText.50"
              _text={{ fontSize: "14px" }}
              leftIcon={<IconByName name="EditBoxLineIcon" size="16px" />}
              onPress={() => setStatus(true)}
            >
              {t("EDIT_DETAILS")}
            </AdminTypo.Secondarybutton>
          </HStack>
        </VStack>
      )}
    </Stack>
  );
}
