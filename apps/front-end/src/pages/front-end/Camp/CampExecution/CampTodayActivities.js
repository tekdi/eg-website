import React from "react";

import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  enumRegistryService,
  campService,
} from "@shiksha/common-lib";
import {
  Actionsheet,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  VStack,
  Image,
  Alert,
} from "native-base";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "component/BaseInput";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function CampTodayActivities({
  footerLinks,
  setAlert,
  activityId,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [enums, setEnums] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState(null);
  const [selectValue, setSelectValue] = React.useState([]);
  const [isSaving] = React.useState(false);
  const [sessionList, setSessionList] = React.useState(false);

  React.useEffect(async () => {
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getActivity(obj);
    setSelectValue(
      result?.data?.camp_days_activities_tracker?.[0]?.misc_activities || []
    );
  }, []);

  const handleSubmitData = async () => {
    const dataToSave = {
      edit_page_type: "edit_misc_activities",
      id: activityId,
      misc_activities: selectValue,
    };
    const activities_response = await campService.addMoodActivity(dataToSave);
    if (activities_response) {
      setEnums();
      setAlert({ type: "success", title: t("MISSILINEOUS_SUCCESS_MESSAGE") });
    }
  };

  React.useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const LearningActivitydata = qData?.data;
    setEnumOptions(LearningActivitydata);
    const result = await campService.getCampSessionsList({ id: id });
    const data = result?.data?.learning_lesson_plans_master || [];
    data.forEach((element) => {
      const currentDate = new Date();
      const createdAtDate = new Date(element?.session_tracks?.[0]?.created_at);
      if (currentDate.toDateString() === createdAtDate.toDateString()) {
        setSessionList(true);
      }
    });
  }, []);

  const handleActivities = async (item) => {
    const data = enumOptions && enumOptions[item] ? enumOptions[item] : null;
    setEnums({ type: item, data });
  };

  return (
    <Layout
      _appBar={t("ADD_TODAYS_ACTIVITIES")}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <CardComponent
          _vstack={{
            flex: 1,
            borderColor: sessionList === true && "greenIconColor",
          }}
          _body={{ pt: 4 }}
        >
          <Pressable onPress={() => navigate(`/camps/${id}/sessionslist`)}>
            <HStack alignItems="center" justifyContent="center" space={3}>
              <Image
                source={{
                  uri: "/images/activities/learning-activity.png",
                }}
                resizeMode="contain"
                alignSelf={"center"}
                w="75px"
                h="60px"
              />
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("LEARNING_ACTIVITIES")}
              </FrontEndTypo.H2>
              {sessionList === true && (
                <IconByName
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "36" }}
                  color="successColor"
                />
              )}
            </HStack>
          </Pressable>
        </CardComponent>
        <CardComponent
          _vstack={{
            flex: 1,
            borderColor: selectValue?.[0] && "greenIconColor",
          }}
          _body={{ pl: 8, pt: 4 }}
        >
          <Pressable
            onPress={() => {
              handleActivities("MISCELLANEOUS_ACTIVITIES");
            }}
          >
            <HStack alignItems="center" justifyContent="center" space={5}>
              <Image
                source={{
                  uri: "/images/activities/missilaneous-activity.png",
                }}
                resizeMode="contain"
                alignSelf={"center"}
                w="75px"
                h="60px"
              />
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("MISCELLANEOUS_ACTIVITIES")}
              </FrontEndTypo.H2>
              {selectValue?.[0] && (
                <IconByName
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "36" }}
                  color="successColor"
                />
              )}
            </HStack>
          </Pressable>
        </CardComponent>
        {selectValue?.[0] && sessionList === true && (
          <VStack pt={"10%"}>
            <FrontEndTypo.Primarybutton
              onPress={() => navigate(`/camps/${id}/campexecution/endcamp`)}
            >
              {t("GO_BACK")}
            </FrontEndTypo.Primarybutton>
          </VStack>
        )}
      </VStack>
      <Actionsheet isOpen={enums?.data} onClose={(e) => setEnums()}>
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <HStack
              width={"100%"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <FrontEndTypo.H1 bold color="textGreyColor.450"></FrontEndTypo.H1>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setEnums()}
              />
            </HStack>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="2" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <React.Suspense fallback={<HStack>Loading...</HStack>}>
                  <MultiCheck
                    value={selectValue}
                    options={{
                      enumOptions: enums?.data || [],
                    }}
                    schema={{
                      grid: 1,
                      minItems: 1,
                      maxItems: 4,
                    }}
                    onChange={(newSelectValue) => {
                      setSelectValue(newSelectValue);
                    }}
                  />
                </React.Suspense>
              </VStack>
            </VStack>
            <VStack space="5" pt="5">
              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems="center" space="2">
                  <Alert.Icon />
                  {t("PLEASE_SELECT_OPTION_1_TO_3")}
                </HStack>
              </Alert>
              <FrontEndTypo.Primarybutton
                flex={1}
                onPress={handleSubmitData}
                isLoading={isSaving}
                isDisabled={selectValue.length >= 4 || selectValue.length <= 0}
              >
                {isSaving ? "Saving..." : t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>
    </Layout>
  );
}
