import {
  CardComponent,
  GetEnumValue,
  PCusers_layout as Layout,
  PcuserService,
  enumRegistryService,
  getEnrollmentIds,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EnrollmentMessage from "component/EnrollmentMessage";
import moment from "moment";
import PropTypes from "prop-types";

export default function App() {
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);

  const location = useLocation();

  React.useEffect(() => {
    agDetails();
  }, []);

  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${id}`);
  };

  const agDetails = async () => {
    const learnerData = location?.state;
    const value = learnerData.program_beneficiaries?.enrolled_for_board;
    let boardName = "-";
    if (value) {
      const { name } = await PcuserService.boardName(value);
      boardName = name;
    }

    const data = await enumRegistryService.listOfEnum();
    const enumOptions = data?.data ? data?.data : {};
    setBenificiary(learnerData);
    const stateName = learnerData?.state;
    let cardArr = [];
    if (
      ![
        "not_enrolled",
        "applied_but_pending",
        "enrollment_rejected",
        "enrollment_awaited",
      ].includes(learnerData?.program_beneficiaries?.enrollment_status)
    ) {
      cardArr = [
        ...cardArr,
        {
          title: "ENROLLMENT_DETAILS",
          arr: ["not_enrolled"].includes(
            learnerData?.program_beneficiaries?.enrollment_status,
          )
            ? ["enrollment_status"]
            : [
                  "identified",
                  "applied_but_pending",
                  "enrollment_rejected",
                  "enrollment_awaited",
                ].includes(
                  learnerData?.program_beneficiaries?.enrollment_status,
                )
              ? ["enrollment_status", "enrolled_for_board"]
              : [
                  "enrollment_status",
                  "type_of_enrollement",
                  "enrolled_for_board",
                  ...(stateName === "RAJASTHAN" ? ["sso_id"] : []),
                  "enrollment_number",
                  "enrollment_mobile_no",
                  "enrollment_date",
                  "enrollment_first_name",
                  "enrollment_middle_name",
                  "enrollment_last_name",
                  "enrollment_dob",
                ],

          label: [
            "ENROLLMENT_STATUS",
            "ENROLLMENT_TYPE",
            "BOARD_OF_ENROLLMENT",
            ...(stateName === "RAJASTHAN" ? ["SSO_ID"] : []),
            stateName == "BIHAR"
              ? "APPLICATION_ID"
              : stateName == "MADHYA PRADESH"
                ? "ROLL_NUMBER"
                : "ENROLLMENT_NO",
            "MOBILE_NUMBER",
            stateName != "RAJASTHAN" ? "APPLICATION_DATE" : "ENROLLMENT_DATE",
            "FIRST_NAME",
            "MIDDLE_NAME",
            "LAST_NAME",
            "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
          ],
          item: {
            ...learnerData?.program_beneficiaries,
            enrollment_dob: learnerData?.program_beneficiaries?.enrollment_dob
              ? moment(
                  learnerData?.program_beneficiaries?.enrollment_dob,
                ).format("DD-MM-YYYY")
              : "-",
            enrollment_date: learnerData?.program_beneficiaries?.enrollment_date
              ? moment(
                  learnerData?.program_beneficiaries?.enrollment_date,
                ).format("DD-MM-YYYY")
              : "-",
            enrollment_status: learnerData?.program_beneficiaries
              ?.enrollment_status ? (
              <GetEnumValue
                enumType="ENROLLEMENT_STATUS"
                enumOptionValue={
                  learnerData?.program_beneficiaries?.enrollment_status
                }
                enumApiData={enumOptions}
                t={t}
              />
            ) : (
              "-"
            ),
            enrolled_for_board: boardName,
          },
        },
      ];
    }

    if (
      [
        "identified",
        "ready_to_enroll",
        "enrolled",
        "not_enrolled",
        "enrollment_awaited",
        "enrollment_rejected",
      ].includes(
        learnerData?.program_beneficiaries?.enrollment_status ||
          learnerData?.program_beneficiaries?.status,
      )
    ) {
      cardArr = [
        ...cardArr,
        {
          title: "ENROLLMENT_RECEIPT",
          arr: ["subjects", "payment_receipt_document_id"],
          label: ["SUBJECTS", "RECEIPT_UPLOAD"],
          item: {
            ...learnerData?.program_beneficiaries,
            ...getEnrollmentIds(
              learnerData?.program_beneficiaries?.payment_receipt_document_id,
              stateName,
            ),
            subjects:
              learnerData?.program_beneficiaries?.subjects &&
              learnerData.program_beneficiaries.subjects.length > 0 ? (
                <SubjectsList
                  boardId={
                    learnerData?.program_beneficiaries?.enrolled_for_board
                  }
                  subjectIds={JSON.parse(
                    learnerData?.program_beneficiaries?.subjects,
                  )}
                />
              ) : (
                "-"
              ),
          },
          format: {
            payment_receipt_document_id: "file",
          },
        },
      ];
    }
    setCardData(cardArr);

    setLoading(false);
  };

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ENROLLMENT_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ENROLLMENT_DETAILS")}
      analyticsPageTitle={"BENEFICIARY_ENROLLMENT_DETAILS"}
    >
      <VStack p="5" space={4}>
        <EnrollmentMessage
          enrollment_status={
            benificiary?.program_beneficiaries?.enrollment_status
          }
          status={benificiary?.program_beneficiaries?.status}
        />
        {cardData?.map((data, index) => (
          <CardComponent
            key={data?.title + index}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            {...data}
            title={t(data?.title)}
          />
        ))}
      </VStack>
    </Layout>
  );
}

App.PropTypes = {
  userTokenInfo: PropTypes.any,
};

const SubjectsList = ({ boardId, subjectIds }) => {
  const [subjectList, setSubjectList] = useState([]);
  useEffect(() => {
    if (boardId) {
      const getSubjects = async () => {
        let data = await PcuserService.subjectsList(boardId);
        setSubjectList(
          data.subjects?.filter((subject) =>
            subjectIds.includes(subject.subject_id.toString()),
          ),
        );
      };
      getSubjects();
    }
  }, [boardId]);
  // return subjectNames.length ? subjectNames.join(", ") : "-";
  return (
    <VStack pl="2">
      {subjectList?.map((subject, i) => (
        <HStack space={1} key={subject?.name}>
          <FrontEndTypo.H3>{i + 1}.</FrontEndTypo.H3>
          <FrontEndTypo.H3>{subject?.name}</FrontEndTypo.H3>
        </HStack>
      ))}
    </VStack>
  );
};

SubjectsList.PropTypes = {
  boardId: PropTypes.string,
  subjectIds: PropTypes.any,
};
