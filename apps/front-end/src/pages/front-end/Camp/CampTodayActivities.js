import React from "react";

import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
  enumRegistryService,
  campService,
} from "@shiksha/common-lib";
import {
  Actionsheet,
  Box,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import Drawer from "react-modern-drawer";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "component/BaseInput";

export default function CampTodayActivities({ footerLinks }) {
  const { t } = useTranslation();
  const [enums, setEnums] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState(null);
  const [selectValue, setSelectValue] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [campList, setCampList] = React.useState([]);

  React.useEffect(async () => {
    const getListActivities = await campService.getActivitiesList();
    setCampList(getListActivities?.data);
  }, []);

  const handleSubmitData = async () => {
    console.log("enums_type", enums.type);
  };

  React.useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const LearningActivitydata = qData?.data;
    setEnumOptions(LearningActivitydata);
  }, []);

  const handleActivities = async (item) => {
    const dataToSave = {
      user_id: 1077,
      type: item,
      activity_data: [selectValue],
    };
    const activities_response = await campService.getActivitiesList(dataToSave);
    console.log({ activities_response });
    const data = enumOptions && enumOptions[item] ? enumOptions[item] : null;
    setEnums({ type: item, data });
  };

  return (
    <Layout
      _appBar={t("ADD_TODAYS_ACTIVITIES")}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={() => {
                handleActivities("LEARNING_ACTIVITIES");
              }}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="CalendarEventLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H4>{t("TODAYS_ACTIVITIES")}</FrontEndTypo.H4>
              </VStack>
            </Pressable>
          </CardComponent>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={() => {
                handleActivities("LIVELIHOOD_AWARENESS");
              }}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="BookOpenLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H4>{t("LIVELIHOOD_AWARENESS")}</FrontEndTypo.H4>
              </VStack>
            </Pressable>
          </CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={() => {
                handleActivities("COMMUNITY_ENGAGEMENT");
              }}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="CalendarEventLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H4>{t("COMMUNITY_ENGAGEMENT")}</FrontEndTypo.H4>
              </VStack>
            </Pressable>
          </CardComponent>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={() => {
                handleActivities("OPEN_SCHOOL_GOVERNMENT_ACTIVITY");
              }}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="BookOpenLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H4>
                  {t("OPEN_SCHOOL_GOVERNMENT_ACTIVITY")}
                </FrontEndTypo.H4>
              </VStack>
            </Pressable>
          </CardComponent>
        </HStack>
      </VStack>

      <Actionsheet isOpen={enums?.data} onClose={(e) => setEnums()}>
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <HStack
              width={"100%"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <FrontEndTypo.H1 bold color="textGreyColor.450">
                {t("AG_PROFILE_ARE_YOU_SURE")}
              </FrontEndTypo.H1>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setEnums()}
              />
            </HStack>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
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
                <FrontEndTypo.Primarybutton
                  flex={1}
                  onPress={handleSubmitData}
                  isLoading={isSaving}
                >
                  {isSaving ? "Saving..." : t("SAVE")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>
    </Layout>
  );
}
