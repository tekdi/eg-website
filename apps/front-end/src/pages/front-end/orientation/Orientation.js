import React, { useRef, useState, Suspense } from "react";
import {
  IconByName,
  AdminLayout as Layout,
  BoxBlue,
  AdminTypo,
  eventService,
  Loading,
  enumRegistryService,
  getOptions,
  EVENTS_COLORS,
  cohortService,
  setSelectedAcademicYear,
  getSelectedAcademicYear,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar as Cal } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Form from "@rjsf/core";
import orientationPopupSchema from "./orientationPopupSchema";
import validator from "@rjsf/validator-ajv8";

import {
  HFieldTemplate,
  templates,
  widgets,
} from "../../../component/BaseInput";

import {
  HStack,
  VStack,
  Box,
  Modal,
  CheckCircleIcon,
  Image,
  Pressable,
  Text,
} from "native-base";
import moment from "moment";
import OrientationScreen from "./OrientationScreen";

export default function Orientation({ footerLinks }) {
  const { t } = useTranslation();
  const formRef = React.useRef();
  const calendarRef = useRef(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [schema, setSchema] = React.useState({});
  const [eventList, setEventList] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [reminders, setReminders] = useState();
  const navigator = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [userIds, setUserIds] = React.useState({});
  const nowDate = new Date();
  const [goToDate, setGoToDate] = React.useState(moment().toDate());
  const [OacademicYear, setOacademicYear] = React.useState();

  const getAcademic = React.useCallback(async () => {
    const data = await cohortService.getAcademicYear();
    const result = await getSelectedAcademicYear();
    if (!result) {
      await setSelectedAcademicYear(data?.data?.[0]);
    }
    setOacademicYear(result || data?.data?.[0]);
  }, []);

  React.useEffect(() => {
    getEventLists();
    getAcademic();
  }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setReminders(result);
    let newSchema = orientationPopupSchema;
    newSchema = getOptions(newSchema, {
      key: "reminders",
      arr: result?.data?.REMINDERS.map((e) => ({ ...e, title: t(e.title) })),
      title: "title",
      value: "value",
    });
    newSchema = getOptions(newSchema, {
      key: "type",
      arr: result?.data?.FACILITATOR_EVENT_TYPE.map((e) => ({
        ...e,
        title: t(e.title),
      })),
      title: "title",
      value: "value",
    });
    setSchema(newSchema);
  }, []);

  React.useEffect(() => {
    setFormData({
      ...formData,
      attendees:
        userIds !== undefined ? Object.values(userIds).map((e) => e?.id) : "",
    });
  }, [userIds]);

  const getEventLists = async () => {
    const eventResult = await eventService.getEventList();
    setEventList(eventResult);
  };

  const SelectButton = ({ required }) => {
    const { t } = useTranslation();

    return (
      <HStack space={"4"} direction={["column", "row"]}>
        <HStack flex={["1", "1", "1"]} alignItems="center" space={"2"}>
          <IconByName
            name="UserLineIcon"
            color="textGreyColor.200"
            isDisabled
            _icon={{ size: "14px" }}
          />
          <AdminTypo.H6 color="textGreyColor.100">
            {t("SELECT_CANDIDATE")}
          </AdminTypo.H6>

          <AdminTypo.H6 color="textGreyColor.100">
            {required ? "*" : null}
          </AdminTypo.H6>
        </HStack>
        <HStack alignItems="left" flex={["1", "1", "4"]}>
          <AdminTypo.Secondarybutton
            leftIcon={
              <Text maxWidth="10px" alignItems="left">
                {userIds ? Object.values(userIds).length : ""}
              </Text>
            }
            onPress={() => setIsOpen(true)}
            height="50px"
            maxWidth="200px"
            flex={1}
          >
            {t("SELECT_PRERAK")}
          </AdminTypo.Secondarybutton>
        </HStack>
      </HStack>
    );
  };

  const uiSchema = {
    attendees: {
      "ui:widget": SelectButton,
    },
    start_date: {
      "ui:widget": "alt-datetime",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, 2030],
      },
    },
    end_date: {
      "ui:widget": "alt-datetime",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, 2030],
      },
    },
    reminders: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true,
      },
    },
    start_time: {
      "ui:widget": "hidden",
    },
    end_time: {
      "ui:widget": "hidden",
    },
  };
  const styles = {
    modalxxl: {
      maxWidth: "950px",
      width: "100%",
      height: "100%",
    },
  };
  const onChange = async (data, id) => {
    setErrors({});
    // formRef?.current?.validateForm();
    const newData = data.formData;
    setFormData({ ...formData, ...newData });
    if (newData?.end_date) {
      if (
        moment.utc(newData?.start_date).isAfter(moment.utc(newData?.end_date))
      ) {
        const newErrors = {
          end_date: {
            __errors: [t("EVENT_CREATE_END_DATE_GREATERE_THAN_START_DATE")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (moment.utc(newData?.start_date) < moment.utc(nowDate)) {
      const newErrors = {
        start_date: {
          __errors: [t("EVENT_CREATE_BACK_DATES_NOT_ALLOWED_START_DATE")],
        },
      };
      setErrors(newErrors);
    }

    if (moment.utc(newData?.end_date) < moment.utc(nowDate)) {
      const newErrors = {
        end_date: {
          __errors: [t("EVENT_CREATE_BACK_DATES_NOT_ALLOWED_END_DATE")],
        },
      };
      setErrors(newErrors);
    }
  };
  const handleEventClick = async (info) => {
    navigator(`/attendence/${info?.event?.extendedProps?.event_id}`);
  };

  const clearForm = () => {
    setUserIds({});
    setFormData();
  };

  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      } else if (error.name === "format") {
        const { format } = error?.params ? error?.params : {};
        let message = "REQUIRED_MESSAGE";
        if (format === "email") {
          message = "PLEASE_ENTER_VALID_EMAIL";
        }
        if (format === "string") {
          message = "PLEASE_ENTER_VALID_STREING";
        } else if (format === "number") {
          message = "PLEASE_ENTER_VALID_NUMBER";
        }

        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t(message)} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t(message)}`;
        }
      }
      return error;
    });
  };

  const onSubmit = async (data) => {
    let newFormData = data?.formData;
    if (orientationPopupSchema?.properties?.type) {
      newFormData = {
        ...newFormData,
        ["type"]: newFormData?.type,
      };
    }

    if (orientationPopupSchema?.properties?.start_time) {
      newFormData = {
        ...newFormData,
        ["start_time"]: moment
          .utc(newFormData?.start_date)
          .format("hh:mm:ss")
          .toString(),
      };
    }

    if (orientationPopupSchema?.properties?.end_time) {
      newFormData = {
        ...newFormData,
        ["end_time"]: moment
          .utc(newFormData?.end_date)
          .format("hh:mm:ss")
          .toString(),
      };
    }

    if (Object.keys(errors).length === 0) {
      if (newFormData?.attendees?.length === 0) {
        const newErrors = {
          attendees: {
            __errors: [t("SELECT_CANDIDATES")],
          },
        };
        setErrors(newErrors);
      } else {
        setFormData(newFormData);
        const apiResponse = await eventService.createNewEvent(newFormData);
        if (apiResponse?.success === true) {
          setModalVisible(false);
          setFormData({});
          setLoading(true);
          clearForm();
          const getCalanderData = await eventService.getEventList();
          setEventList(getCalanderData);
          if (getCalanderData) {
            setLoading(false);
          }
        } else {
          setFormData({});
        }
      }
    } else {
      alert(t("EVENT_CREATE_CORRECT_DATA_MESSAGE"));
    }
  };

  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
        OacademicYear: OacademicYear,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
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
                  setModalVisible(!modalVisible);
                  setFormData({ type: "prerak_orientation" });
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
                  setModalVisible(!modalVisible);
                }}
              >
                {t("SCHEDULE_EVENT")}
              </AdminTypo.Secondarybutton>
              <Cal
                onChange={(e) => setGoToDate(moment(e).add(1, "days").toDate())}
              />
              <VStack space="4">
                {reminders?.data?.FACILITATOR_EVENT_TYPE.map((e, key) => (
                  <HStack alignItems="Center" space="md" key={key}>
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
                height={1350}
                width="100%"
                ref={calendarRef}
                key={eventList + goToDate}
                initialDate={goToDate}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                timeZone="Asia/Kolkata"
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "timeGridDay,timeGridWeek,dayGridMonth",
                }}
                initialView="timeGridDay"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                events={eventList?.events?.map((item) => {
                  return {
                    allDay: false,
                    title:
                      item?.name !== null
                        ? `${item?.name + " " + item?.master_trainer}`
                        : item?.type,
                    start: moment(item?.start_date).format("YYYY-MM-DD")
                      ? `${moment(item?.start_date).format("YYYY-MM-DD")} ${
                          item?.start_time
                        }`
                      : "",
                    end: moment(item?.end_date).format("YYYY-MM-DD")
                      ? `${moment(item?.end_date).format("YYYY-MM-DD")} ${
                          item?.end_time
                        }`
                      : "",
                    type: item?.type ? item?.type : "",
                    name: item?.name ? item?.name : "",
                    start_date:
                      item?.start_date !== "Invalid date"
                        ? moment(item?.start_date).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    end_date:
                      item?.end_date !== "Invalid date"
                        ? moment(item?.end_date).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    master_trainer: item?.master_trainer
                      ? item?.master_trainer
                      : "",
                    attendances: item?.attendances ? item?.attendances : "",
                    start_time: item?.start_time ? item?.start_time : "",
                    end_time: item?.end_time ? item?.end_time : "",
                    reminders: item?.reminders ? item?.reminders : "",
                    location: item?.location ? item?.location : "",
                    location_type: item?.location_type
                      ? item?.location_type
                      : "",
                    event_id: item?.id ? item?.id : "",
                    borderColor: EVENTS_COLORS?.[item?.type]
                      ? EVENTS_COLORS[item?.type]
                      : "#808080",
                    backgroundColor: EVENTS_COLORS?.[item?.type]
                      ? EVENTS_COLORS[item?.type]
                      : "#808080",
                  };
                })}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
                eventClick={handleEventClick}
              />
            </VStack>
          </HStack>
          <Modal
            isOpen={modalVisible}
            onClose={() => {
              setModalVisible(false), clearForm();
            }}
            avoidKeyboard
          >
            <Modal.Content {...styles.modalxxl}>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0" bg="white">
                <AdminTypo.H3 textAlign="center" color="textMaroonColor.500">
                  {t("SCHEDULE_EVENT")}
                </AdminTypo.H3>
              </Modal.Header>

              <Modal.Body pt="4" pb="10" bg="white">
                <Suspense fallback={<div>Loading... </div>}>
                  <Form
                    ref={formRef}
                    templates={{
                      ...templates,
                      FieldTemplate: HFieldTemplate,
                    }}
                    extraErrors={errors}
                    showErrorList={false}
                    noHtml5Validate={true}
                    // liveValidate
                    {...{
                      widgets,
                      validator,
                      schema: schema ? schema : {},
                      formData,
                      uiSchema,
                      onChange,
                      onSubmit,
                      transformErrors,
                    }}
                  >
                    <button style={{ display: "none" }} />
                  </Form>
                </Suspense>
              </Modal.Body>
              <Modal.Footer justifyContent={"space-between"}>
                <AdminTypo.Secondarybutton
                  onPress={() => {
                    setModalVisible(false);
                    clearForm();
                  }}
                  shadow="BlueOutlineShadow"
                >
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    formRef?.current?.submit();
                  }}
                  shadow="BlueFillShadow"
                >
                  {t("SEND_INVITES")}
                </AdminTypo.PrimaryButton>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <OrientationScreen {...{ isOpen, setIsOpen, userIds, setUserIds }} />
        </Box>
      )}
    </Layout>
  );
}
