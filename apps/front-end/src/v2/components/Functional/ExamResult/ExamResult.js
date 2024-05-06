import React, { useEffect, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio, Alert } from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/DatePicker";
import CustomAccordion from "v2/components/Static/FormBaseInput/CustomAccordion";

const ExamResult = ({ userTokenInfo, footerLinks }) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState();
  const [data, setData] = useState([]);

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId, date: "" });
    learnerList();
  };

  const learnerList = async () => {
    const data = await organisationService.examResultLearnerList();
    setData(data?.data);
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
                      <FrontEndTypo.H4>
                        {item?.beneficiary_user?.exam_results?.[0]}
                      </FrontEndTypo.H4>
                    ) : (
                      <FrontEndTypo.H3 color={"blueText.800"}>
                        {t("UPLOAD")}
                      </FrontEndTypo.H3>
                    )}
                  </HStack>
                );
              })}
            </>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
};

export default ExamResult;
