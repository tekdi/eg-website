import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  AdminTypo,
  BoxBlue,
  EVENTS_COLORS,
  IconByName,
  AdminLayout as Layout,
  Loading,
  cohortService,
  enumRegistryService,
  eventService,
  getSelectedAcademicYear,
  jsonParse,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Calendar as Cal } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import {
  Box,
  CheckCircleIcon,
  CheckIcon,
  HStack,
  Image,
  Modal,
  Pressable,
  Select,
  VStack,
} from "native-base";
// import OrientationScreen from "./orientation/OrientationScreen";

export default function Orientation({ footerLinks }) {
  const { t } = useTranslation();
  const calendarRef = useRef(null);
  const [modal, setModal] = React.useState(true);
  const [eventList, setEventList] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [reminders, setReminders] = useState();
  const navigator = useNavigate();
  const [goToDate, setGoToDate] = React.useState(moment().toDate());
  const [selectedAcademic, setSelectedAcademic] = React.useState();
  const [academicYear, setAcademicYear] = React.useState();
  const [academicData, setAcademicData] = React.useState();
  const [programID, setProgramID] = React.useState();
  const [programData, setProgramData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id && !_.isEmpty(academic_Id)) {
        getEventLists();
        setModal(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setReminders(result);
  }, []);

  const getEventLists = async () => {
    const eventResult = await eventService.getEventList();
    setEventList(eventResult?.events || []);
  };

  const handleEventClick = async (info) => {
    navigator(`/admin/event/${info?.event?.extendedProps?.event_id}`);
  };

  const cohortData = React.useCallback(async () => {
    setLoading(true);
    const data = await cohortService.getAcademicYear();
    const academicYearparseData = data?.data?.[0];
    if (data?.data?.length < 2) {
      setModal(false);
      const programData = await cohortService.getPrograms(
        academicYearparseData?.academic_year_id
      );
      const parseData = programData?.data?.[0];
      setSelectedAcademicYear(academicYearparseData);
      setSelectedProgramId(parseData);
      setSelectedAcademic({ parseData, academicYearparseData });
    }
    setAcademicData(data?.data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    cohortData();
  }, []);

  const handleYearChange = (itemValue) => {
    setAcademicYear(itemValue);
    const parseData = jsonParse(itemValue);
    const fetchData = async () => {
      const data = await cohortService.getPrograms(parseData?.academic_year_id);
      setProgramData(data?.data);
    };
    fetchData();
  };

  const handleContinueBtn = () => {
    const parseData = jsonParse(programID);
    const academicYearparseData = jsonParse(academicYear);
    setSelectedAcademicYear(academicYearparseData);
    setSelectedProgramId(parseData);
    setSelectedAcademic({ parseData, academicYearparseData });
    setModal(false);
    getEventLists();
  };

  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
        selectedAcademic: selectedAcademic,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
      loading={loading}
    >
      {loading ? (
        <Loading />
      ) : (
        <Box>
          <VStack>
            <Box>
              <HStack alignItems="Center" py="4" space="2">
                <IconByName name="Home4LineIcon" size="md" />
                <AdminTypo.H4 bold>{t("HOME")}</AdminTypo.H4>
              </HStack>
            </Box>
            <HStack>
              <Pressable
                onPress={() => {
                  navigator("/admin/event/create");
                }}
              >
                <BoxBlue justifyContent="center" pl="3">
                  <VStack alignItems={"Center"}>
                    <Image
                      source={{
                        uri: "/orientation.png",
                      }}
                      alt="Prerak Orientation"
                      size={"sm"}
                      resizeMode="contain"
                    />
                    <AdminTypo.H6 bold pt="4">
                      {t("ORIENTATION")}
                    </AdminTypo.H6>
                  </VStack>
                </BoxBlue>
              </Pressable>
              {/* <BoxBlue justifyContent="center">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/training.svg",
                }}
                alt="Prerak Training"
                size={"sm"}
                resizeMode="contain"
              />
              <AdminTypo.H6 bold pt="4">
                {t("TRAINING")}
              </AdminTypo.H6>
            </VStack>
          </BoxBlue>
          <BoxBlue justifyContent="center">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/masterTrainer.svg",
                }}
                alt="My MT"
                size={"sm"}
                resizeMode="contain"
              />
              <AdminTypo.H6 bold pt="4">
                {t("MASTER_TRAINER")}
              </AdminTypo.H6>
            </VStack>
          </BoxBlue>
          <BoxBlue justifyContent="center">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/addPrerak.svg",
                }}
                alt="Add a Prerak"
                size={"sm"}
                resizeMode="contain"
              />
              <AdminTypo.H6 bold pt="4">
                {t("ADD_A_PRERAK")}
              </AdminTypo.H6>
            </VStack>
          </BoxBlue> */}
            </HStack>
            <AdminTypo.H4 color="textMaroonColor.500" bold pt="8" pb="3">
              {t("YOUR_CALENDAR")}
            </AdminTypo.H4>
          </VStack>
          <HStack
            px="2"
            pb="10"
            space={"4"}
            direction={["column", "column", "row"]}
            width="100%"
            flex="1"
          >
            <VStack alignContent="center" space="4" flex={["1", "1"]}>
              <AdminTypo.Secondarybutton
                alignContent="center"
                shadow="BlueOutlineShadow"
                onPress={() => {
                  navigator("/admin/event/create");
                }}
              >
                {t("SCHEDULE_EVENT")}
              </AdminTypo.Secondarybutton>
              <Cal
                calendarType="gregory"
                onChange={(e) => setGoToDate(moment(e).add(1, "days").toDate())}
              />
              <VStack space="4">
                {reminders?.data?.FACILITATOR_EVENT_TYPE.map((e, key) => (
                  <HStack alignItems="Center" space="md" key={e?.title}>
                    <CheckCircleIcon
                      size="4"
                      color={
                        EVENTS_COLORS?.[e?.value]
                          ? EVENTS_COLORS[e?.value]
                          : "#808080"
                      }
                    />
                    <AdminTypo.H6 bold>{t(e?.title)}</AdminTypo.H6>
                  </HStack>
                ))}
              </VStack>
            </VStack>
            <VStack flex={["none", "none", "4"]}>
              <Fullcalendar
                height={1300}
                width="100%"
                ref={calendarRef}
                key={eventList + goToDate}
                initialDate={goToDate}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "timeGridDay,timeGridWeek,dayGridMonth",
                }}
                initialView="timeGridWeek"
                editable={false}
                events={eventList
                  ?.map((item) => {
                    const startMoment = moment(item?.start_date);
                    const endMoment = moment(item?.end_date);
                    let datesD = [];
                    while (startMoment.isSameOrBefore(endMoment)) {
                      datesD.push(startMoment.format("YYYY-MM-DD"));
                      startMoment.add(1, "day");
                    }

                    return datesD.map((subItem) => ({
                      allDay: false,
                      title:
                        item?.name !== null
                          ? `#${
                              item?.id +
                              " " +
                              item?.name +
                              " " +
                              item?.master_trainer
                            }`
                          : item?.type,
                      start: `${subItem} ${item?.start_time}`,
                      end: `${subItem} ${item?.end_time}`,
                      type: item?.type ? item?.type : "",
                      name: item?.name ? item?.name : "",
                      event_id: item?.id ? item?.id : "",
                      borderColor: EVENTS_COLORS?.[item?.type]
                        ? EVENTS_COLORS[item?.type]
                        : "#808080",
                      backgroundColor: EVENTS_COLORS?.[item?.type]
                        ? EVENTS_COLORS[item?.type]
                        : "#808080",
                    }));
                  })
                  .flat()}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
                eventClick={handleEventClick}
              />
            </VStack>
          </HStack>
          {/* <OrientationScreen {...{ isOpen, setIsOpen, userIds, setUserIds }} /> */}
        </Box>
      )}

      <Modal isOpen={modal} safeAreaTop={true} size="xl">
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <AdminTypo.H3 textAlign="center" color="black">
              {t("SELECT_YOUR_COHORT")}
            </AdminTypo.H3>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("ACADEMIC_YEAR")}</AdminTypo.H4>

                <Select
                  selectedValue={academicYear}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleYearChange(itemValue)}
                >
                  {academicData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.academic_year_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("STATE")}</AdminTypo.H4>

                <Select
                  selectedValue={programID}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setProgramID(itemValue)}
                >
                  {programData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.state_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              {programID && (
                <VStack alignItems={"center"}>
                  <AdminTypo.Dangerbutton onPress={handleContinueBtn}>
                    {t("CONTINUE")}
                  </AdminTypo.Dangerbutton>
                </VStack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

Orientation.propTypes = {
  footerLinks: PropTypes.any,
};
