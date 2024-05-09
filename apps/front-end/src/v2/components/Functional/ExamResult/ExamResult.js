import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio, Alert, Modal, Pressable } from "native-base";
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
  const uplodInputRef = useRef();

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId, date: "" });
    learnerList(optionId);
  };

  const learnerList = async (id) => {
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
      {},
      (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
      }
    );
    if (!result?.data) {
      setErrorMsg(result?.message);
    } else {
      learnerList();
    }
    setLoading(false);
  };

  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
      <VStack
        bg="primary.50"
        p="5"
        minHeight={"500px"}
        space={4}
        style={{ zIndex: -1 }}
      >
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("UPDATE_LEARNER_EXAM_RESULTS")}
        </FrontEndTypo.H2>
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
          <Alert status="info" p={4} flexDirection="row" gap="2">
            <Alert.Icon size="3" />
            <FrontEndTypo.H4>{t("RESULT_UPLOAD_WARNING")}</FrontEndTypo.H4>
          </Alert>

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
                    <VStack>
                      <FrontEndTypo.H4>
                        {t("ENR_NO")} {item?.enrollment_number}
                      </FrontEndTypo.H4>
                      <FrontEndTypo.H4>
                        {t("NAME")}:{" "}
                        {`${item?.beneficiary_user?.first_name} ${
                          item?.beneficiary_user?.middle_name || ""
                        } ${item?.beneficiary_user?.last_name || ""}`}
                      </FrontEndTypo.H4>
                    </VStack>
                    {item?.beneficiary_user?.exam_results.length > 0 ? (
                      <ExamChipStatus
                        status={
                          item?.beneficiary_user?.exam_results?.[0]
                            ?.final_result || ""
                        }
                      />
                    ) : (
                      <Pressable
                        onPress={() => {
                          openFileUploadDialog(item);
                        }}
                      >
                        <FrontEndTypo.H3 color={"blueText.800"}>
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
      </VStack>
    </Layout>
  );
};

export default ExamResult;
