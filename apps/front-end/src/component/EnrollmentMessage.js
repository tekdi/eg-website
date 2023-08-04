import { FrontEndTypo } from "@shiksha/common-lib";
import { Alert } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

export default function EnrollmentMessage({ status, enrollment_status }) {
  const { t } = useTranslation();
  return (
    ["ready_to_enroll", "identified"].includes(status) &&
    enrollment_status === "enrolled" && (
      <Alert status="warning" py="2px" px="2" flexDirection="row" gap="2">
        <Alert.Icon size="3" />
        <FrontEndTypo.H4>{t("ENROLLMENT_INCOMPLETE_MESSAGE")}</FrontEndTypo.H4>
      </Alert>
    )
  );
}
