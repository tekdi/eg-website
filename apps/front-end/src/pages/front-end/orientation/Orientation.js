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
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  ObjectFieldTemplate,
  select,
  RadioBtn,
  CustomR,
  AddButton,
  BaseInputTemplate,
  HFieldTemplate,
} from "../../../component/BaseInput";

import {
  HStack,
  VStack,
  Box,
  Modal,
  CheckCircleIcon,
  Image,
  Pressable,
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

  const SelectButton = () => (
    <HStack space={"10"}>
      <HStack wdith="60%" flex="0.5">
        <IconByName name="UserLineIcon" isDisabled />
        <AdminTypo.H6 color="textGreyColor.100">
          {t("SELECT_CANDIDATE")} *
        </AdminTypo.H6>
      </HStack>
      <HStack alignItems="center" flex="0.4">
        <AdminTypo.Secondarybutton onPress={() => setIsOpen(true)}>
          {t("SELECT_PRERAK")}
        </AdminTypo.Secondarybutton>
        <AdminTypo.H3 color="textGreyColor.800" bold pl="3">
          {userIds !== undefined ? Object.values(userIds).length : ""}
        </AdminTypo.H3>
      </HStack>
    </HStack>
  );

  const TimePickerComponent = ({ value, onChange }) => (
    <VStack>
      <input
        className="form-control"
        type="time"
        style={{ height: 40 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </VStack>
  );

  React.useEffect(() => {
    getEventLists();
  }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
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
  }, [formData]);

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
    setFormData({
      attendees: [],
      type: null,
      name: "",
      master_trainer: "",
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      reminders: [],
      location: "",
      location_type: null,
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
          .format("h:mm A")
          .toString(),
      };
    }

    if (orientationPopupSchema?.properties?.end_time) {
      newFormData = {
        ...newFormData,
        ["end_time"]: moment
          .utc(newFormData?.end_date)
          .format("h:mm A")
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
              <HStack alignItems="Center" py="4">
                <IconByName name="Home4LineIcon" fontSize="24px" />
                <AdminTypo.H1 color="textGreyColor.800" bold>
                  {t("HOME")}
                </AdminTypo.H1>
              </HStack>
            </Box>
            <HStack>
              <BoxBlue justifyContent="center" pl="3">
                <VStack alignItems={"Center"}>
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Image
                      source={{
                        uri: "/orientation.svg",
                      }}
                      alt="Prerak Orientation"
                      size={"sm"}
                      resizeMode="contain"
                    />
                    <AdminTypo.H6 bold pt="4">
                      {t("ORIENTATION")}
                    </AdminTypo.H6>
                  </Pressable>
                </VStack>
              </BoxBlue>
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
            <AdminTypo.H3 bold pt="8" pb="3">
              {t("YOUR_CALENDAR")}
            </AdminTypo.H3>
          </VStack>
          <HStack
            space="2xl"
            justifyContent="space-between"
            px="2"
            pb="10"
            direction={["column", "column", "row"]}
          >
            <VStack alignContent="center">
              <AdminTypo.Secondarybutton
                alignContent="center"
                mb="3"
                shadow="BlueOutlineShadow"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                {t("SCHEDULE_EVENT")}
              </AdminTypo.Secondarybutton>
              <Cal />
              <VStack space="4" mt="4">
                <HStack alignItems="Center" space="md">
                  <CheckCircleIcon size="4" color="blue.500" />
                  <AdminTypo.H6 bold>
                    {t("FACILITATOR_EVENT_TYPE_PRERAK_ORIENTATION")}
                  </AdminTypo.H6>
                </HStack>
                <HStack alignItems="Center" space="md">
                  <CheckCircleIcon size="4" color="green.500" />
                  <AdminTypo.H6 bold>
                    {t("FACILITATOR_EVENT_TYPE_PRERAK_FLN_TRAINING")}
                  </AdminTypo.H6>
                </HStack>
                <HStack alignItems="Center" space="md">
                  <CheckCircleIcon size="4" color="yellow.500" />
                  <AdminTypo.H6 bold>
                    {t("FACILITATOR_EVENT_TYPE_PRERAK_CAMP_EXECUTION_TRAINING")}
                  </AdminTypo.H6>
                </HStack>
                {/* <HStack alignItems="Center" space="md">
                  <CheckCircleIcon size="4" color="purple.500" />
                  <AdminTypo.H6 bold>{t("CAMP_VISITS")}</AdminTypo.H6>
                </HStack> */}
              </VStack>
            </VStack>
            <Box>
              <Fullcalendar
                ref={calendarRef}
                key={eventList}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                timeZone="Asia/Kolkata"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridDay,timeGridWeek,dayGridMonth,dayGridYear",
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
                    backgroundColor:
                      item?.type === "prerak_orientation"
                        ? EVENTS_COLORS.blue
                        : item?.type === "prerak_fln_training"
                        ? EVENTS_COLORS.green
                        : EVENTS_COLORS.yellow,
                  };
                })}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
                eventClick={handleEventClick}
              />
            </Box>
          </HStack>
          <Modal
            isOpen={modalVisible}
            onClose={() => {
              setModalVisible(false), clearForm();
            }}
            avoidKeyboard
            // height={"450px"}
            overflowY={"scroll"}
          >
            <Modal.Content {...styles.modalxxl}>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0" bg="white">
                <AdminTypo.H1 textAlign="center" bold>
                  {t("SCHEDULE_EVENT")}
                </AdminTypo.H1>
              </Modal.Header>

              <Modal.Body p="1" pb="10" bg="white">
                <Suspense fallback={<div>Loading... </div>}>
                  <Form
                    ref={formRef}
                    widgets={{ RadioBtn, CustomR, select, TimePickerComponent }}
                    templates={{
                      ButtonTemplates: { AddButton },
                      FieldTemplate: HFieldTemplate,
                      ObjectFieldTemplate,
                      TitleFieldTemplate,
                      DescriptionFieldTemplate,
                      BaseInputTemplate,
                    }}
                    extraErrors={errors}
                    showErrorList={false}
                    noHtml5Validate={true}
                    // liveValidate
                    {...{
                      validator,
                      schema: schema ? schema : {},
                      formData,
                      uiSchema,
                      onChange,
                      onSubmit,
                    }}
                  >
                    <HStack
                      justifyContent="space-between"
                      space={2}
                      py="5"
                      borderTopWidth="1px"
                      bg="white"
                      borderTopColor="appliedColor"
                    >
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
                    </HStack>
                  </Form>
                </Suspense>
              </Modal.Body>
            </Modal.Content>
          </Modal>
          <OrientationScreen {...{ isOpen, setIsOpen, userIds, setUserIds }} />
        </Box>
      )}
    </Layout>
  );
}
