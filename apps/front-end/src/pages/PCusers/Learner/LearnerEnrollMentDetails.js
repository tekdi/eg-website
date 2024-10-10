import {
  CardComponent,
  GetEnumValue,
  PCusers_layout as Layout,
  PcuserService,
  enumRegistryService,
  getEnrollmentIds,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { HStack, Modal, Toast, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EnrollmentMessage from "component/EnrollmentMessage";
import moment from "moment";
import PropTypes from "prop-types";

export default function App({ userTokenInfo }) {
  const [benificiary, setBenificiary] = useState();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [cardData, setCardData] = useState([]);
  const location = useLocation();
  const { id } = useParams();

  React.useEffect(() => {
    agDetails();
  }, []);

  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${id}`, {
      state: location?.state,
    });
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
    const enrollmentStatus =
      learnerData?.program_beneficiaries?.enrollment_status;
    const isNotEnrolled = ["not_enrolled"].includes(enrollmentStatus);
    const isOtherStatus = [
      "identified",
      "applied_but_pending",
      "enrollment_rejected",
      "enrollment_awaited",
    ].includes(enrollmentStatus);
    const isRajasthan = stateName === "RAJASTHAN";

    function getEnrollmentDetails() {
      const baseDetails = [
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
      ];

      return isRajasthan ? [...baseDetails, "sso_id"] : baseDetails;
    }

    let arr;
    if (isNotEnrolled) {
      arr = ["enrollment_status"];
    } else if (isOtherStatus) {
      arr = ["enrollment_status", "enrolled_for_board"];
    } else {
      arr = getEnrollmentDetails();
    }

    let enrollmentIdLabel;

    if (stateName === "BIHAR") {
      enrollmentIdLabel = "APPLICATION_ID";
    } else if (stateName === "MADHYA PRADESH") {
      enrollmentIdLabel = "ROLL_NUMBER";
    } else {
      enrollmentIdLabel = "ENROLLMENT_NO";
    }

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
          arr,
          label: [
            "ENROLLMENT_STATUS",
            "ENROLLMENT_TYPE",
            "BOARD_OF_ENROLLMENT",
            ...(stateName === "RAJASTHAN" ? ["SSO_ID"] : []),
            enrollmentIdLabel,
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
        "sso_id_enrolled",
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

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { program_id, academic_year_id } =
        benificiary?.program_beneficiaries || {};
      const result = await PcuserService.verifyEnrollmentPC({
        user_id: parseInt(id),
        enrollment_verification_status: "pc_verified",
        program_id,
        academic_year_id,
      });
      if (result?.success) {
        setOpenConfirmModal(false);
        navigate(`/learners/list-view/${id}`);
      } else {
        Toast.show({
          title: "Verification failed",
          status: "error",
          description: result?.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Toast.show({
        title: "Error",
        status: "error",
        description: "Failed to verify enrollment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const shouldShowVerifyButton = () => {
    const learnerStatus = benificiary?.program_beneficiaries?.status;
    const learnerState = benificiary?.state;
    return (
      (learnerState === "RAJASTHAN" && learnerStatus === "sso_id_enrolled") ||
      learnerStatus === "enrolled"
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
      }}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ENROLLMENT_DETAILS")}
      analyticsPageTitle={"BENEFICIARY_ENROLLMENT_DETAILS"}
      facilitator={userTokenInfo?.authUser || {}}
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
        {benificiary?.program_beneficiaries?.enrollment_verification_status ==
        "pc_verified" ? (
          <FrontEndTypo.ColourPrimaryButton isDisabled>
            {t("VERIFIED")}
          </FrontEndTypo.ColourPrimaryButton>
        ) : (
          shouldShowVerifyButton() && (
            <FrontEndTypo.Primarybutton
              onPress={() => setOpenConfirmModal(true)}
            >
              {t("VERIFY")}
            </FrontEndTypo.Primarybutton>
          )
        )}
      </VStack>
      <Modal
        isOpen={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <Modal.Content>
          <Modal.Header>
            <FrontEndTypo.H1 textAlign={"center"}>
              {t("CONFIRM")}
            </FrontEndTypo.H1>
          </Modal.Header>
          <Modal.Body p="5">
            <VStack space="4">
              <VStack>
                <HStack space="4" alignItems={"center"}>
                  <FrontEndTypo.H2 bold color="textGreyColor.550">
                    {t("VOLUNTEER_CONFIRM_STATUS")}
                  </FrontEndTypo.H2>
                </HStack>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <FrontEndTypo.Secondarybutton
              onPress={() => setOpenConfirmModal(false)}
            >
              {t("CLOSE")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton onPress={() => onSubmit()}>
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

App.propTypes = {
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

SubjectsList.propTypes = {
  boardId: PropTypes.string,
  subjectIds: PropTypes.any,
};
