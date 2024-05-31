import {
  FrontEndTypo,
  Layout,
  t,
  CardComponent,
  campService,
} from "@shiksha/common-lib";
import React, { useEffect, useState } from "react";
import { VStack, HStack, Pressable, Stack, Alert } from "native-base";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

export default function CampSetting({ footerLinks }) {
  const weeks = [
    "WEEK_SUNDAY",
    "WEEK_MONDAY",
    "WEEK_TUESDAY",
    "WEEK_WEDNESDAY",
    "WEEK_THURSDAY",
    "WEEK_FRIDAY",
    "WEEK_SATURDAY",
  ];
  const camp_id = useParams();
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState();
  const [selectedEndTime, setSelectedEndTime] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [error, setError] = useState();
  const [selectedCampType, setSelectedCampType] = useState();

  const navigate = useNavigate();

  const handleDayClick = (day) => {
    if (Array.isArray(selectedDays) && selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([day]);
    }
  };

  useEffect(async () => {
    const data = await campService.getCampDetails(camp_id);
    const camp = data?.data;
    setSelectedCampType(camp?.type);
    setSelectedStartTime(camp?.preferred_start_time);
    setSelectedEndTime(camp?.preferred_end_time);
    setSelectedDays(camp?.week_off);
  }, []);

  const handleSubmit = async () => {
    setIsDisable(true);
    const START_TIME = new Date(selectedStartTime);
    const END_TIME = new Date(selectedEndTime);
    const obj = {
      id: JSON.parse(camp_id?.id),
      edit_page_type: "edit_camp_settings",
      preferred_start_time: `${START_TIME}`,
      preferred_end_time: `${END_TIME}`,
      week_off: selectedDays,
    };
    if (!selectedStartTime || !selectedEndTime) {
      setError("REQUIRED_MESSAGE");
      setIsDisable(false);
    } else if (START_TIME >= END_TIME) {
      setError("END_TIME_SHOULD_BE_GREATER_THAN_START_TIME");
      setIsDisable(false);
    } else {
      await campService.updateCampDetails(obj);
      navigate("/camps");
    }
  };

  return (
    <Layout
      _appBar={{ name: t("Settings") }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_SETTINGS"}
      pageTitle={t("CAMP")}
      stepTitle={`${selectedCampType === "main" ? "Main" : "Pcr"}/${t(
        "SETTINGS"
      )}`}
    >
      <VStack space={4} p={4}>
        <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
          <VStack alignItems="center" space={3}>
            <FrontEndTypo.H2>{t("PREFERRED_TIME")}</FrontEndTypo.H2>
            <FrontEndTypo.H3>
              {t("PLEASE_INDICATE_SUITABLE_TIME_CAMPING")}
            </FrontEndTypo.H3>
          </VStack>
          <Alert status="warning" alignItems={"start"} mt="2">
            <HStack alignItems="center" space="2">
              <Alert.Icon />
              <FrontEndTypo.H3>{t("CAMP_SETTINGS_ALERT")}</FrontEndTypo.H3>
            </HStack>
          </Alert>
          <HStack
            marginTop={10}
            alignItems="center"
            justifyContent={"center"}
            space={4}
          >
            <FrontEndTypo.H4>{t("START_TIME")}:</FrontEndTypo.H4>
            <TimePicker
              placeholder={t("SELECT_TIME")}
              use12Hours
              value={selectedStartTime ? moment(selectedStartTime) : ""}
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm A"
              onChange={(e) => setSelectedStartTime(e?._d)}
            />
            <FrontEndTypo.H4>{t("END_TIME")}:</FrontEndTypo.H4>

            <TimePicker
              placeholder={t("SELECT_TIME")}
              use12Hours
              value={selectedEndTime ? moment(selectedEndTime) : ""}
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
                borderWidth="2"
                onPress={() => handleDayClick(day)}
                _pressed={{
                  bg: "textMaroonColor.500",
                  borderWidth: 2,
                  borderColor: "textMaroonColor.500",
                }}
                bg={
                  selectedDays?.includes(day) ? "textMaroonColor.500" : "white"
                }
                borderColor={
                  selectedDays?.includes(day)
                    ? "textMaroonColor.500"
                    : "textGreyColor.50"
                }
                color={selectedDays?.includes(day) ? "white" : "black"}
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {t(day)}
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

CampSetting.propTypes = {
  footerLinks: PropTypes.any,
};
