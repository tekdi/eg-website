import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Layout,
  FrontEndTypo,
  organisationService,
  IconByName,
} from "@shiksha/common-lib";
import { HStack, Modal, Pressable, Radio, Text, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckUserIdInPayload,
  StoreAttendanceToIndexDB,
  transformAttendanceResponse,
} from "v2/utils/SyncHelper/SyncHelper";
import { getIndexedDBItem, setIndexedDBItem } from "v2/utils/Helper/JSHelper";
import moment from "moment";
const MarkLearnerAttendance = ({
  footerLinks,
  userTokenInfo: { authUser },
  subjects,
}) => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const selectedSubject = state?.subject;
  const filter = state?.filter;
  const maxDate = state?.boardList?.addedMaxDate;
  const [accessData, SetAccessData] = useState(false);
  const [learnerAttendance, setLearnerAttendance] = useState([]);
  const [learners, setLearners] = useState([]);
  const [learnersData, setLearnersData] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [absentModal, setAbsentModal] = useState();
  const [selectedReason, setSelectedReason] = useState("");
  const [mainAttendance, setMainAttendance] = useState([]);

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const absentReasonsList = [
    "LEARNER_DEATH",
    "LEARNER_MIGRATION",
    "SUDDEN_INCIDENT",
    "FORM_REJECTED",
    "LEARNER_IS_SICK",
    "TRAVEL_RELATED_PROBLEM_NO_MEANS_OR_FARE",
    "FEAR_OF_EXAMS",
    "SYC_LEARNER_SYC_EXAM_ALREADY_DONE",
    "PREGNANCY_THE_BABY_IS_VERY_SMALL",
    "ADMIT_CARD_NOT_FOUND",
    "OTHERS",
  ];
  const markAttendance = async (user, event_id, attendance) => {
    if (attendance === "absent" && !selectedReason) {
      setAbsentModal({ user, event_id, attendance });
    } else {
      setIsDisable(false);
      const AttendaceData = await StoreAttendanceToIndexDB(
        user,
        event_id,
        attendance,
        attendance === "absent" && selectedReason
      );
      const mergedPayload = mergePayloads(learnerAttendance, AttendaceData);
      setLearnerAttendance(mergedPayload);
      setAbsentModal();
      setSelectedReason("");
    }
  };

  const mergePayloads = (payload1, payload2) => {
    // Combine both payloads into a single array
    const combinedPayload = [...payload1, ...payload2];

    // Create a map to store merged data
    const mergedData = new Map();

    // Iterate over the combined payload
    combinedPayload.forEach((item) => {
      const key = Object.keys(item)[0]; // Extract the key
      const value = Object.values(item)[0]; // Extract the value

      if (mergedData.has(key)) {
        // If the key already exists, update the value
        mergedData.set(key, value || mergedData.get(key));
      } else {
        // If the key does not exist, add it to the map
        mergedData.set(key, value);
      }
    });

    // Convert the map back to an array of objects
    const mergedPayload = Array.from(mergedData, ([key, value]) => ({
      [key]: value,
    }));
    return mergedPayload;
  };

  useEffect(() => {
    const fetchData = async () => {
      const newData = [
        {
          subject_name: selectedSubject?.name,
          subject_id: selectedSubject?.id,
          event_id: selectedSubject?.events?.[0]?.id,
          start_date: selectedSubject?.events?.[0]?.start_date,
          end_date: selectedSubject?.events?.[0]?.end_date,
          type:
            selectedSubject?.events?.[0]?.type.charAt(0).toUpperCase() +
            selectedSubject?.events?.[0]?.type.slice(1), // Capitalize the type
        },
      ];
      const LearnerList = await organisationService.getattendanceLearnerList(
        newData
      );
      setLearners(LearnerList?.data?.[0]);
      setLearnersData(LearnerList?.data?.data);
    };
    fetchData();
  }, []);

  const compareDates = (date1, date2) => {
    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);
    return parsedDate1.toDateString() === parsedDate2.toDateString();
  };

  const compareBoards = (board, indexBoard) => {
    return board === indexBoard;
  };

  useEffect(() => {
    const fetchData = async () => {
      const IndexDatapayload = convertPayload(learners);
      const getIndexData = await getIndexedDBItem("exam_attendance");
      const getexamSyncDate = await getIndexedDBItem("examSyncDate");
      const getexamSyncBoard = await getIndexedDBItem("examSyncBoard");
      const stringIndexDatapayload = JSON.stringify(IndexDatapayload);
      const stringgetIndexData = JSON.stringify(getIndexData);
      setMainAttendance(IndexDatapayload || []);
      const isDate = compareDates(filter?.date, getexamSyncDate);
      const isBoard = compareBoards(filter?.selectedId, getexamSyncBoard);

      if (filter?.date) {
        if (isDate) {
          if (getIndexData?.length > 0 && isBoard) {
            setLearnerAttendance(getIndexData);
          } else {
            setLearnerAttendance(IndexDatapayload);
            if (IndexDatapayload?.length > 0) {
              setIndexedDBItem("exam_attendance", IndexDatapayload);
            } else {
              setIndexedDBItem("exam_attendance", []);
            }
          }
        } else {
          if (IndexDatapayload) {
            setIndexedDBItem("exam_attendance", IndexDatapayload);
            setLearnerAttendance(IndexDatapayload);
            setIndexedDBItem("examSyncDate", filter?.date);
            setIndexedDBItem("examSyncBoard", filter?.selectedId);
          }
        }
      }

      const currentDateFormatted = moment().format("YYYY-MM-DD");
      const maxDateDisable = moment(currentDateFormatted, "YYYY/MM/DD").isAfter(
        maxDate
      );
      if (maxDateDisable) {
        SetAccessData(true);
      } else {
        SetAccessData(false);
      }
      if (
        isDate &&
        (stringIndexDatapayload == stringgetIndexData || !getIndexData)
      ) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    };
    fetchData();
  }, [learners]);

  const convertPayload = (payload) => {
    // Flatten the nested payload and extract event_id and user_id
    const flattenedData = payload?.data?.map((user) => ({
      event_id: payload.event_id,
      user_id: user.user_id,
      status:
        user?.attendances?.[0]?.status === "present"
          ? "present"
          : user?.attendances?.[0]?.status === "absent"
          ? "absent"
          : "", // Determine the attendance status
    }));

    // Construct the new format
    const formattedPayload = flattenedData?.map((item) => ({
      [`${item.event_id}_${item.user_id}`]: item.status,
    }));
    return formattedPayload;
  };

  const generateNewPayload = (original, updated, event_id) => {
    const newPayload = updated.map((originalItem) => {
      const key = Object.keys(originalItem)[0];
      if (key.startsWith(`${event_id}_`)) {
        const updatedItem = original.find(
          (item) => Object.keys(item)[0] === key
        );
        return updatedItem || originalItem;
      } else {
        return originalItem;
      }
    });
    return newPayload;
  };

  const cancelAttendance = async (event_id) => {
    if (mainAttendance.length > 0) {
      const newPayload = generateNewPayload(
        mainAttendance,
        learnerAttendance,
        event_id
      );
      setIndexedDBItem("exam_attendance", newPayload);
      setLearnerAttendance(newPayload);
    } else {
      setLearnerAttendance([]);
    }
    setIsDisable(true);
  };

  const SaveAttendance = async (event_id) => {
    const payload = (await getIndexedDBItem("exam_attendance")) || [];
    const matchedPayload = payload?.filter((item) => {
      const key = Object.keys(item)[0];
      return key.startsWith(event_id + "_");
    });

    const finalPayload = await transformAttendanceResponse(
      matchedPayload,
      filter?.date
    );
    const hasBlankStatus = finalPayload?.some((item) => {
      return item.status === "";
    });

    if (hasBlankStatus) {
      setOpenModal(finalPayload);
    } else {
      const result = await organisationService.markExamAttendance(finalPayload);
      if (result?.success) {
        setIsDisable(true);
        navigate(`/examattendance`);
      }
    }
  };
  const SaveModalAttendance = async (finalPayload) => {
    const newData = finalPayload?.filter((item) => item?.status?.trim() !== "");
    const result = await organisationService.markExamAttendance(newData);
    if (result?.success) {
      setIsDisable(true);
      setOpenModal(false);
      navigate(`/examattendance`);
    }
  };
  const onPressBackButton = () => {
    navigate(-1);
  };

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      _footer={{ menues: footerLinks }}
      _appBar={{
        onPressBackButton,
      }}
    >
      <VStack space={4} p={4}>
        <FrontEndTypo.H1>{t("MARK_LEARNER_EXAM_ATTENDANCE")}</FrontEndTypo.H1>
        <VStack space={2}>
          <FrontEndTypo.H2 bold color={"textGreyColor.750"}>
            {learners?.subject_name}
          </FrontEndTypo.H2>
          <FrontEndTypo.H3>{`${t("TOTAL_NUMBER_OF_STUDENTS")} : ${
            learners?.data?.length
          }`}</FrontEndTypo.H3>
          {/* {learnersData?.length == 0 && (
            <FrontEndTypo.H2>{t("WARNING")}</FrontEndTypo.H2>
          )} */}
        </VStack>
        <>
          <table
            style={{
              textAlign: "center",
              borderSpacing: "10px",
            }}
          >
            {learners?.data?.length !== 0 ? (
              <>
                <thead>
                  <tr>
                    <th>{t("ID")}</th>
                    <th>{t("NAME")}</th>
                    <th>{t("MARK_ATTENDANCE")}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Assuming attendance data is fetched from an API or stored elsewhere */}
                  {/* You can replace the placeholder values with actual attendance data */}
                  {learners?.data?.map((user, index) => {
                    return (
                      <tr style={{}} key={user?.user_id}>
                        <td>{user.user_id}</td>
                        <td>
                          {user.first_name} {user.last_name}
                        </td>
                        <td>
                          <HStack
                            alignItems={"center"}
                            justifyContent={"center"}
                            space={4}
                          >
                            <Pressable
                              isDisabled={accessData}
                              onPress={() =>
                                markAttendance(
                                  user,
                                  learners?.event_id,
                                  "present"
                                )
                              }
                            >
                              <VStack alignItems={"center"}>
                                <IconByName
                                  name="CheckboxCircleFillIcon"
                                  color={`${
                                    CheckUserIdInPayload(
                                      user,
                                      learnerAttendance,
                                      learners?.event_id
                                    ) === "present"
                                      ? "#038400"
                                      : "grayColor"
                                  }`}
                                />
                                <Text>{t("A_PRESENT")}</Text>
                              </VStack>
                            </Pressable>
                            <Pressable
                              isDisabled={accessData}
                              onPress={() =>
                                markAttendance(
                                  user,
                                  learners?.event_id,
                                  "absent"
                                )
                              }
                            >
                              <VStack alignItems={"center"}>
                                <IconByName
                                  name="CloseCircleFillIcon"
                                  color={`${
                                    CheckUserIdInPayload(
                                      user,
                                      learnerAttendance,
                                      learners.event_id
                                    ) === "absent"
                                      ? "#D53546"
                                      : "grayColor"
                                  }`}
                                />
                                <Text>{t("ABSENT")}</Text>
                              </VStack>
                            </Pressable>
                          </HStack>
                        </td>
                        {/* Example attendance value */}
                      </tr>
                    );
                  })}
                </tbody>
              </>
            ) : (
              <FrontEndTypo.H2>{t("EXAM_WARNING")}</FrontEndTypo.H2>
            )}
          </table>
          {learners?.data?.length !== 0 && (
            <HStack
              space={4}
              width={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <FrontEndTypo.Secondarybutton
                isDisabled={isDisable}
                px="20px"
                onPress={() => {
                  cancelAttendance(learners?.event_id);
                  // navigate(`/examattendance`);
                }}
              >
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton
                px="20px"
                isDisabled={isDisable}
                onPress={() => {
                  SaveAttendance(learners?.event_id);
                  // navigate(`/examattendance`);
                }}
              >
                {t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </HStack>
          )}
        </>
      </VStack>
      <Modal isOpen={absentModal} size="lg">
        <Modal.Content>
          <Modal.Header alignItems={"center"}>
            {t("SELECT_ABSENT_REASON")}
          </Modal.Header>
          <Modal.Body p="5">
            <VStack space="4">
              <Radio.Group
                name="myRadioGroup"
                accessibilityLabel="favorite number"
                value={selectedReason}
                onChange={(nextValue) => {
                  setSelectedReason(nextValue);
                }}
              >
                {absentReasonsList?.map((item, index) => {
                  return (
                    <Radio my={2} value={item}>
                      {t(item)}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <HStack
              space={4}
              width={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <FrontEndTypo.Secondarybutton
                px="20px"
                onPress={() => {
                  setAbsentModal();
                  setSelectedReason("");
                }}
              >
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton
                px="20px"
                isDisabled={!selectedReason}
                onPress={() => {
                  markAttendance(
                    absentModal?.user,
                    absentModal?.event_id,
                    "absent"
                  );
                }}
              >
                {t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={openModal} size="lg">
        <Modal.Content>
          <Modal.Header alignItems={"center"}>{t("ARE_YOU_SURE")}</Modal.Header>
          <Modal.Body p="5">
            <VStack space="4">
              <FrontEndTypo.H3>{t("ATTENDANCE_ALERT_MESSAGE")}</FrontEndTypo.H3>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <HStack
              space={4}
              width={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <FrontEndTypo.Primarybutton
                px="20px"
                isDisabled={isDisable}
                onPress={() => {
                  SaveModalAttendance(openModal);
                }}
              >
                {t("YES")}
              </FrontEndTypo.Primarybutton>
              <FrontEndTypo.Secondarybutton
                px="20px"
                onPress={() => {
                  setOpenModal(false);
                }}
              >
                {t("NO")}
              </FrontEndTypo.Secondarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
};

MarkLearnerAttendance.propTypes = {};

export default MarkLearnerAttendance;
