import React from "react";
import {
  capture,
  IconByName,
  AdminLayout as Layout,
  BoxBlue,
  H1,
  t,
  filtersByObject,
  facilitatorRegistryService,
  eventService,
  AdminTypo,
} from "@shiksha/common-lib";

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
  Select,
  RadioBtn,
  CustomR,
  AddButton,
} from "../../component/BaseInput";
import {
  Button,
  HStack,
  VStack,
  Box,
  Modal,
  Input,
  FormControl,
  CheckIcon,
  CheckCircleIcon,
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
  const formRef = React.useRef();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [eventList, setEventList] = React.useState();
  const [list, setList] = React.useState({});
  const SelectButton = () => (
    <VStack>
      <Button onPress={(e) => onShowScreen(true)}>
        <Text>select preraks</Text>
      </Button>
      <Text>
        {userIds !== undefined
          ? Object.values(userIds)
              ?.map((e) => e.first_name)
              ?.join(", ")
          : ""}
      </Text>
    </VStack>
  );
  React.useEffect(() => {
    getEventList();
  }, []);

  React.useEffect(() => {
    setFormData({
      ...formData,
      user_id:
        userIds !== undefined ? Object.values(userIds).map((e) => e?.id) : "",
    });
  }, [userIds]);

  const getEventList = async () => {
    const eventResult = await eventService.getEventList();
    setEventList(eventResult);
  };

  const uiSchema = {
    user_id: {
      "ui:widget": SelectButton,
    },
    date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
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

  const handleEventClick = (info) => {
    console.log("Event clicked:", info?.event?.extendedProps);
    setFormData(info?.event?.extendedProps);
    setModalVisible(true);
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (orientationPopupSchema?.properties?.context) {
      newFormData = {
        ...newFormData,
        ["context"]: newFormData?.context.replaceAll(" ", ""),
      };
    }

    if (
      orientationPopupSchema?.properties?.start_date &&
      newFormData?.start_date
    ) {
      newFormData = {
        ...newFormData,
        ["start_date"]: newFormData?.start_date.replaceAll(" ", ""),
      };
    }
    getFormData(newFormData);
    setFormData(newFormData);
    const apiResponse = await eventService.createNewEvent(newFormData);
    if (apiResponse?.success === true) {
      setFormData("");
      getFormData("");
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
          <BoxBlue
            justifyContent="center"
            shadow="BlueBoxShadow"
            borderColor="PrimaryIpcolor.400"
            borderWidth="1px"
          >
            <VStack alignItems={"Center"}>
              <Pressable onPress={(e) => onShowScreen(true)}>
                <Image
                  source={{
                    uri: "/orientation.svg",
                  }}
                  alt=" Orientation"
                  size={"sm"}
                  resizeMode="contain"
                />
                <AdminTypo.H6 bold pt="4">
                  {t("ORIENTATION")}
                </AdminTypo.H6>
              </Pressable>
            </VStack>
          </BoxBlue>
          <BoxBlue
            justifyContent="center"
            shadow="BlueBoxShadow"
            borderColor="PrimaryIpcolor.400"
            borderWidth="1px"
          >
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/training.svg",
                }}
                alt=" Training"
                size={"sm"}
                resizeMode="contain"
              />
              <AdminTypo.H6 bold pt="4">
                {t("TRAINING")}
              </AdminTypo.H6>
            </VStack>
          </BoxBlue>
          <BoxBlue
            justifyContent="center"
            shadow="BlueBoxShadow"
            borderColor="PrimaryIpcolor.400"
            borderWidth="1px"
          >
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/masterTrainer.svg",
                }}
                alt="Master Training"
                size={"sm"}
                resizeMode="contain"
              />
              <AdminTypo.H6 bold pt="4">
                {t("MASTER_TRAINER")}
              </AdminTypo.H6>
            </VStack>
          </BoxBlue>
          <BoxBlue
            justifyContent="center"
            shadow="BlueBoxShadow"
            borderColor="PrimaryIpcolor.400"
            borderWidth="1px"
          >
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
          </BoxBlue>{" "}
          */}
        </HStack>
        <AdminTypo.H3 bold py="3">
          {t("YOUR_CALENDAR")}
        </AdminTypo.H3>
      </VStack>
      <HStack space="2xl" justifyContent="space-between" px="3">
        <Box>
          <VStack space="xl">
            <Button
              variant={"blueOutlineBtn"}
              shadow="BlueOutlineShadow"
              onPress={() => {
                onClick(true);
              }}
            >
              <Text color="blueText.400" bold fontSize="lg">
                Schedule an event +
              </Text>
            </Button>

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
            //   { title: "Event 1", date: "2023-05-30" },
            //   { title: "Event 2", start: "2023-05-31", end: "2023-06-02" },
            // ]}
            events={eventList?.events?.map((item) => {
              return {
                title: item?.context !== null ? item?.context : "orientation",
                start: moment(item?.start_date).format("YYYY-MM-DD")
                  ? moment(item?.start_date).format("YYYY-MM-DD")
                  : "",
                end: moment(item?.end_date).format("YYYY-MM-DD")
                  ? moment(item?.end_date).format("YYYY-MM-DD")
                  : "",

                type: item?.context ? item?.context : "",
                start_date:
                  item?.start_date !== "Invalid date"
                    ? moment(item?.start_date).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                end_date:
                  item?.end_date !== "Invalid date"
                    ? moment(item?.end_date).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                mastertrainer: item?.mastertrainer ? item?.mastertrainer : "",
                user_id: Object.values(userIds).map((e) => e?.id),
                start_time: item?.start_time ? item?.start_time : "",
                end_time: item?.end_time ? item?.end_time : "",
                reminder: item?.reminder ? item?.reminder : "",
                location: item?.location ? item?.location : "",
                location_type: item?.location_type ? item?.location_type : "",
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

          {/* <Modal.Header textAlign={"Center"}>
            Schedule an Interview
          </Modal.Header>
          <Modal.Body p="5" pb="10" mx={5} overflowX="hidden">
            <FormControl>
              <VStack space="2xl">
                <HStack align-items="center" space="2xl">
                  <HStack flex="0.3" alignItems="Center">
                    <IconByName name="VidiconLineIcon" />
                    <FormControl.Label>Event Type</FormControl.Label>
                  </HStack>
                  <Box flex="0.7">
                    <FormControl maxW="300" isRequired isInvalid>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Choose Event"
                        placeholder="Choose Event"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                      >
                        <Select.Item label="Prerak Orientation" value="PO" />
                        <Select.Item label="Prerak Training" value="PT" />
                      </Select>
                    </FormControl>
                  </Box>
                </HStack>
                <VStack>
                  <HStack alignItems={"center"} space={"2xl"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="UserFollowLineIcon" />
                      <FormControl.Label>Master Trainer</FormControl.Label>
                    </HStack>
                    <Box flex="0.7">
                      <Chip textAlign="Center"> Prakash Wagh</Chip>
                    </Box>
                  </HStack>
                  <HStack alignItems={"center"} space={"2xl"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="UserAddLineIcon" />
                      <FormControl.Label>Candidates</FormControl.Label>
                    </HStack>
                    <Button bgColor="white" borderColor="black" flex="0.7">
                      <Text>Select Candidates</Text>
                    </Button>
                  </HStack>
                  <HStack alignItems={"center"} space={"2xl"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="CalendarLineIcon" />
                      <FormControl.Label>Date</FormControl.Label>
                    </HStack>
                    <Box flex="0.7">
                      <Input></Input>
                    </Box>
                  </HStack>
                  <HStack alignItems={"center"} space={"2xl"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="TimeLineIcon" />
                      <FormControl.Label>Time</FormControl.Label>
                    </HStack>
                    <Box flex="0.7">
                      <Input />
                    </Box>
                  </HStack>
                  <HStack alignItems={"center"} space={"2xl"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="Notification2LineIcon" />
                      <FormControl.Label>Reminder</FormControl.Label>
                    </HStack>
                    <Box flex="0.7">
                      <Input />
                    </Box>
                  </HStack>
                  <HStack alignItems={"center"} space={"2xl"} flex={"1"}>
                    <HStack flex="0.3" alignItems="Center">
                      <IconByName name="MapPinLineIcon" />
                      <FormControl.Label>Location</FormControl.Label>
                    </HStack>
                    <Box flex="0.7">
                      <Input />
                    </Box>
                  </HStack>
                </VStack>
              </VStack>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Send Invites
              </Button>
            </Button.Group>
          </Modal.Footer> */}
          <Modal.Body p="3" pb="10" bg="white">
            <Form
              ref={formRef}
              widgets={{ RadioBtn, CustomR, Select }}
              templates={{
                ButtonTemplates: { AddButton },
                FieldTemplate,
                ObjectFieldTemplate,
                TitleFieldTemplate,
                DescriptionFieldTemplate,
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
            />
            <Modal.Footer justifyContent={"space-between"}>
              <Button.Group space={2}>
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
                    setModalVisible(false);
                    formRef?.current?.submit();
                  }}
                  shadow="BlueFillShadow"
                >
                  {t("SEND_INVITES")}
                </AdminTypo.PrimaryButton>
              </Button.Group>
            </Modal.Footer>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
