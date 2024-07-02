import React, { useEffect, useState } from "react";
import { VStack } from "native-base";
import {
  ItemComponent,
  benificiaryRegistoryService,
  PCusers_layout as Layout,
  enumRegistryService,
  GetEnumValue,
  getEnrollmentIds,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import schema1 from "../LearnerUpdateDetail/enrollment/schema";
import schema1 from "../../../../../front-end/src/v2/components/Functional/LearnerUpdateDetail/enrollment/schema";
import moment from "moment";
import EnrollmentMessage from "component/EnrollmentMessage";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [boardName, setBoardName] = useState({});
  const [stateName, setStateName] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();

  React.useEffect(() => {
    agDetails();
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const value = location?.state?.program_beneficiaries?.enrolled_for_board;
    if (value) {
      const boardName = await enumRegistryService.boardName(value);
      setBoardName(boardName?.name);
    }
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    setBenificiary(location?.state);
    setStateName(location?.state?.state);
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
      analyticsPageTitle={"BENEFICIARY_ENROLLMENT_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ENROLLMENT_DETAILS")}
    >
      <VStack p="5" space={4}>
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
          <ItemComponent
            title={t("ENROLLMENT_DETAILS")}
            schema={schema1?.properties["edit_enrollement"]}
            notShow={["subjects", "enrollmentlabelMobile"]}
            item={{
              ...benificiary?.program_beneficiaries,
              ...getEnrollmentIds(
                benificiary?.program_beneficiaries?.payment_receipt_document_id,
                stateName
              ),
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
                  onlyField: ["enrollment_status"],
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
                  onlyField: ["enrollment_status", "enrolled_for_board"],
                }
              : {
                  onlyField: [
                    "enrollment_status",
                    "enrolled_for_board",
                    "enrollment_number",
                    "enrollment_mobile_no",
                    "enrollment_date",
                    "payment_receipt_document_id",
                    ...(stateName !== "RAJASTHAN"
                      ? ["application_form", "application_login_id"]
                      : []),
                  ],
                })}
            BenificiaryStatus={benificiary?.program_beneficiaries?.status}
          />
        )}
        {![
          "not_enrolled",
          "applied_but_pending",
          "enrollment_rejected",
          "enrollment_awaited",
        ].includes(benificiary?.program_beneficiaries?.enrollment_status) && (
          <ItemComponent
            title={t("ENROLLMENT_RECEIPT")}
            schema={schema1?.properties["edit_enrollement_details"]}
            item={{
              ...benificiary?.program_beneficiaries,
              enrollment_dob: benificiary?.program_beneficiaries?.enrollment_dob
                ? moment(
                    benificiary?.program_beneficiaries?.enrollment_dob
                  ).format("DD-MM-YYYY")
                : "-",
              enrollment_status: (
                <GetEnumValue
                  enumType="BENEFICIARY_STATUS"
                  enumOptionValue={
                    benificiary?.program_beneficiaries?.enrollment_status
                  }
                  enumApiData={enumOptions}
                  t={t}
                />
              ),
            }}
          />
        )}
      </VStack>
    </Layout>
  );
}
