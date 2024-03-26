import React, { Suspense, useEffect, useState } from "react";

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
  campType,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [enums, setEnums] = useState();
  const [enumOptions, setEnumOptions] = useState(null);
  const [selectValue, setSelectValue] = useState([]);
  const [miscActivities, setMiscActivities] = useState([]);
  const [activitiesValue, setActivitiesValue] = useState(false);
  const [isSaving] = useState(false);
  const [sessionList, setSessionList] = useState(false);

  useEffect(async () => {
    getActivity();
  }, []);

  const getActivity = async () => {
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getActivity(obj);
    console.log("53", result);

    if (result?.data?.camp_days_activities_tracker?.[0]?.misc_activities) {
      setSelectValue(
        result?.data?.camp_days_activities_tracker?.[0]?.misc_activities || []
      );
      setActivitiesValue(true);
      setMiscActivities(
        result?.data?.camp_days_activities_tracker?.[0]?.misc_activities || []
      );
    } else {
      setActivitiesValue(false);
    }
  };

  const handleSubmitData = async () => {
    const dataToSave = {
      edit_page_type: "edit_misc_activities",
      id: activityId,
      misc_activities: selectValue,
    };
    const activities_response = await campService.addMoodActivity(dataToSave);
    console.log({ activities_response });
    if (activities_response) {
      getActivity();
      setEnums();
      setAlert({ type: "success", title: t("MISSILINEOUS_SUCCESS_MESSAGE") });
    }
  };

  useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const LearningActivitydata = qData?.data;
    setEnumOptions(LearningActivitydata);
    const result = await campService.getCampSessionsList({ id: id });
    const data = result?.data?.learning_lesson_plans_master || [];
    data.forEach((element) => {
      const currentDate = new Date();
      const createdAtDate = new Date(element?.session_tracks?.[0]?.created_at);
      const updatedDate = new Date(element?.session_tracks?.[0]?.updated_at);
      if (
        currentDate.toDateString() === createdAtDate.toDateString() ||
        (currentDate.toDateString() === updatedDate.toDateString() &&
          element?.session_tracks?.[0]?.status === "complete")
      ) {
        setSessionList(true);
      }
    });
  }, []);

  const handleActivities = async (item) => {
    const data = enumOptions && enumOptions[item] ? enumOptions[item] : null;
    setEnums({ type: item, data });
  };

  const handleClose = () => {
    if (!activitiesValue) {
      setSelectValue([]);
    } else {
      setSelectValue(miscActivities);
    }
    setEnums();
  };

  console.log({ campType });
  return (
    <Layout
      _appBar={t("ADD_TODAYS_ACTIVITIES")}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        {campType?.type === "main" && (
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
        )}
        <CardComponent
          _vstack={{
            flex: 1,
            borderColor: activitiesValue && "greenIconColor",
          }}
          _body={{ pl: 8, pt: 4 }}
        >
          <Pressable
            onPress={() => {
              campType?.type === "main"
                ? handleActivities("MISCELLANEOUS_ACTIVITIES")
                : handleActivities("PCR_MISCELLANEOUS_ACTIVITIES");
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
                {campType?.type === "main"
                  ? t("MISCELLANEOUS_ACTIVITIES")
                  : t("PCR_ACTIVITIES")}
              </FrontEndTypo.H2>
              {activitiesValue && (
                <IconByName
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "36" }}
                  color="successColor"
                />
              )}
            </HStack>
          </Pressable>
        </CardComponent>

        {(activitiesValue || sessionList) === true && (
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
                onPress={(e) => handleClose()}
              />
            </HStack>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="2" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <Suspense fallback={<HStack>Loading...</HStack>}>
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
                </Suspense>
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
                isDisabled={
                  selectValue?.length >= 4 || selectValue?.length <= 0
                }
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
