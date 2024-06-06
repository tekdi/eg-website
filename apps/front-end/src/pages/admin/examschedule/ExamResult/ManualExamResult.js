import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  Breadcrumb,
  AdminLayout as Layout,
  useWindowSize,
  CardComponent,
  IconByName,
  organisationService,
} from "@shiksha/common-lib";
import { Alert, HStack, ScrollView, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import TextBox from "./TextBox";

function ManualExamResult(footerLinks) {
  const { t } = useTranslation();
  const id = useParams();
  const navigate = useNavigate();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [isDisable, setIsDisable] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [data, setData] = useState();
  const [finalResult, setFinalResult] = useState();
  const [year, setYear] = useState();
  const [error, setError] = useState();
  const [subjectCodeError, setSubjectCodeError] = useState(false);

  // Update the subjects if practical is present or not for that subject.
  const updateSubjects = (subjects) => {
    return subjects.map((subject) => {
      if (subject.practical_marks === null) {
        return {
          ...subject,
          marks: {
            practical: "-",
          },
        };
      } else {
        return subject;
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const obj = {
        learner_id: parseInt(id?.id),
      };
      const data = await organisationService.LearnerSujectList(obj);
      setData(data?.data);
      const updatedData = updateSubjects(data?.data?.subjectsArray || []);
      setSubjects(updatedData || []);
      data?.data?.subjectsArray?.map((item) => {
        if (!item?.code) {
          setSubjectCodeError(true);
        }
      });
    };

    fetchData();
  }, []);
  const handleMarksChange = (index, type, newMarks, maxValue) => {
    const updatedSubjects = [...subjects];
    const subject = { ...updatedSubjects[index] };
    if (!subject.marks) {
      subject.marks = {};
    }

    // Ensure the newMarks does not exceed the maximum value
    const numericMarks = parseInt(newMarks, 10);
    if (isNaN(numericMarks) || numericMarks <= maxValue) {
      subject.marks[type] = newMarks;

      const practical = isNaN(parseInt(subject.marks.practical))
        ? 0
        : parseInt(subject.marks.practical);
      const theory = isNaN(parseInt(subject.marks.theory))
        ? 0
        : parseInt(subject.marks.theory);
      const sessional = isNaN(parseInt(subject.marks.sessional))
        ? 0
        : parseInt(subject.marks.sessional);

      const totalMarks = practical + theory + sessional;
      subject.marks.total = totalMarks.toString();

      updatedSubjects[index] = subject;
      setSubjects(updatedSubjects);
    }
  };

  const handleFinalResult = (value) => {
    setFinalResult(value);
  };

  const handleCancelButton = () => {
    const updatedSubjects = subjects.map((subject) => {
      return { ...subject, marks: {} }; // Clear marks object for each subject
    });
    setSubjects(updatedSubjects); // Update subjects state with cleared marks
    setIsDisable(true);
  };

  // Check if any of the fields are empty
  const isEmptyField = () =>
    subjects.some((item) => {
      return (
        !item.marks ||
        !item.marks.theory ||
        !item.marks.practical ||
        !item.marks.sessional ||
        !item.marks.result ||
        !finalResult ||
        !year ||
        item.marks.theory == "" ||
        item.marks.practical == "" ||
        item.marks.sessional == "" ||
        item.marks.result == "" ||
        finalResult == "" ||
        year == ""
      );
    });

  useEffect(() => {
    const isEmpty = isEmptyField();
    if (isEmpty) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [subjects, finalResult, year]);

  // Calculate Final Marks.
  const finalMarks = () =>
    subjects.reduce((total, subject) => {
      // Check if the subject has the "marks" property and it contains the "total" property
      if (subject.marks && subject.marks.total) {
        return total + parseInt(subject.marks.total);
      } else {
        return total; // If "marks" or "total" is undefined, return current total without adding anything
      }
    }, 0);

  const convertToObjectFormat = (subject) => {
    return {
      subject_name: subject?.name,
      subject_code: subject?.code,
      max_marks: 100,
      theory: subject?.marks?.theory,
      practical: subject?.marks?.practical,
      tma_internal_sessional: subject?.marks?.sessional,
      total: subject?.marks?.total,
      result: subject?.marks?.result,
    };
  };

  const handleSaveButton = () => {
    const fetchData = async () => {
      const newArray = subjects.map(convertToObjectFormat);
      const payload = {
        user_id: data?.learner_id,
        board_id: data?.subjectsArray?.[0]?.boardById?.id,
        enrollment: data?.enrollment_number,
        candidate: `${data?.enrollment_first_name} ${
          data?.enrollment_middle_name || ""
        } ${data?.data?.enrollment_last_name || ""}`,
        father: data?.user?.core_beneficiaries?.father_first_name
          ? `${data?.user?.core_beneficiaries?.father_first_name} ${data?.user?.core_beneficiaries?.father_middle_name} ${data?.user?.core_beneficiaries?.father_last_name}`
          : "",
        mother: data?.user?.core_beneficiaries?.mother_first_name
          ? `${data?.user?.core_beneficiaries?.mother_first_name} ${data?.user?.core_beneficiaries?.mother_middle_name} ${data?.user?.core_beneficiaries?.mother_last_name}`
          : "",
        dob: data?.enrollment_dob,
        course_class: "10th",
        exam_year: year,
        total_marks: finalMarks(),
        final_result: finalResult,
        subject: newArray,
      };

      if (!isEmptyField()) {
        const result = await organisationService.examResult(payload);
        if (result?.data) {
          navigate(-1);
        }
      } else {
        setError("REQUIRED_MESSAGE");
      }
    };
    fetchData();
  };
  const handleYearChange = (value) => {
    setYear(value);
  };

  return (
    <Layout
      w={Width}
      h={Height}
      getRefAppBar={(e) => setRefAppBar(e)}
      refAppBar={refAppBar}
      _sidebar={footerLinks}
    >
      <Stack p={4} space={4}>
        <HStack justifyContent={"space-between"}>
          <Breadcrumb
            _hstack={{ alignItems: "center" }}
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              {
                title: (
                  <HStack alignItems={"center"} space={2}>
                    <IconByName name="Home4LineIcon" size="md" />
                    <AdminTypo.H4 bold color="Activatedcolor.400">
                      {t("HOME")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/admin/exams/list",
                icon: "GroupLineIcon",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("LEARNER_EXAM_RESULT")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </HStack>
        {subjectCodeError ? (
          <Alert mt={"20px"} status="warning" alignItems={"start"}>
            <HStack alignItems="center" space="2">
              <Alert.Icon />
              <AdminTypo.H5>{t("SUBJECTCODE_ERROR")}</AdminTypo.H5>
            </HStack>
          </Alert>
        ) : (
          <>
            <HStack justifyContent={"space-between"}>
              <VStack space={4}>
                <AdminTypo.H5 bold color="textGreyColor.500">
                  {data?.enrollment_first_name}
                  {data?.enrollment_middle_name
                    ? `${data.enrollment_middle_name} ${data.enrollment_last_name}`
                    : data?.enrollment_last_name}
                </AdminTypo.H5>
                <HStack alignItems={"center"} space={6}>
                  <AdminTypo.H6 bold color="textGreyColor.500">
                    {t("ENROLLMENT_NO")} : {data?.enrollment_number}
                  </AdminTypo.H6>
                  <AdminTypo.H6 bold color="textGreyColor.500">
                    {t("BOARD")} : {data?.subjectsArray?.[0]?.boardById?.name}
                  </AdminTypo.H6>

                  <HStack alignItems={"center"} space={4}>
                    <AdminTypo.H6 bold color="textGreyColor.500">
                      {t("ENTER_EXAM_YEAR")} :
                    </AdminTypo.H6>
                    <TextBox
                      value={year}
                      onChange={(e) =>
                        handleYearChange(
                          e.target.value.toUpperCase().replace(/[^0-9-]/g, "")
                        )
                      }
                      maxlength={4}
                      placeholder={"ENTER_EXAM_YEAR"}
                    />
                  </HStack>
                </HStack>
              </VStack>
            </HStack>

            <VStack p={4} pl={0} space={4}>
              <HStack space={4}>
                <CardComponent
                  _header={{ bg: "light.100", padding: 4 }}
                  _vstack={{ space: 0, flex: 1, bg: "light.100" }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  isHideProgressBar={true}
                >
                  <ScrollView>
                    <VStack padding={3} space={4} height={"350px"}>
                      <table
                        style={{
                          textAlign: "center",
                          borderSpacing: "10px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>{t("SUBJECTS")}</th>
                            <th>{t("MAX_MARKS")}</th>
                            <th>{t("MARKS_THEORY")}</th>
                            <th>{t("MARKS_PRACTICAL")}</th>
                            <th>{t("MARKS_SESSIONAL")}</th>
                            <th>{t("TOTAL_MARKS")}</th>
                            <th>{t("RESULT")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects?.map((item, index) => {
                            return (
                              <tr style={{}} key={item?.user_id}>
                                <td>{item.name}</td>
                                <td>100</td>
                                <td>
                                  <TextBox
                                    value={item?.marks?.theory}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        index,
                                        "theory",
                                        e.target.value
                                          .toUpperCase()
                                          .replace(/[^0-9AB-]/g, ""),
                                        item?.theory_marks
                                      )
                                    }
                                    placeholder={"ENTER_THEORY_MARKS"}
                                  />
                                </td>
                                <td>
                                  {item?.practical_marks ? (
                                    <TextBox
                                      value={item?.marks?.practical}
                                      onChange={(e) =>
                                        handleMarksChange(
                                          index,
                                          "practical",
                                          e.target.value
                                            .toUpperCase()
                                            .replace(/[^0-9AB-]/g, ""),
                                          item?.practical_marks
                                        )
                                      }
                                      placeholder={"ENTER_PRACTICAL_MARKS"}
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td>
                                  <TextBox
                                    value={item?.marks?.sessional}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        index,
                                        "sessional",
                                        e.target.value
                                          .toUpperCase()
                                          .replace(/[^0-9AB-]/g, ""),
                                        item?.sessional_marks
                                      )
                                    }
                                    placeholder={"ENTER_SESSIONAL_MARKS"}
                                  />
                                </td>
                                <td>
                                  <HStack>{item?.marks?.total || "-"}</HStack>
                                </td>
                                <td>
                                  <TextBox
                                    value={item?.marks?.result}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        index,
                                        "result",
                                        e.target.value
                                          .toUpperCase()
                                          .replace(/[^A-Z]/g, "")
                                      )
                                    }
                                    maxlength="4"
                                    placeholder={"RESULT"}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <HStack
                        bg={"dividerColor"}
                        p={4}
                        alignItems={"center"}
                        justifyContent={"space-evenly"}
                      >
                        <HStack width={"40%"} justifyContent={"space-between"}>
                          <AdminTypo.H4>{t("TOTAL")}</AdminTypo.H4>
                          <AdminTypo.H4>{finalMarks()}</AdminTypo.H4>
                        </HStack>
                        <HStack width={"40%"} justifyContent={"space-between"}>
                          <AdminTypo.H4>{t("RESULT")}</AdminTypo.H4>
                          <TextBox
                            value={finalResult}
                            onChange={(e) =>
                              handleFinalResult(
                                e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z]/g, "")
                              )
                            }
                            maxlength="4"
                            placeholder={"RESULT"}
                          />
                        </HStack>
                      </HStack>
                      {error && (
                        <Alert status="warning" alignItems={"start"}>
                          <HStack alignItems="center" space="2">
                            <Alert.Icon />
                            {t(error)}
                          </HStack>
                        </Alert>
                      )}
                    </VStack>
                  </ScrollView>
                </CardComponent>
              </HStack>
            </VStack>
            <VStack>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_P")}</AdminTypo.H4>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_SYC")}</AdminTypo.H4>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_SYCT")}</AdminTypo.H4>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_SYCP")}</AdminTypo.H4>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_RWH")}</AdminTypo.H4>
              <AdminTypo.H4>{t("EXAM_RESULT_STATUS_XXXX")}</AdminTypo.H4>
            </VStack>
            <HStack space={4} alignSelf={"center"}>
              <AdminTypo.Secondarybutton
                isDisabled={isDisable}
                onPress={handleCancelButton}
                icon={<IconByName color="black" name="DeleteBinLineIcon" />}
              >
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton
                isDisabled={isDisable}
                onPress={handleSaveButton}
              >
                {t("SAVE")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </>
        )}
      </Stack>
    </Layout>
  );
}

export default ManualExamResult;
