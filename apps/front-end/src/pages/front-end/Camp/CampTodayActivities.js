import React from "react";

import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
  enumRegistryService,
  campService,
  ImageView,
} from "@shiksha/common-lib";
import {
  Actionsheet,
  Box,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  VStack,
  Image,
  Alert,
  Center,
} from "native-base";
import Drawer from "react-modern-drawer";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "component/BaseInput";
import { useNavigate, useParams } from "react-router-dom";

export default function CampTodayActivities({ footerLinks, setAlert }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [enums, setEnums] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState(null);
  const [selectValue, setSelectValue] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [campList, setCampList] = React.useState([]);
  const [activityId, setActivityId] = React.useState();

  React.useEffect(async () => {
    let result = await campService.getcampstatus({ id });
    let activity_id = result?.data?.id;
    if (!activity_id) {
      result = await campService.getActivity({ id });
      activity_id = result?.data?.id;
    }
    setSelectValue(result?.data?.misc_activities || []);
    setActivityId(activity_id);
    const getListActivities = await campService.getActivitiesList();
    setCampList(getListActivities?.data);
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
      setAlert(t("MISSILINEOUS_SUCCESS_MESSAGE"));
    }
  };

  React.useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const LearningActivitydata = qData?.data;
    setEnumOptions(LearningActivitydata);
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
        <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
          <Pressable onPress={() => navigate(`/camps/${id}/sessionslist`)}>
            <HStack alignItems="center" justifyContent="center" space={3}>
              <HStack>
                <Image
                  source={{
                    uri: "/images/activities/learning-activity.png",
                  }}
                  resizeMode="contain"
                  alignSelf={"center"}
                  p="6"
                  w="100px"
                  h="80px"
                />
              </HStack>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("LEARNING_ACTIVITIES")}
              </FrontEndTypo.H2>
            </HStack>
          </Pressable>
        </CardComponent>
        <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
          <Pressable
            onPress={() => {
              handleActivities("MISCELLANEOUS_ACTIVITIES");
            }}
          >
            <HStack alignItems="center" justifyContent="center" space={3}>
              <HStack>
                <Image
                  source={{
                    uri: "/images/activities/missilaneous-activity.png",
                  }}
                  resizeMode="contain"
                  alignSelf={"center"}
                  p="6"
                  w="100px"
                  h="80px"
                />
              </HStack>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("MISCELLANEOUS_ACTIVITIES")}
              </FrontEndTypo.H2>
            </HStack>
          </Pressable>
        </CardComponent>
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
                  {console.log("newSelected_value", selectValue)}
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
