import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  Loading,
} from "@shiksha/common-lib";
import moment from "moment";
import { CheckCircleIcon, HStack, Icon, Pressable, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const checkNext = (status, updated_at) => {
  return (
    status === "complete" &&
    updated_at &&
    moment.utc(updated_at).format("YYYY-MM-DD") ===
      moment.utc().format("YYYY-MM-DD")
  );
};

export default function CampSessionList({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [sessionList, setSessionList] = React.useState();
  const [sessionActive, setSessionActive] = React.useState();
  const [loading, setLoading] = React.useState(true);

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

    if (!dataSession.status) {
      setSessionActive(dataSession?.ordering);
    } else if (dataSession.status === "incomplete") {
      const result = data.find(
        (item) => item?.ordering === dataSession?.ordering - 1
      );
      if (
        checkNext(
          result?.session_tracks?.[0]?.status,
          result?.session_tracks?.[0]?.updated_at
        )
      ) {
        setSessionActive(dataSession?.ordering - 1);
      } else {
        setSessionActive(dataSession?.ordering);
      }
    } else if (checkNext(dataSession.status, dataSession.updated_at)) {
      setSessionActive(dataSession?.ordering);
    } else {
      setSessionActive(dataSession?.ordering + 1);
    }
    setLoading(false);
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton: (e) => navigate(-1),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("LESSON_LIST")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack flex={1} space={"5"} p="5" background={"bgGreyColor.200"}>
        <HStack space="2">
          <IconByName name="BookOpenLineIcon" />
          <FrontEndTypo.H2 color="textMaroonColor.400">
            {t("LESSON")}
          </FrontEndTypo.H2>
        </HStack>

        {sessionList?.map((item) => (
          <HStack key={item} alignItems={"center"}>
            {item?.session_tracks?.[0]?.status === "complete" && (
              <CheckCircleIcon />
            )}

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
                onPress={(e) =>
                  navigate(`/camps/${id}/sessionslist/${item?.id}`)
                }
                isDisabled={sessionActive !== item?.ordering}
              >
                <HStack justifyContent={"space-between"}>
                  <FrontEndTypo.H2 alignItem="center">
                    {t("LESSON") + " " + item?.ordering}
                  </FrontEndTypo.H2>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    _icon={{ size: "25px" }}
                  />
                </HStack>
              </Pressable>
            </CardComponent>
          </HStack>
        ))}
      </VStack>
    </Layout>
  );
}
