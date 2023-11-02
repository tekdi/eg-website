import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
} from "@shiksha/common-lib";
import React from "react";
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
// import { useNavigate } from "react-router-dom";

export default function CampTodayActivities({ footerLinks }) {
  // const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);

  return (
    <Layout
      _appBar={{ name: t("Add today's activities") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable onPress={(e) => setIsOpenDropOut(true)}>
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
            <VStack alignItems="center" space={3}>
              <IconByName
                name="BookOpenLineIcon"
                color="gray.600"
                bg="gray.300"
                rounded="100%"
                p="5"
              />
              <FrontEndTypo.H5>View Attendance</FrontEndTypo.H5>
            </VStack>
          </CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
            <Pressable onPress={(e) => setIsOpenDropOut(true)}>
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
            <VStack alignItems="center" space={3}>
              <IconByName
                name="BookOpenLineIcon"
                color="gray.600"
                bg="gray.300"
                rounded="100%"
                p="5"
              />
              <FrontEndTypo.H5>View Attendance</FrontEndTypo.H5>
            </VStack>
          </CardComponent>
        </HStack>
      </VStack>

      <Actionsheet
        isOpen={isOpenDropOut}
        onClose={(e) => setIsOpenDropOut(false)}
      >
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
                onPress={(e) => setIsOpenDropOut(false)}
              />
            </HStack>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg" w="100%">
                <VStack alignItems="center" space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: [{ title: "asda", value: "asd" }]?.map(
                          (e) => ({
                            ...e,
                            label: e?.title,
                            value: e?.value,
                          })
                        ),
                      }}
                      schema={{ grid: 2 }}
                      value={"asd"}
                      onChange={(e) => {}}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  flex={1}
                  onPress={() => {
                    dropoutApiCall();
                  }}
                >
                  {t("SAVE")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>
    </Layout>
  );
}
