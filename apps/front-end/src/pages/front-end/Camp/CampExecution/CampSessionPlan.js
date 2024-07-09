import { CardComponent, FrontEndTypo, IconByName } from "@shiksha/common-lib";
import { HStack, Image, Pressable } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const CampSessionPlan = ({ button_name, id, campType, sessionList }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getNavigatePath = (base, assessment) =>
    `/camps/${id}/${base}${assessment ? `/${assessment}` : ""}`;

  const sessionCardProps = {
    navigatePath: "",
    type: "",
    showIcon: false,
  };
  if (campType.type === "main") {
    sessionCardProps.type = "MAIN_LEARNING_ACTIVITIES";
    sessionCardProps.navigatePath = getNavigatePath("sessionslist");
    sessionCardProps.showIcon = sessionList;
  } else {
    if (button_name == "base-line") {
      sessionCardProps.type = "PCR_INITIAL_LEVEL";
      sessionCardProps.navigatePath = getNavigatePath("base-line", "scores");
    } else if (button_name == "fa1") {
      sessionCardProps.type = "PCR_EVALUATION_1";
      sessionCardProps.navigatePath = getNavigatePath(
        "formative-assessment-1",
        "subjectslist"
      );
    } else if (button_name == "fa2") {
      sessionCardProps.type = "PCR_EVALUATION_2";
      sessionCardProps.navigatePath = getNavigatePath(
        "formative-assessment-2",
        "subjectslist"
      );
    } else if (button_name == "end-line") {
      sessionCardProps.type = "PCR_FINAL_EVALUATON";
      sessionCardProps.navigatePath = getNavigatePath("end-line", "scores");
    } else {
      sessionCardProps.type = "PCR_LEARNING_ACTIVITIES";
      sessionCardProps.navigatePath = getNavigatePath("sessionslist");
      sessionCardProps.showIcon = sessionList;
    }
  }

  return (
    <CardComponent _body={{ pt: 4 }}>
      <Pressable onPress={() => navigate(sessionCardProps.navigatePath)}>
        <HStack alignItems="center" justifyContent="center" space={3}>
          <Image
            source={{ uri: "/images/activities/learning-activity.png" }}
            resizeMode="contain"
            alignSelf="center"
            w="75px"
            h="60px"
            alt="learning-activity"
          />
          <FrontEndTypo.H2 color="textMaroonColor.400">
            {t(sessionCardProps.type)}
          </FrontEndTypo.H2>
          {sessionList && (
            <IconByName
              name="CheckboxCircleFillIcon"
              _icon={{ size: "36" }}
              color="successColor"
            />
          )}
        </HStack>
      </Pressable>
    </CardComponent>
  );
};
