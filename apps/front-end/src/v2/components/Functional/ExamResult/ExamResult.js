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
import {
  HStack,
  VStack,
  Radio,
  Alert,
  Modal,
  Pressable,
  Stack,
} from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/DatePicker";
import CustomAccordion from "v2/components/Static/FormBaseInput/CustomAccordion";
import { ExamChipStatus } from "component/Chip";

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

  const statusUpdate = async (selectedRow) => {
    const obj = {
      learner_id: selectedRow?.beneficiary_user?.beneficiary_id,
      status: !selectedRow?.result_upload_status
        ? "first_time_upload_failed"
        : selectedRow?.result_upload_status === "first_time_upload_failed" &&
          "assign_to_ip",
    };
    const data = await organisationService.examResultStatusUpdate(obj);
    learnerList(boardId);
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
      {},
      (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
      }
    );
    if (!result?.data) {
      setErrorMsg(result?.message);
      statusUpdate(selectedRow);
    } else {
      learnerList(boardId);
    }
    setLoading(false);
  };
  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
      <VStack p="5" minHeight={"500px"} space={4} style={{ zIndex: -1 }}>
        <FrontEndTypo.H1>{t("UPDATE_LEARNER_EXAM_RESULTS")}</FrontEndTypo.H1>
        <VStack space={4}>
          <FrontEndTypo.H3 bold color="textGreyColor.500">
            {t("SELECT_BOARD")}
          </FrontEndTypo.H3>

          <HStack space={6}>
            {boardList?.boards?.map((board) => (
              <Radio.Group
                key={board.id}
                onChange={(nextValue) => handleSelect(nextValue)}
                value={filter?.selectedId}
              >
                <Radio colorScheme="red" value={board.id}>
                  {board.name}
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
            <>
              <FrontEndTypo.H3 bold color="textGreyColor.500">
                {t("STUDENT_LIST")}
              </FrontEndTypo.H3>
              {data?.map((item, index) => {
                return (
                  <HStack
                    key={item?.enrollment_number}
                    justifyContent={"space-between"}
                    borderBottomWidth={1}
                    pb={"10px"}
                    borderColor={"grayColor"}
                  >
                    <VStack space={2}>
                      <FrontEndTypo.H3>
                        {t("ENR_NO")}
                        {item?.enrollment_number}
                      </FrontEndTypo.H3>
                      <FrontEndTypo.H3>
                        {/* {t("NAME")}:{" "} */}
                        {`${item?.beneficiary_user?.first_name} ${
                          item?.beneficiary_user?.middle_name || ""
                        } ${item?.beneficiary_user?.last_name || ""}`}
                      </FrontEndTypo.H3>
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
                              item?.beneficiary_user?.exam_results?.[0]
                            );
                          }}
                        >
                          <FrontEndTypo.H3 color={"blueText.800"}>
                            {t("VIEW")}
                          </FrontEndTypo.H3>
                        </Pressable>
                      </HStack>
                    ) : (
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
                    )}
                  </HStack>
                );
              })}
            </>
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
                source={{ document_id: openView?.document_id }}
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
