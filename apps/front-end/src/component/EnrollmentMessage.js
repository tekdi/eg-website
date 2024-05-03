import { CustomAlert, FrontEndTypo } from "@shiksha/common-lib";
import { Alert } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

export default function EnrollmentMessage({ status, enrollment_status }) {
  const { t } = useTranslation();
  return (
    ["ready_to_enroll", "identified"].includes(status) &&
    enrollment_status === "enrolled" && (
      <CustomAlert
        title={t("ENROLLMENT_INCOMPLETE_MESSAGE")}
        status={"danger"}
      />
    )
  );
}
