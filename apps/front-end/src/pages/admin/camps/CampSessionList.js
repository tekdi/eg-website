import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, Pressable, VStack } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CampSessionList({ footerLinks }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sessionList, setSessionList] = React.useState();
  const [sessionActive, setSessionActive] = React.useState();

  React.useEffect(async () => {
    const result = await campService.getCampSessionsList({ id: id });
    const data = result?.data?.learning_lesson_plans_master || [];
    setSessionList(data);
    let dataSession;
    data.forEach((e, i) => {
      if (!i || e.session_tracks?.[0]?.status) {
        dataSession = {
          ...(e.session_tracks?.[0] || {}),
          ordering: e.ordering,
        };
      }
    });
    if (
      dataSession.status === "complete" &&
      dataSession.updated_at &&
      moment(dataSession.updated_at).format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
    ) {
      setSessionActive(dataSession?.ordering);
    }
    if (dataSession.status === "incomplete") {
      const result = data.find(
        (item) => item?.ordering === dataSession?.ordering - 1
      );
      if (
        result?.session_tracks?.[0]?.status === "complete" &&
        result?.session_tracks?.[0]?.updated_at &&
        moment(result?.session_tracks?.[0]?.updated_at).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD")
      ) {
        setSessionActive(dataSession?.ordering - 1);
      } else {
        setSessionActive(dataSession?.ordering);
      }
    } else {
      setSessionActive(dataSession?.ordering + 1);
    }
  }, []);

  return (
    <Layout
      _appBar={{
        onPressBackButton: (e) => navigate(-1),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{"पाठ्यक्रम सूची"}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack flex={1} space={"5"} p="5" background={"bgGreyColor.200"}>
        <HStack space="2">
          <IconByName name="BookOpenLineIcon" />
          <FrontEndTypo.H2 color="textMaroonColor.400">
            पाठ्यक्रम
          </FrontEndTypo.H2>
        </HStack>

        {sessionList?.map((item) => (
          <CardComponent
            key={item?.id}
            _header={{ px: "0", pt: "0" }}
            _body={{
              px: "4",
              py: "2",
              // pt: "0",
              bg: sessionActive !== item?.ordering ? "gray.100" : "white",
            }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={(e) => navigate(`/camps/${id}/sessionslist/${item?.id}`)}
              isDisabled={sessionActive !== item?.ordering}
            >
              <HStack justifyContent={"space-between"}>
                <FrontEndTypo.H2 alignItem="center">
                  {"Session" + " " + item?.ordering}
                </FrontEndTypo.H2>

                <IconByName
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "25px" }}
                />
              </HStack>
            </Pressable>
          </CardComponent>
        ))}
      </VStack>
    </Layout>
  );
}
