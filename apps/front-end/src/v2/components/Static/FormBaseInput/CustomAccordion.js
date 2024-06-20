import React, { useEffect, useState } from "react";
import { HStack, VStack, Text, Pressable, Modal, Radio } from "native-base";
import {
  IconByName,
  FrontEndTypo,
  organisationService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";

import {
  CheckUserIdInPayload,
  StoreAttendanceToIndexDB,
  transformAttendanceResponse,
} from "v2/utils/SyncHelper/SyncHelper";
import { getIndexedDBItem, setIndexedDBItem } from "v2/utils/Helper/JSHelper";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const CustomAccordion = ({ data, date, board, maxDate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState(null);
  const [learnerAttendance, setLearnerAttendance] = useState([]);
  const [mainAttendance, setMainAttendance] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [accessData, SetAccessData] = useState(false);
  const [AbsentModal, setAbsentModal] = useState();
  const [selectedReason, setSelectedReason] = useState("");

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
      setOpenAccordion(null);
      const IndexDatapayload = convertPayload(data);
      const getIndexData = await getIndexedDBItem("exam_attendance");
      const getexamSyncDate = await getIndexedDBItem("examSyncDate");
      const getexamSyncBoard = await getIndexedDBItem("examSyncBoard");
      const stringIndexDatapayload = JSON.stringify(IndexDatapayload);
      const stringgetIndexData = JSON.stringify(getIndexData);
      setMainAttendance(IndexDatapayload || []);
      const isDate = compareDates(date, getexamSyncDate);
      const isBoard = compareBoards(board, getexamSyncBoard);
      if (date) {
        if (isDate) {
          if (getIndexData?.length > 0 && isBoard) {
            setLearnerAttendance(getIndexData);
          } else {
            setLearnerAttendance(IndexDatapayload);
            if (IndexDatapayload.length > 0) {
              setIndexedDBItem("exam_attendance", IndexDatapayload);
            } else {
              setIndexedDBItem("exam_attendance", []);
            }
          }
        } else {
          if (IndexDatapayload) {
            setIndexedDBItem("exam_attendance", IndexDatapayload);
            setLearnerAttendance(IndexDatapayload);
            setIndexedDBItem("examSyncDate", date);
            setIndexedDBItem("examSyncBoard", board);
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
  }, [data]);

  const convertPayload = (payload) => {
    // Flatten the nested payload and extract event_id and user_id
    const flattenedData = payload.flatMap((item) =>
      item.data.map((user) => ({
        event_id: item.event_id,
        user_id: user.user_id,
        status:
          user?.attendances?.[0]?.status === "present"
            ? "present"
            : user?.attendances?.[0]?.status === "absent"
            ? "absent"
            : "", // Determine the attendance status
      }))
    );

    // Construct the new format
    const formattedPayload = flattenedData.map((item) => ({
      [`${item.event_id}_${item.user_id}`]: item.status,
    }));
    return formattedPayload;
  };

  const toggleAccordion = (index, subject) => {
    setOpenAccordion(openAccordion === index ? null : index);
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

  const SaveAttendance = async (event_id) => {
    const payload = (await getIndexedDBItem("exam_attendance")) || [];
    const matchedPayload = payload.filter((item) => {
      const key = Object.keys(item)[0];
      return key.startsWith(event_id + "_");
    });

    const finalPayload = await transformAttendanceResponse(
      matchedPayload,
      date
    );

    const hasBlankStatus = finalPayload.some((item) => item.status === "");

    if (hasBlankStatus) {
      setOpenModal(finalPayload);
    } else {
      const result = await organisationService.markExamAttendance(finalPayload);
      if (result?.success) {
        setIsDisable(true);
      }
    }
  };

  const SaveModalAttendance = async (finalPayload) => {
    const newData = finalPayload?.filter((item) => item?.status?.trim() !== "");
    const result = await organisationService.markExamAttendance(newData);
    if (result?.success) {
      setIsDisable(true);
      setOpenModal(false);
    }
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
  return (
    <VStack space={4}>
      {data?.map(
        (subject, index) =>
          subject?.data?.length > 0 && (
            <VStack key={subject.id}>
              <HStack
                onClick={() => toggleAccordion(index, subject)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  backgroundColor:
                    openAccordion === index ? "lightgray" : "white",
                }}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <HStack space={2}>
                  {subject?.subject_name}
                  {subject?.type == "Practical" && `- ${t("PRACTICALS")}`}
                </HStack>

                {openAccordion === index ? (
                  <IconByName p="0" name="ArrowUpSLineIcon" />
                ) : (
                  <IconByName p="0" name="ArrowDownSLineIcon" />
                )}
              </HStack>
              {openAccordion === index && (
                <>
                  <table
                    style={{
                      textAlign: "center",
                      borderSpacing: "10px",
                    }}
                  >
                    {subject?.data?.length !== 0 ? (
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
                          {subject?.data.map((user, index) => {
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
                                          subject?.event_id,
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
                                              subject.event_id
                                            ) === "present"
                                              ? "successColor"
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
                                          subject?.event_id,
                                          "absent"
                                        )
                                      }
                                    >
                                      <VStack alignItems={"center"}>
                                        <IconByName
                                          name="CloseCircleLineIcon"
                                          color={`${
                                            CheckUserIdInPayload(
                                              user,
                                              learnerAttendance,
                                              subject.event_id
                                            ) === "absent"
                                              ? "dangerColor"
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
                  {subject?.data.length !== 0 && (
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
                          cancelAttendance(subject?.event_id);
                        }}
                      >
                        {t("CANCEL")}
                      </FrontEndTypo.Secondarybutton>
                      <FrontEndTypo.Primarybutton
                        px="20px"
                        isDisabled={isDisable}
                        onPress={() => {
                          SaveAttendance(subject?.event_id);
                        }}
                      >
                        {t("SAVE")}
                      </FrontEndTypo.Primarybutton>
                    </HStack>
                  )}
                </>
              )}
            </VStack>
          )
      )}
      {date && data?.length < 1 && (
        <FrontEndTypo.H2>{t("DATA_NOT_FOUND")}</FrontEndTypo.H2>
      )}
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
      <Modal isOpen={AbsentModal} size="lg">
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
                    AbsentModal?.user,
                    AbsentModal?.event_id,
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
    </VStack>
  );
};

export default CustomAccordion;
