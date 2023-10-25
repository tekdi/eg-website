import { FrontEndTypo, IconByName, Layout, t } from "@shiksha/common-lib";
import React, { useState } from "react";
import { CardComponent } from "@shiksha/common-lib";
import { VStack, HStack, Pressable } from "native-base";
import { TimePick } from "./TimePicker";

export default function CampSetting({ footerLinks }) {
  const [value, onChange] = useState("10:00");
  const [weeks, setWeeks] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [selectedDays, setSelectedDays] = useState([]);

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Layout _appBar={{ name: t("Settings") }} _footer={{ menues: footerLinks }}>
      <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
        <VStack alignItems="center" space={3}>
          <FrontEndTypo.H2>Preferred Time</FrontEndTypo.H2>
          <FrontEndTypo.H3>
            Please indicate a suitable time for camping.
          </FrontEndTypo.H3>
        </VStack>
        <VStack marginTop={10} alignItems="center" space={3}>
          <TimePick />
        </VStack>
        <HStack marginTop={10} justifyContent="center" space={4}>
          {weeks.map((day, index) => (
            <Pressable
              key={index}
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
              }}
            >
              {day}
            </Pressable>
          ))}
        </HStack>
        <HStack marginTop={10} justifyContent="center">
          <FrontEndTypo.H3>List Of Holidays</FrontEndTypo.H3>
        </HStack>
      </CardComponent>
    </Layout>
  );
}
