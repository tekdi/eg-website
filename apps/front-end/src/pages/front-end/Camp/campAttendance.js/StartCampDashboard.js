import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  t,
  useWindowSize,
} from "@shiksha/common-lib";
import { Box, HStack, ScrollView, Stack, VStack } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StartCampDashboard({ footerLinks }) {
  const [loading, setLoading] = React.useState(true);
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _appBar={{ name: t("Attendance") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <ScrollView
        maxH={Height - refAppBar?.clientHeight}
        minH={Height - refAppBar?.clientHeight}
      >
        <VStack p="5">
          <Box alignContent="center">
            <HStack justifyContent={"space-between"}>
              <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
                {t("WELCOME")} Chaitanya Kole,
              </FrontEndTypo.H1>
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "100px" }}
              />
            </HStack>
          </Box>
          <VStack space="4">
            <FrontEndTypo.H3>Let's Starts your day!!</FrontEndTypo.H3>
            <CardComponent title={"Preferred time"} _header={{ bg: "red.100" }}>
              <VStack space="4">
                <FrontEndTypo.Primarybutton>
                  Start Camp
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton>
                  Apply For Leave
                </FrontEndTypo.Secondarybutton>
              </VStack>
            </CardComponent>
          </VStack>
          <VStack pt="6" space="4">
            <FrontEndTypo.H3>Other Activites,</FrontEndTypo.H3>
            <HStack space="6">
              <VStack alignContent="center">
                <IconByName name="CalendarEventLineIcon" color="gray.300" />
                <FrontEndTypo.H5>View Attendance</FrontEndTypo.H5>
              </VStack>
              <VStack alignContent="center">
                <IconByName name="UserAddLineIcon" color="gray.300" />
                <FrontEndTypo.H5>Add Learner</FrontEndTypo.H5>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Layout>
  );
}
