import React, { useEffect, useState } from "react";
import { VStack } from "native-base";
import {
  ItemComponent,
  benificiaryRegistoryService,
  Layout,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import schema1 from "../LearnerUpdateDetail/enrollment/schema";
import moment from "moment";
import EnrollmentMessage from "component/EnrollmentMessage";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
    setLoading(false);
  };
  useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  const onEditFunc = () => {
    if (
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" &&
      benificiary?.program_beneficiaries?.status !== "registered_in_camp"
    ) {
      return { onEdit: navigate(`/beneficiary/edit/${id}/enrollment-details`) };
    }
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
            notShow={["subjects"]}
            item={{
              ...benificiary?.program_beneficiaries,
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
                  enumOptionValue={
                    benificiary?.program_beneficiaries?.enrolled_for_board
                  }
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
              : {})}
            {...(onEditFunc() || {})}
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
