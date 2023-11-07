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
  // const navigate = useNavigate();
  const { t } = useTranslation();
  const [enums, setEnums] = React.useState();
  // console.log(enums);

  const [enumOptions, setEnumOptions] = React.useState(null);
  const [selectValue, setSelectValue] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [campActivities, setCampActivities] = React.useState(null);
  const [campList, setCampList] = React.useState([]);

  React.useEffect(() => {
    async function fetchCampActivities() {
      try {
        const activities_response = await campService.getCampActivities();
        setCampActivities(activities_response);
      } catch (e) {
        console.warn("error", e);
      }
    }
    fetchCampActivities();
  }, []);

  React.useEffect(async () => {
    const getListActivities = await campService.getActivitiesList();
    setCampList(getListActivities?.data?.activities);
    console.log("getList_activities", getListActivities?.data?.activities);
  }, []);

  const dataToSave = {
    user_id: campList?.user_id,
    type: campList?.type,
    academic_year_id: campList?.academic_year_id,
    program_id: campList?.program_id,
    activity_data: campList?.activity_data,
    selectedValues: selectValue,
  };
  console.log("dataToSave", dataToSave);

  const handleSubmitData = async () => {
    try {
      setIsSaving(true);

      setSelectValue([dataToSave]);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const LearningActivitydata = qData?.data;
    setEnumOptions(LearningActivitydata);
  }, []);

  return (
    <Layout
      _appBar={{ name: t("Add today's activities") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      {/* {console.log("campList", campList)} */}
      <VStack p="4" space={4}>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={() => setEnums(enumOptions?.LEARNING_ACTIVITIES || null)}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="CalendarEventLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H5>Today's Activities</FrontEndTypo.H5>
              </VStack>
            </Pressable>
          </CardComponent>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={(e) =>
                setEnums(enumOptions?.LIVELIHOOD_AWARENESS || null)
              }
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="BookOpenLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H5>Livelihood Awareness</FrontEndTypo.H5>
              </VStack>
            </Pressable>
          </CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={(e) => setEnums(enumOptions?.COMMUNITY_ENGAGEMENT || [])}
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="CalendarEventLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H5>Community Engagement</FrontEndTypo.H5>
              </VStack>
            </Pressable>
          </CardComponent>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable
              onPress={(e) =>
                setEnums(enumOptions?.OPEN_SCHOOL_GOVERNMENT_ACTIVITY || null)
              }
            >
              <VStack alignItems="center" space={3}>
                <IconByName
                  name="BookOpenLineIcon"
                  color="gray.600"
                  bg="gray.300"
                  rounded="100%"
                  p="5"
                />
                <FrontEndTypo.H5>
                  Open School/Government Activity
                </FrontEndTypo.H5>
              </VStack>
            </Pressable>
          </CardComponent>
        </HStack>
      </VStack>

      <Actionsheet isOpen={enums} onClose={(e) => setEnums()}>
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
                        enumOptions: enums || [],
                      }}
                      schema={{
                        grid: 1,
                      }}
                      onChange={(newSelectValue) => {
                        setSelectValue(newSelectValue);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  flex={1}
                  onPress={isSaving ? null : handleSubmitData}
                  isLoading={isSaving}
                >
                  {isSaving ? "Saving..." : t("Save")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>
    </Layout>
  );
}
