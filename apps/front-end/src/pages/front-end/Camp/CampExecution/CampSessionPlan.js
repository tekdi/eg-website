import { CardComponent, FrontEndTypo, IconByName } from "@shiksha/common-lib";
import { HStack, Image, Pressable, Progress, VStack } from "native-base";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const CampSessionPlan = ({
  button_list,
  id,
  sessionList,
  activityId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cards, setCards] = useState();
  const getNavigatePath = (base, assessment) =>
    `/camps/${id}/${base}${assessment ? `/${assessment}` : ""}`;

  useEffect(() => {
    const init = () => {
      let arr = [];
      let button_name = Object.keys(button_list || {});
      // console.log(button_name, button_list);
      if (Array.isArray(button_name) && button_name?.includes("main")) {
        arr = [
          ...arr,
          {
            type: "MAIN_LEARNING_ACTIVITIES",
            navigatePath: getNavigatePath(`sessionslist/${activityId}`),
          },
        ];
      } else {
        if (Array.isArray(button_name) && button_name?.includes("base_line")) {
          arr = [
            ...arr,
            {
              type: "PCR_INITIAL_LEVEL",
              navigatePath: getNavigatePath("base-line", "scores"),
              ...(button_list?.base_line || {}),
            },
          ];
        }
        if (Array.isArray(button_name) && button_name?.includes("fa1")) {
          arr = [
            ...arr,
            {
              type: "PCR_EVALUATION_1",
              navigatePath: getNavigatePath(
                "formative-assessment-1",
                "subjectslist"
              ),
              ...(button_list?.fa1 || {}),
            },
          ];
        }
        if (Array.isArray(button_name) && button_name?.includes("fa2")) {
          arr = [
            ...arr,
            {
              type: "PCR_EVALUATION_2",
              navigatePath: getNavigatePath(
                "formative-assessment-2",
                "subjectslist"
              ),
              ...(button_list?.fa2 || {}),
            },
          ];
        }
        if (Array.isArray(button_name) && button_name?.includes("end_line")) {
          arr = [
            ...arr,
            {
              type: "PCR_FINAL_EVALUATON",
              navigatePath: getNavigatePath("end-line", "scores"),
              ...(button_list?.end_line || {}),
            },
          ];
        }
        if (Array.isArray(button_name) && button_name?.length === 0) {
          arr = [
            ...arr,
            {
              type: "PCR_LEARNING_ACTIVITIES",
              navigatePath: getNavigatePath(`sessionslist/${activityId}`),
              showIcon: sessionList,
            },
          ];
        }
      }
      setCards(arr);
    };
    init();
  }, [button_list]);

  return (
    <VStack space={4}>
      {cards?.map((card) => (
        <Pressable onPress={() => navigate(card.navigatePath)} key={card.type}>
          <CardComponent _body={{ pt: 4, space: "4" }}>
            {(card?.total_count >= 0 || card.data?.length >= 0) && (
              <VStack space={1}>
                <HStack space={4} alignItems={"center"}>
                  <FrontEndTypo.H5 bold color="textGreyColor.750">
                    {t("COMPLETED")} :
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H4 bold color="textGreyColor.750">
                    {card?.total_count - card.data?.length}/{card?.total_count}
                  </FrontEndTypo.H4>
                </HStack>
                <Progress
                  value={calculateProgress(
                    card?.total_count - card.data?.length,
                    card?.total_count
                  )}
                  size="sm"
                  colorScheme="progressBarRed"
                />
              </VStack>
            )}
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
                {t(card.type)}
              </FrontEndTypo.H2>
              {card?.showIcon && (
                <IconByName
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "36" }}
                  color="successColor"
                />
              )}
            </HStack>
          </CardComponent>
        </Pressable>
      ))}
    </VStack>
  );
};

const calculateProgress = (completedSessions, totalSessions) => {
  if (totalSessions === 0) return 0; // to avoid division by zero
  return (completedSessions / totalSessions) * 100;
};
