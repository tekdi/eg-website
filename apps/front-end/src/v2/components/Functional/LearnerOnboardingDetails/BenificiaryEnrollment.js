import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  getEnrollmentIds,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import EnrollmentMessage from "component/EnrollmentMessage";
import moment from "moment";
import { HStack, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryEnrollment({ userTokenInfo }) {
  const { id } = useParams();
  const [benificiary, setbenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [boardName, setBoardName] = useState({});
  const [stateName, setStateName] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [facilitator, setFacilitator] = useState();

  useEffect(() => {
    setFacilitator(userTokenInfo?.authUser || {});
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    const value = result?.result?.program_beneficiaries?.enrolled_for_board;
    if (value) {
      const boardName = await enumRegistryService.boardName(value);
      setBoardName(boardName?.name);
    }
    setbenificiary(result?.result);
    setLoading(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      let { state_name } = await getSelectedProgramId();
      setStateName(state_name);
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});
    };
    fetchData();
  }, [id]);

  const onEditFunc = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" &&
      benificiary?.program_beneficiaries?.status !== "registered_in_camp"
    );
  };

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ENROLLMENT_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      analyticsPageTitle={"BENEFICIARY_ENROLLMENT_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ENROLLMENT_DETAILS")}
    >
      <VStack p="5" pt="0" space={4}>
        <EnrollmentMessage
          status={benificiary?.program_beneficiaries?.status}
          enrollment_status={
            benificiary?.program_beneficiaries?.enrollment_status
          }
        />

        {[
          "identified",
          "ready_to_enroll",
          "enrolled",
          "not_enrolled",
          "enrollment_awaited",
          "enrollment_rejected",
        ].includes(
          benificiary?.program_beneficiaries?.enrollment_status ||
            benificiary?.program_beneficiaries?.status
        ) && (
          <VStack>
            <FrontEndTypo.H1 fontWeight="600" mb="3">
              {t("ENROLLMENT_DETAILS")}
            </FrontEndTypo.H1>
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ENROLLMENT_DETAILS")}
              label={[
                "ENROLLMENT_STATUS",
                "ENROLLMENT_TYPE",
                "BOARD_OF_ENROLLMENT",
                stateName == "BIHAR"
                  ? "APPLICATION_ID"
                  : stateName == "MADHYA PRADESH"
                  ? "ROLL_NUMBER"
                  : "ENROLLMENT_NO",
                "MOBILE_NUMBER",
                stateName != "RAJASTHAN"
                  ? "APPLICATION_DATE"
                  : "ENROLLMENT_DATE",
                "FIRST_NAME",
                "MIDDLE_NAME",
                "LAST_NAME",
                "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
              ]}
              item={{
                ...benificiary?.program_beneficiaries,
                enrollment_dob: benificiary?.program_beneficiaries
                  ?.enrollment_dob
                  ? moment(
                      benificiary?.program_beneficiaries?.enrollment_dob
                    ).format("DD-MM-YYYY")
                  : "-",
                enrollment_date: benificiary?.program_beneficiaries
                  ?.enrollment_date
                  ? moment(
                      benificiary?.program_beneficiaries?.enrollment_date
                    ).format("DD-MM-YYYY")
                  : "-",
                enrollment_status: benificiary?.program_beneficiaries
                  ?.enrollment_status ? (
                  <GetEnumValue
                    enumType="ENROLLEMENT_STATUS"
                    enumOptionValue={
                      benificiary?.program_beneficiaries?.enrollment_status
                    }
                    enumApiData={enumOptions}
                    t={t}
                  />
                ) : (
                  "-"
                ),
                enrolled_for_board: benificiary?.program_beneficiaries
                  ?.enrolled_for_board ? (
                  <GetEnumValue
                    t={t}
                    enumType={"ENROLLED_FOR_BOARD"}
                    enumOptionValue={boardName}
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),
              }}
              {...(["not_enrolled"].includes(
                benificiary?.program_beneficiaries?.enrollment_status
              )
                ? {
                    arr: ["enrollment_status"],
                  }
                : [
                    "identified",
                    "applied_but_pending",
                    "enrollment_rejected",
                    "enrollment_awaited",
                  ].includes(
                    benificiary?.program_beneficiaries?.enrollment_status
                  )
                ? {
                    arr: ["enrollment_status", "enrolled_for_board"],
                  }
                : {
                    arr: [
                      "enrollment_status",
                      "type_of_enrollement",
                      "enrolled_for_board",
                      "enrollment_number",
                      "enrollment_mobile_no",
                      "enrollment_date",
                      "enrollment_first_name",
                      "enrollment_middle_name",
                      "enrollment_last_name",
                      "enrollment_dob",
                    ],
                  })}
              onEdit={
                onEditFunc()
                  ? (e) =>
                      navigate(`/beneficiary/edit/${id}/enrollment-details`)
                  : false
              }
            />
          </VStack>
        )}
        {![
          "not_enrolled",
          "applied_but_pending",
          "enrollment_rejected",
          "enrollment_awaited",
        ].includes(benificiary?.program_beneficiaries?.enrollment_status) && (
          <VStack mt={4}>
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ENROLLMENT_RECEIPT")}
              label={["SUBJECTS", "RECEIPT_UPLOAD"]}
              item={{
                ...benificiary?.program_beneficiaries,
                ...getEnrollmentIds(
                  benificiary?.program_beneficiaries
                    ?.payment_receipt_document_id,
                  stateName
                ),
                subjects:
                  benificiary?.program_beneficiaries?.subjects &&
                  benificiary.program_beneficiaries.subjects.length > 0 ? (
                    <SubjectsList
                      boardId={
                        benificiary?.program_beneficiaries?.enrolled_for_board
                      }
                      subjectIds={JSON.parse(
                        benificiary?.program_beneficiaries?.subjects
                      )}
                    />
                  ) : (
                    "-"
                  ),
              }}
              format={{
                payment_receipt_document_id: "file",
              }}
              arr={["subjects", "payment_receipt_document_id"]}
            />
          </VStack>
        )}
      </VStack>
    </Layout>
  );
}

const SubjectsList = ({ boardId, subjectIds }) => {
  const [subjectList, setSubjectList] = useState([]);
  useEffect(() => {
    if (boardId) {
      const getSubjects = async () => {
        let data = await enumRegistryService.subjectsList(boardId);
        setSubjectList(data.subjects || []);
      };
      getSubjects();
    }
  }, [boardId]);
  // return subjectNames.length ? subjectNames.join(", ") : "-";
  return (
    <VStack pl="2">
      {subjectList
        .filter((subject) => subjectIds.includes(subject.subject_id.toString()))
        .map((subject, i) => (
          <HStack space={1} key={subject?.name}>
            <FrontEndTypo.H3>{i + 1}.</FrontEndTypo.H3>
            <FrontEndTypo.H3>{subject?.name}</FrontEndTypo.H3>
          </HStack>
        ))}
    </VStack>
  );
};
