import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { VStack } from "native-base";
import AadharCompare from "./AadhaarCompare";
import { FrontEndTypo } from "@shiksha/common-lib";

export default function AadhaarSuccess({
  user,
  type,
  location,
  aadhaarCompare,
}) {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (location?.state) {
      navigate(location?.state);
    } else if (user?.program_faciltators?.id) {
      navigate(`/profile/${id}/aadhaardetails`);
    } else if (id) {
      navigate(`/beneficiary/${id}`);
    } else if (user?.id) {
      navigate(`/admin/view/${id}`);
    } else {
      navigate("/beneficiary/list");
    }
  };

  return (
    <VStack px={4} space={4}>
      <AadharCompare {...{ user, type, location, aadhaarCompare, id }} />
      <FrontEndTypo.Primarybutton onPress={handleContinue}>
        {t("CONTINUE")}
      </FrontEndTypo.Primarybutton>
    </VStack>
  );
}
