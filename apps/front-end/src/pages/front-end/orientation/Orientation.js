import React from "react";
import {
  capture,
  IconByName,
  AdminLayout as Layout,
  BoxBlue,
  H1,
  t,
  AdminTypo,
  filtersByObject,
  facilitatorRegistryService,
  eventService,
  Loading,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
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
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  select,
  RadioBtn,
  CustomR,
  AddButton,
  BaseInputTemplate,
} from "../../../component/BaseInput";
import {
  Button,
  HStack,
  Input,
  FormControl,
  CheckIcon,
  VStack,
  Box,
  Modal,
  Text,
  CheckCircleIcon,
  TextArea,
  Image,
  Pressable,
} from "native-base";
import moment from "moment";

export default function Orientation({
  footerLinks,
  getFormData,
  userIds,
  onShowScreen,
  setIsOpen,
  onClick,
}) {
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const formRef = React.useRef();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [eventList, setEventList] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const navigator = useNavigate();

  const SelectButton = () => (
    <VStack>
      <Button onPress={() => onShowScreen(true)}>
        <Text>Select preraks</Text>
      </Button>
      <Box alignItems="center" alignContent="center">
        <AdminTypo.H3 color="textGreyColor.800" bold>
          {userIds !== undefined ? Object.values(userIds).length : ""}
        </AdminTypo.H3>
      </Box>
    </VStack>
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
    getEventList();
  }, []);

  React.useEffect(() => {
    setFormData({
      ...formData,
      attendees:
        userIds !== undefined ? Object.values(userIds).map((e) => e?.id) : "",
    });
  }, [userIds]);

  const getEventList = async () => {
    const eventResult = await eventService.getEventList();
    setEventList(eventResult);
  };

  const uiSchema = {
    attendees: {
      "ui:widget": SelectButton,
    },
    start_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    end_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    reminders: {
      "ui:widget": "checkboxes",
    },
    start_time: {
      "ui:widget": TimePickerComponent,
    },
    end_time: {
      "ui:widget": TimePickerComponent,
    },
  };
  const styles = {
    modalxxl: {
      maxWidth: "950px",
      width: "100%",
      height: "100%",
    },
  };
  const onChange = async (data) => {
    const newData = data.formData;
    setFormData({ ...formData, ...newData });
  };

  const handleEventClick = async (info) => {
    console.log("Event clicked:", info?.event?.extendedProps);
    navigator(`/attendence/${info?.event?.extendedProps?.event_id}`);
  };

  const onSubmit = async (data) => {
    let newFormData = data?.formData;
    if (orientationPopupSchema?.properties?.type) {
      newFormData = {
        ...newFormData,
        ["type"]: newFormData?.type,
      };
    }

    if (orientationPopupSchema?.properties?.name) {
      newFormData = {
        ...newFormData,
        ["name"]:
          newFormData?.type +
          " " +
          moment(newFormData?.start_date).format("DD-MM-YYYY"),
      };
    }
    getFormData(newFormData);
    setFormData(newFormData);
    const apiResponse = await eventService.createNewEvent(newFormData);
    if (apiResponse?.success === true) {
      setModalVisible(false);
      setFormData("");
      getFormData("");
      setLoading(true);
      const getCalanderData = await eventService.getEventList();
      if (getCalanderData) {
        setLoading(false);
      }
    } else {
      setFormData("");
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
      {loading && <Loading />}

      <VStack paddingLeft="5" paddingTop="5" space="xl">
        <Box display="flex" flexDirection="row" minWidth="2xl">
          <HStack alignItems="Center">
            <IconByName name="Home4LineIcon" fontSize="24px" />
            <AdminTypo.H1 color="textGreyColor.800" bold>
              {t("HOME")}
            </AdminTypo.H1>
          </HStack>
        </Box>
        <HStack display="flex" flexDirection="row" space="xl">
          <BoxBlue justifyContent="center">
            <VStack alignItems={"Center"}>
              <Pressable
                onPress={() => {
                  setModalVisible(true);
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
        <AdminTypo.H3 bold py="3">
          {t("YOUR_CALENDAR")}
        </AdminTypo.H3>
      </VStack>

      <HStack space="2xl" justifyContent="space-between" px="3">
        <Box>
          <VStack mb="3" alignContent="center">
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
                <AdminTypo.H6 bold>{t("INTERVIEW")}</AdminTypo.H6>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="green.500" />
                <AdminTypo.H6 bold>{t("ORIENTATION_DAYS")}</AdminTypo.H6>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="yellow.500" />
                <AdminTypo.H6 bold>{t("TRAINING_DAYS")}</AdminTypo.H6>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="purple.500" />
                <AdminTypo.H6 bold>{t("CAMP_VISITS")}</AdminTypo.H6>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <Box width="50%" justifyContent={"Center"} flex={"1"}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            // events={[
            //   {
            //     title: "event 1",
            //     date: moment().format("YYYY-MM-DD HH:mm:ss"),
            //   },
            // ]}
            events={eventList?.events?.map((item) => {
              return {
                allDay: false,
                title: item?.type !== null ? item?.type : item?.name,
                start: moment(item?.start_date).format("YYYY-MM-DD")
                  ? moment(item?.start_date).format("YYYY-MM-DD")
                  : "",
                end: moment(item?.end_date).format("YYYY-MM-DD")
                  ? moment(item?.end_date).format("YYYY-MM-DD")
                  : "",

                type: item?.context ? item?.context : "",
                name: item?.name ? item?.name : "",
                start_date:
                  item?.start_date !== "Invalid date"
                    ? moment(item?.start_date).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                end_date:
                  item?.end_date !== "Invalid date"
                    ? moment(item?.end_date).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                mastertrainer: item?.mastertrainer ? item?.mastertrainer : "",
                attendances: item?.attendances,
                start_time: item?.start_time ? item?.start_time : "",
                end_time: item?.end_time ? item?.end_time : "",
                reminders: item?.reminders ? item?.reminders : "",
                location: item?.location ? item?.location : "",
                location_type: item?.location_type ? item?.location_type : "",
                event_id: item?.id ? item?.id : "",
              };
            })}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            eventClick={handleEventClick}
            headerToolbar={{
              start: "prev,thisweek,next",
              center: "timeGridWeek,dayGridMonth,dayGridYear",
              end: "today",
              height: "50hv",
            }}
          />
        </Box>
      </HStack>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        size="xl"
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

          <Modal.Body p="3" pb="10" bg="white">
            <Form
              ref={formRef}
              widgets={{ RadioBtn, CustomR, select, TimePickerComponent }}
              templates={{
                ButtonTemplates: { AddButton },
                FieldTemplate,
                ObjectFieldTemplate,
                TitleFieldTemplate,
                DescriptionFieldTemplate,
                BaseInputTemplate,
              }}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                validator,
                schema: orientationPopupSchema ? orientationPopupSchema : {},
                formData,
                uiSchema,
                onChange,
                onSubmit,
              }}
            >
              <HStack justifyContent="space-between" space={2} py="5">
                <AdminTypo.Secondarybutton
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  shadow="BlueOutlineShadow"
                >
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    // setModalVisible(false);
                    formRef?.current?.submit();
                  }}
                  shadow="BlueFillShadow"
                >
                  {t("SEND_INVITES")}
                </AdminTypo.PrimaryButton>
              </HStack>
            </Form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
