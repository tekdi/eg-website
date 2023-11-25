import {
  FrontEndTypo,
  Layout,
  t,
  CardComponent,
  campService,
} from "@shiksha/common-lib";
import React from "react";
import { VStack, HStack, Pressable, Stack, Alert } from "native-base";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { useParams } from "react-router-dom";

export default function CampSetting({ footerLinks }) {
  const weeks = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const camp_id = useParams();
  const [selectedDays, setSelectedDays] = React.useState("");
  const [selectedStartTime, setSelectedStartTime] = React.useState("");
  const [selectedEndTime, setSelectedEndTime] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(false);
  const [error, setError] = React.useState();

  const handleDayClick = (day) => {
    if (selectedDays?.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays(day);
    }
  };

  const handleSubmit = async () => {
    setIsDisable(true);
    const START_TIME = new Date(selectedStartTime);
    const END_TIME = new Date(selectedEndTime);
    const obj = {
      id: camp_id?.id,
      edit_page_type: "camp_settings",
      preferred_start_time: `${START_TIME}`,
      preferred_end_time: `${END_TIME}`,
      week_off: selectedDays,
    };
    if (!selectedStartTime || !selectedEndTime) {
      setError("REQUIRED_MESSAGE");
      setIsDisable(false);
    } else if (END_TIME < START_TIME) {
      setError("END_TIME_SHOULD_BE_GREATER_THAN_START_TIME");
      setIsDisable(false);
    } else {
      const data = await campService.updateIpCampDetails(obj);
      setIsDisable(false);
    }
  };

  return (
    <Layout _appBar={{ name: t("Settings") }} _footer={{ menues: footerLinks }}>
      <VStack space={4} p={4}>
        <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
          <VStack alignItems="center" space={3}>
            <FrontEndTypo.H2>{t("PREFERRED_TIME")}</FrontEndTypo.H2>
            <FrontEndTypo.H3>
              {t("PLEASE_INDICATE_SUITABLE_TIME_CAMPING")}
            </FrontEndTypo.H3>
          </VStack>

          <HStack
            marginTop={10}
            alignItems="center"
            justifyContent={"center"}
            space={4}
          >
            <TimePicker
              placeholder="Select Time"
              use12Hours
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm A"
              onChange={(e) => setSelectedStartTime(e?._d)}
            />
            {t("TO")}
            <TimePicker
              placeholder="Select Time"
              use12Hours
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm A"
              onChange={(e) => setSelectedEndTime(e?._d)}
            />
          </HStack>
          {error && (
            <Alert mt={4} status="warning">
              <HStack space={2}>
                <Alert.Icon />
                <FrontEndTypo.H3>{t(error)}</FrontEndTypo.H3>
              </HStack>
            </Alert>
          )}
          <Stack marginTop={10} alignItems="center" space={3}>
            <FrontEndTypo.H2>
              {t("PLEASE_ENTER_THE_DAYS_YOU_WANT_TO_TAKE_THE_WEEKLY_OFF")}
            </FrontEndTypo.H2>
          </Stack>

          <HStack justifyContent="center" space={4} flexWrap={"wrap"}>
            {weeks.map((day, index) => (
              <Pressable
                key={day}
                onPress={() => handleDayClick(day)}
                _pressed={{
                  bg: "green.500",
                  borderWidth: 2,
                  borderColor: "green.500",
                }}
                bg={selectedDays.includes(day) ? "green.500" : "blue.500"}
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {day}
              </Pressable>
            ))}
          </HStack>
        </CardComponent>
        <FrontEndTypo.Primarybutton
          onPress={handleSubmit}
          isDisabled={isDisable}
        >
          {t("SAVE")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}
