import React from "react";
import {
  capture,
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  H1,
  t,
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
} from "../../component/BaseInput";
import {
  Button,
  HStack,
  Text,
  VStack,
  Box,
  Modal,
  Input,
  FormControl,
  Select,
  CheckIcon,
  CheckCircleIcon,
  TextArea,
  Image,
  Pressable,
} from "native-base";
import Chip from "component/Chip";
import moment from "moment";

export default function Orientation({ footerLinks, onShowScreen }) {
  console.log(onShowScreen);
  // const { t } = useTranslation();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const formRef = React.useRef();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const uiSchema = {
    date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
    },
  };
  const styles={
    modalxxl:{
      maxWidth:"950px",
      width:"100%",
      height:"100%"
    },
  }
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
            <Text
              fontSize="24px"
              fontWeight="600"
              color="#212121"
              fontFamily="Inter"
            >
              Home
            </Text>
          </HStack>
        </Box>
        <HStack display="flex" flexDirection="row" space="xl">
          <BoxBlue justifyContent="center" shadow="BlueBoxShadow">
            <VStack  alignItems={"Center"} >
              <Pressable onPress={onShowScreen}>
            <Image
              source={{
                uri: "/orientation.svg",
              }}
              alt="Prerak Orientation"
              size={"sm"}
              resizeMode="contain"
            />
              <Text fontSize="sm" bold pt="4">Prerak Orientation</Text>
              </Pressable>
            </VStack>
          </BoxBlue>
          <BoxBlue justifyContent="center" shadow="BlueBoxShadow">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/training.svg",
                }}
                alt="Prerak Training"
                size={"sm"}
                resizeMode="contain"
              />
              <Text fontSize="sm" bold pt="4">Prerak Training</Text>
            </VStack>
          </BoxBlue>
          <BoxBlue justifyContent="center" shadow="BlueBoxShadow">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/masterTrainer.svg",
                }}
                alt="My MT"
                size={"sm"}
                resizeMode="contain"
              />
              <Text fontSize="sm" bold pt="4">My MT</Text>
            </VStack>
          </BoxBlue>
          <BoxBlue justifyContent="center" shadow="BlueBoxShadow">
            <VStack alignItems={"Center"}>
              <Image
                source={{
                  uri: "/addPrerak.svg",
                }}
                alt="Add a Prerak"
                size={"sm"}
                resizeMode="contain"
              />
              <Text fontSize="sm" bold pt="4">Add a Prerak</Text>
            </VStack>
          </BoxBlue>
        </HStack>
        <Text fontSize="xl" bold py="3">
          Your Calender
        </Text>
      </VStack>

     
      <HStack space="2xl" justifyContent="space-between" px="3">
        <Box>
          <VStack space="xl">
            <Button
            variant={"blueOutlineBtn"}
            shadow="BlueOutlineShadow"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text color="blueText.400" bold fontSize="lg">Schedule an event +</Text>
            </Button>

            <Cal />
            <VStack space="4">
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="blue.500" />
                <Text fontSize="sm" bold>Interview</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="green.500" />
                <Text fontSize="sm" bold>Orientation Days</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="yellow.500" />
                <Text fontSize="sm" bold>Training Days</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="purple.500" />
                <Text fontSize="sm" bold>Camp visits</Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <Box width="50%" justifyContent={"Center"} flex={"1"}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            events={[
              { title: 'event 1', date: moment().format("YYYY-MM-DD HH:mm:ss") },
              
            ]}
          
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
        <Modal.Content  {...styles.modalxxl}>
          <Modal.CloseButton />
          <Modal.Header p="5" borderBottomWidth="0" bg="white">
            <H1 textAlign="center" bold> Schedule an Event</H1>
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
              templates={{
                FieldTemplate,
                ObjectFieldTemplate,
                TitleFieldTemplate,
                DescriptionFieldTemplate,
              }}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                validator,
                schema: orientationPopupSchema,
                formData,
                uiSchema,
              }}
            />
            <Modal.Footer justifyContent={"space-between"}>
              <Button.Group space={2}>
                  <Button
                    variant="blueOutlineBtn"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                    shadow="BlueOutlineShadow"
                  >
                    <Text>Cancel</Text>
                  </Button>
                  <Button
                  variant="blueFillButton"
                    onPress={() => {
                      setShowModal(false);
                    }}
                    shadow="BlueFillShadow"
                  >
                   <Text color="white">Send Invites</Text> 
                  </Button>
                </Button.Group>
            </Modal.Footer>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <HStack space="2xl" justifyContent={"space-between"} px="3">
        <Box>
          <VStack space="xl">
            <Button
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              +Schedule an event
            </Button>

            <Cal />
            <VStack space="xsm">
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="blue.500" />
                <Text>Interview</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="green.500" />
                <Text>Orientation Days</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="yellow.500" />
                <Text>Training Days</Text>
              </HStack>
              <HStack alignItems="Center" space="md">
                <CheckCircleIcon size="4" color="purple.500" />
                <Text>Camp visits</Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <Box width="50%" justifyContent={"Center"} flex={"1"}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            events={[
              {
                title: "Orientation",
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                title: "Orientation",
                date: moment().format("2023-05-14 02:00:00"),
              },
            ]}
            headerToolbar={{
              start: "prev,thisweek,next",
              center: "timeGridWeek,dayGridMonth,dayGridYear",
              end: "today",
              height: "50hv",
            }}
          />
        </Box>
      </HStack>
    </Layout>
  );
}
