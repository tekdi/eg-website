import { CardComponent, FrontEndTypo, IconByName } from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import { HStack, Pressable, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function BeneficiaryCard({
  item,
  onPress,
  onPressDocCheckList,
  onPressRnroll,
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  useEffect(() => {
    if (
      [
        "enrolled_ip_verified",
        "sso_id_verified",
        "registered_in_neev_camp",
        "registered_in_camp",
        "ineligible_for_pragati_camp",
        "10th_passed",
        "pragati_syc",
      ].includes(item?.program_beneficiaries?.status)
    ) {
      setName(
        [
          item?.program_beneficiaries?.enrollment_first_name,
          item?.program_beneficiaries?.enrollment_middle_name,
          item?.program_beneficiaries?.enrollment_last_name,
        ]
          .filter(Boolean)
          .join(" "),
      );
    } else {
      setName(
        [item?.first_name, item?.middle_name, item?.last_name]
          .filter(Boolean)
          .join(" "),
      );
    }
  }, [item]);

  return (
    <CardComponent
      _body={{ px: "0", py: "2", pb: 2 }}
      _vstack={{ p: 0, space: 0, flex: 1 }}
    >
      <PressableOnPress onPress={onPress} flex={1}>
        <VStack
          alignItems="center"
          p="1"
          pt="0"
          borderBottomColor={"LeanerListCardIDBorder.500"}
          borderStyle={"dotted"}
          borderBottomWidth={"1px"}
        >
          <Clipboard text={item?.id}>
            <FrontEndTypo.H4 color="floatingLabelColor.500" fontWeight={"600"}>
              {item?.id}
            </FrontEndTypo.H4>
          </Clipboard>
        </VStack>
        <HStack pt={2} px={3} justifyContent="space-between" space={1}>
          <HStack alignItems="Center" flex={[1, 2, 4]}>
            <VStack
              pl="2"
              flex="1"
              wordWrap="break-word"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              <FrontEndTypo.H4 fontWeight={"600"} color="grayTitleCard">
                {name}
              </FrontEndTypo.H4>
              <FrontEndTypo.H5 color="LearnerListCardNumber.500">
                {item?.mobile}
              </FrontEndTypo.H5>
            </VStack>
          </HStack>
          <VStack alignItems="end" flex={[1]}>
            <ChipStatus
              w="fit-content"
              status={item?.program_beneficiaries?.status}
              is_duplicate={item?.is_duplicate}
              is_deactivated={item?.is_deactivated}
              rounded={"sm"}
            />
          </VStack>
        </HStack>
      </PressableOnPress>
      <VStack px={2} bg="white" alignItems={"end"}>
        {item?.program_beneficiaries?.status === "identified" && (
          <PressableOnPress onPress={onPressDocCheckList}>
            <HStack color="LearnerListCardLink.500" alignItems="center">
              <FrontEndTypo.H4 color="LearnerListCardLink.500">
                {t("COMPLETE_THE_DOCUMENTATION")}
              </FrontEndTypo.H4>
              <IconByName
                color="LearnerListCardLink.500"
                name="ArrowRightSLineIcon"
                py="0"
              />
            </HStack>
          </PressableOnPress>
        )}
        {item?.program_beneficiaries?.status === "enrollment_pending" && (
          <PressableOnPress onPress={onPressDocCheckList}>
            <HStack color="LearnerListCardLink.500" alignItems="center">
              <FrontEndTypo.H4 color="blueText.450">
                {t("CONTINUE_ENROLLMENT")}
              </FrontEndTypo.H4>
              <IconByName name="ArrowRightSLineIcon" />
            </HStack>
          </PressableOnPress>
        )}
        {item?.program_beneficiaries?.status === "ready_to_enroll" && (
          <PressableOnPress onPress={onPressRnroll}>
            <HStack color="LearnerListCardLink.500" alignItems="center">
              <FrontEndTypo.H4 color="blueText.450">
                {t("ENTER_THE_ENROLLMENT_DETAILS")}
              </FrontEndTypo.H4>
              <IconByName name="ArrowRightSLineIcon" />
            </HStack>
          </PressableOnPress>
        )}
        {["duplicated", "enrolled_ip_verified"]?.includes(
          item?.program_beneficiaries?.status,
        ) && (
          <HStack color="LearnerListCardLink.500" alignItems="center" mb="2">
            <FrontEndTypo.H4 color="blueText.450">
              {item?.program_beneficiaries?.status === "duplicated"
                ? t("FOLLOW_UP_WITH_IP_ASSIGNMENT")
                : t("TO_BE_REGISTERED_IN_CAMP")}
            </FrontEndTypo.H4>
          </HStack>
        )}
        {item?.program_beneficiaries?.status === "enrolled" && (
          <LearnerMessage program_beneficiaries={item?.program_beneficiaries} />
        )}
      </VStack>
    </CardComponent>
  );
}

export function PressableOnPress({ children, ...props }) {
  if (props?.onPress) {
    return <Pressable {...props}>{children}</Pressable>;
  } else {
    return <VStack {...props}>{children}</VStack>;
  }
}

PressableOnPress.propTypes = {
  program_beneficiaries: PropTypes.object,
  onPress: PropTypes.func,
  children: PropTypes.node,
};

export const LearnerMessage = ({ program_beneficiaries }) => {
  const [reason, setReason] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (
      program_beneficiaries?.enrollment_verification_status ===
      "change_required"
    ) {
      setReason(
        JSON.parse(program_beneficiaries?.enrollment_verification_reason),
      );
    }
  }, []);

  const getTitle = () => {
    if (
      reason?.learner_enrollment_details === "no" &&
      reason?.enrollment_details === "no"
    ) {
      return t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH");
    } else if (reason?.learner_enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_DETAILS");
    } else if (reason?.enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_LEARNER_DETAILS");
    } else {
      return t("FOLLOW_UP_WITH_IP");
    }
  };

  return (
    <HStack color="LearnerListCardLink.500" alignItems="center">
      <FrontEndTypo.H4 color="LearnerListCardLink.500">
        {getTitle()}
      </FrontEndTypo.H4>
    </HStack>
  );
};

BeneficiaryCard.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
  onPressDocCheckList: PropTypes.func,
  onPressRnroll: PropTypes.func,
};

LearnerMessage.propTypes = {
  program_beneficiaries: PropTypes.object,
};
