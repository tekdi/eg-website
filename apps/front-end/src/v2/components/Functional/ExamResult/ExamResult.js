import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
  uploadRegistryService,
  ImageView,
  CustomAlert,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio, Alert, Modal, Pressable } from "native-base";
import { useTranslation } from "react-i18next";
import { ExamChipStatus } from "component/Chip";
import Chip from "component/BeneficiaryStatus";
import PropTypes from "prop-types";

const ExamResult = ({ userTokenInfo, footerLinks }) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState();
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [boardId, setBoardId] = useState();
  const [openView, setOpenView] = useState("");
  const uplodInputRef = useRef();

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId, date: "" });
    learnerList(optionId);
    setBoardId(optionId);
  };

  const learnerList = async (id) => {
    setData([]);
    const data = await organisationService.examResultLearnerList({
      ...filter,
      limit: "",
      boardid: id,
    });
    setData(data?.data);
  };

  const handleFileInputChange = (e) => {
    const resultfile = e.target.files[0];
    if (resultfile && resultfile.size <= 1024 * 1024 * 9.5) {
      if (resultfile.type === "application/pdf") {
        uploadProfile(resultfile);
      }
    }
  };

  const openFileUploadDialog = (row) => {
    setSelectedRow(row);
    uplodInputRef.current.click();
  };

  const uploadProfile = async (resultfile) => {
    setLoading(true);
    const form_data = new FormData();
    const item = {
      resultfile,
      board_name: selectedRow?.bordID?.name,
      board_id: selectedRow?.bordID?.id,
      enrollment: selectedRow?.enrollment_number,
      user_id: selectedRow?.beneficiary_user?.beneficiary_id, // localStorage id of the logged-in user
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadExamResult(
      form_data,
      // {},
      // (progressEvent) => {
      //   const { loaded, total } = progressEvent;
      //   const percent = Math.floor((loaded * 100) / total);
      // },
    );
    if (!result?.data) {
      setErrorMsg(result?.message);
    } else {
      learnerList(boardId);
    }
    setLoading(false);
  };
  return (
    <Layout
      loading={loading}
      _footer={{ menues: footerLinks }}
      facilitator={userTokenInfo?.authUser}
    >
      <VStack py="6" px="4" space={4}>
        <FrontEndTypo.H1>{t("UPDATE_LEARNER_EXAM_RESULTS")}</FrontEndTypo.H1>
        <VStack space={5}>
          <FrontEndTypo.H3 fontWeight={600} color="textGreyColor.500">
            {t("SELECT_BOARD")}
          </FrontEndTypo.H3>

          <HStack space={6}>
            {boardList?.boards?.map((board) => (
              <Radio.Group
                key={board.id}
                onChange={(nextValue) => handleSelect(nextValue)}
                value={filter?.selectedId}
              >
                <Radio size="16px" p="2px" colorScheme="red" value={board.id}>
                  <FrontEndTypo.H4 fontWeight={600} color="textGreyColor.500">
                    {board.name}
                  </FrontEndTypo.H4>
                </Radio>
              </Radio.Group>
            ))}
          </HStack>
          {filter?.selectedId && (
            <VStack>
              <FrontEndTypo.H4>{`${t("TOTAL_NUMBER_OF_STUDENTS")} : ${
                data?.length
              }`}</FrontEndTypo.H4>
            </VStack>
          )}
          <CustomAlert
            _hstack={{ mb: "0", mt: "0" }}
            title={t("RESULT_UPLOAD_WARNING")}
            status={"info"}
          />

          {data.length > 0 && (
            <VStack space={4}>
              <FrontEndTypo.H3 bold color="textGreyColor.500">
                {t("STUDENT_LIST")}
              </FrontEndTypo.H3>
              {data?.map((item) => {
                return (
                  <HStack
                    key={item?.enrollment_number}
                    justifyContent={"space-between"}
                    borderBottomWidth={1}
                    pb={"10px"}
                    borderColor={"grayColor"}
                  >
                    <VStack space={1}>
                      <FrontEndTypo.H4
                        fontWeight={400}
                        color="inputValueColor.500"
                      >
                        {t("ENR_NO")}
                        {item?.enrollment_number}
                      </FrontEndTypo.H4>
                      <FrontEndTypo.H3
                        fontWeight={400}
                        color="inputValueColor.500"
                      >
                        {[
                          item?.enrollment_first_name,
                          item?.enrollment_middle_name,
                          item?.enrollment_last_name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </FrontEndTypo.H3>
                      <HStack>
                        <Chip
                          m="0"
                          label={item?.user_id}
                          alignItems="center"
                          _text={{ fontSize: "10px" }}
                        />
                      </HStack>
                    </VStack>
                    {item?.result_upload_status === "uploaded" ||
                    item?.result_upload_status === "assign_to_ip" ? (
                      <HStack alignItems={"center"} space={4}>
                        <ExamChipStatus
                          status={
                            item?.beneficiary_user?.exam_results?.[0]
                              ?.final_result || ""
                          }
                        />
                        <Pressable
                          onPress={() => {
                            setOpenView(
                              item?.beneficiary_user?.exam_results?.[0],
                            );
                          }}
                        >
                          <FrontEndTypo.H3>{t("VIEW")}</FrontEndTypo.H3>
                        </Pressable>
                      </HStack>
                    ) : (
                      <HStack alignItems={"center"} space={4}>
                        {item?.result_upload_status && (
                          <Chip
                            m="0"
                            label={
                              item?.result_upload_status ===
                              "first_time_upload_failed"
                                ? t("FIRST_ATTEMPT_FAILED")
                                : item?.result_upload_status ===
                                    "second_time_upload_failed"
                                  ? t("SECOND_ATTEMPT_FAILED")
                                  : ""
                            }
                            alignItems="center"
                            rounded="sm"
                            bg={"gray.300"}
                            _text={{ fontSize: "10px" }}
                          />
                        )}
                        <VStack space={2} alignItems={"center"}>
                          <Pressable
                            onPress={() => {
                              openFileUploadDialog(item);
                            }}
                          >
                            <FrontEndTypo.H3
                              style={{
                                textDecoration: "underline",
                                color: "#0500FF",
                              }}
                            >
                              {t("UPLOAD")}
                            </FrontEndTypo.H3>
                          </Pressable>
                          {item?.result_upload_status && (
                            <Pressable
                              onPress={() => {
                                setOpenView(
                                  item?.beneficiary_user
                                    ?.exam_result_document?.[0],
                                );
                              }}
                            >
                              <FrontEndTypo.H3>{t("VIEW")}</FrontEndTypo.H3>
                            </Pressable>
                          )}
                        </VStack>
                      </HStack>
                    )}
                  </HStack>
                );
              })}
            </VStack>
          )}
        </VStack>
        <input
          accept="application/pdf"
          type="file"
          style={{ display: "none" }}
          ref={uplodInputRef}
          onChange={handleFileInputChange}
        />
        <Modal isOpen={errorMsg} size="lg" onClose={() => setErrorMsg()}>
          <Modal.Content>
            <Modal.CloseButton />

            <Modal.Body>
              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems="center" space="2">
                  <Alert.Icon />
                  <FrontEndTypo.H4>{t(errorMsg)}</FrontEndTypo.H4>
                </HStack>
              </Alert>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal isOpen={openView} size="xl" onClose={() => setOpenView()}>
          <Modal.Content>
            <Modal.CloseButton />

            <Modal.Body>
              <ImageView
                source={{ document_id: openView?.document_id || openView?.id }}
                alt="Result"
                width="100%"
                height="300"
                borderRadius="5px"
                borderWidth="1px"
                borderColor="worksheetBoxText.100"
                alignSelf="Center"
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </VStack>
    </Layout>
  );
};

export default ExamResult;

ExamResult.propTypes = {
  userTokenInfo: PropTypes.object,
};
