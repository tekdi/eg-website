import { FrontEndTypo } from "@shiksha/common-lib";
import { Stack, Text, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ExamPreparationCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <VStack padding="2">
      <Stack space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("PREPARATION_FOR_EXAM")}
        </FrontEndTypo.H2>
        <FrontEndTypo.H4 color="textMaroonColor.400">
          {t("DO_YOU_KNOW_THE_EXAM_DATES")}
        </FrontEndTypo.H4>
        <FrontEndTypo.Secondarybutton
          onPress={(e) => navigate("/camps/exampreparation")}
        >
          <FrontEndTypo.H3 color="textMaroonColor.400">
            {t("LIST_OF_LEARNERS")}
          </FrontEndTypo.H3>
        </FrontEndTypo.Secondarybutton>
      </Stack>
    </VStack>
  );
};

export default ExamPreparationCard;
