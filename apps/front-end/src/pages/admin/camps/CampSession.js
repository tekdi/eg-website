import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import { Alert, HStack, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampSession({ footerLinks }) {
  const { id } = useParams();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = React.useState(true);
  const [enumOptions, setEnumOptions] = React.useState({});
  const { t } = useTranslation();

  const [sessionDetails, setSessionDetails] = React.useState();

  const getData = async () => {
    const result = await campService.getCampSession({
      id: sessionId,
      camp_id: id,
    });
    setSessionDetails(result?.data);
  };

  React.useEffect(async () => {
    await getData();
    const enumData = await enumRegistryService.listOfEnum();
    setEnumOptions(enumData?.data ? enumData?.data : {});
  }, []);

  const onPressBackButton = () => {
    if (isDisable === false) {
      setIsDisable(true);
    } else {
      navigate(-1);
    }
  };

  const startSession = async (session_id) => {
    setIsDisable(true);
    const data = await campService.creatCampSession({
      learning_lesson_plan_id: session_id,
      camp_id: id,
    });
    console.log({ data });
    await getData();
  };

  const partiallyDoneSession = async ({ id, status, reason }) => {
    setIsDisable(true);

    await campService.updateCampSession({
      id,
      edit_session_type:
        status === "complete"
          ? "edit_complete_session"
          : "edit_incomplete_session",
      session_feedback: reason,
    });
    await getData();
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("LESSON_LIST")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      {sessionDetails?.map(
        (item, i) =>
          item?.id && (
            <SessionCard
              index={i}
              key={item?.id}
              startSession={startSession}
              partiallyDoneSession={partiallyDoneSession}
              item={item}
              previusItem={sessionDetails?.[i - 1]}
              isDisable={isDisable}
              setIsDisable={setIsDisable}
              enumOptions={enumOptions}
              sessionDetails={sessionDetails}
              t={t}
            />
          )
      )}
    </Layout>
  );
}

export function SessionCard({
  enumOptions,
  startSession,
  partiallyDoneSession,
  item,
  previusItem,
  index,
  t,
}) {
  const [submitStatus, setSubmitStatus] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const [error, setError] = React.useState();

  const handleStartSession = async (id) => {
    setIsDisable(true);
    await startSession(id);
    setIsDisable(false);
  };

  const handlePartiallyDone = async (id) => {
    setError();
    setIsDisable(true);
    if (submitStatus?.reason) {
      await partiallyDoneSession({ ...submitStatus, id });
      setSubmitStatus();
    } else {
      setError("PLEASE_SELECT");
    }
    setIsDisable(false);
  };

  const handaleCancel = () => {
    setError();
    setSubmitStatus();
  };

  return (
    <VStack flex={1} space={"5"} p="5" background={"bgGreyColor.200"}>
      <CardComponent>
        <VStack p="5" space="4">
          <VStack alignItems="center">
            <FrontEndTypo.H3
              alignContent={"Center"}
              color="textMaroonColor.400"
              bold
            >
              {t("LESSON")} {index + 1}
            </FrontEndTypo.H3>
          </VStack>

          {!["incomplete", "complete"].includes(
            item?.session_tracks?.[0]?.status
          ) ? (
            <FrontEndTypo.DefaultButton
              textColor={"textMaroonColor.400"}
              icon={
                <IconByName
                  name="ArrowRightLineIcon"
                  _icon={{ color: "textMaroonColor.400", size: "25px" }}
                />
              }
              isDisabled={
                (index !== 0 &&
                  previusItem?.session_tracks?.[0]?.status !== "complete") ||
                isDisable
              }
              onPress={() => handleStartSession(item?.id)}
            >
              सत्र शुरू किया?
            </FrontEndTypo.DefaultButton>
          ) : item?.session_tracks?.[0]?.status !== "complete" ? (
            <VStack space="4">
              {(!submitStatus?.status || submitStatus?.status === "complete") &&
                (!previusItem?.session_tracks?.[0]?.status ||
                  (previusItem?.session_tracks?.[0]?.status === "complete" &&
                    previusItem?.session_tracks?.[0]?.updated_at &&
                    moment(previusItem?.session_tracks?.[0]?.updated_at).format(
                      "YYYY-MM-DD"
                    ) !== moment().format("YYYY-MM-DD"))) && (
                  <VStack space="4">
                    <FrontEndTypo.DefaultButton
                      borderWidth="0"
                      background={"#FF0000"}
                      onPress={(e) => setSubmitStatus({ status: "complete" })}
                    >
                      {t("SYLLABUS_COMPLETED")}
                    </FrontEndTypo.DefaultButton>
                    {submitStatus?.status === "complete" && (
                      <CardComponent title={t("HOW_WAS_SESSION")}>
                        <VStack space="4">
                          <CustomRadio
                            options={{
                              enumOptions: enumOptions?.SESSION_COMPLETED?.map(
                                (e) => ({
                                  ...e,
                                  label: e?.title,
                                  value: e?.value,
                                })
                              ),
                            }}
                            schema={{ grid: 1 }}
                            value={submitStatus?.reason}
                            onChange={(e) => {
                              setSubmitStatus({ ...submitStatus, reason: e });
                            }}
                          />

                          {error && <Alert status="warning">{t(error)}</Alert>}
                          <HStack space={4}>
                            <FrontEndTypo.DefaultButton
                              flex="1"
                              textColor={"textMaroonColor.400"}
                              isDisabled={isDisable}
                              onPress={(e) => handaleCancel()}
                            >
                              {t("CANCEL")}
                            </FrontEndTypo.DefaultButton>
                            <FrontEndTypo.DefaultButton
                              flex="1"
                              textColor={"textMaroonColor.400"}
                              isDisabled={isDisable}
                              onPress={(e) =>
                                handlePartiallyDone(
                                  item?.session_tracks?.[0]?.id
                                )
                              }
                            >
                              {t("SAVE")}
                            </FrontEndTypo.DefaultButton>
                          </HStack>
                        </VStack>
                      </CardComponent>
                    )}
                  </VStack>
                )}
              {(!submitStatus?.status ||
                submitStatus?.status === "incomplete") && (
                <VStack space={4}>
                  <FrontEndTypo.DefaultButton
                    onPress={(e) => setSubmitStatus({ status: "incomplete" })}
                    textColor={
                      item?.session_tracks?.[0]?.status === "incomplete" &&
                      item?.session_tracks?.[0]?.updated_at &&
                      moment(item?.session_tracks?.[0]?.updated_at).format(
                        "YYYY-MM-DD"
                      ) === moment().format("YYYY-MM-DD")
                        ? "white"
                        : "textMaroonColor.400"
                    }
                    borderWidth={
                      item?.session_tracks?.[0]?.status === "incomplete" &&
                      item?.session_tracks?.[0]?.updated_at &&
                      moment(item?.session_tracks?.[0]?.updated_at).format(
                        "YYYY-MM-DD"
                      ) === moment().format("YYYY-MM-DD")
                        ? "0"
                        : "1"
                    }
                    borderColor="red.400"
                    background={
                      item?.session_tracks?.[0]?.status === "incomplete" &&
                      item?.session_tracks?.[0]?.updated_at &&
                      moment(item?.session_tracks?.[0]?.updated_at).format(
                        "YYYY-MM-DD"
                      ) === moment().format("YYYY-MM-DD")
                        ? "yellow.500"
                        : ""
                    }
                  >
                    {t("SYLLABUS_INCOMPLETED")}
                  </FrontEndTypo.DefaultButton>
                  {submitStatus?.status === "incomplete" && (
                    <VStack space={4}>
                      <CustomRadio
                        options={{
                          enumOptions:
                            enumOptions?.SESSION_PARTIALLY_COMPLETE?.map(
                              (e) => ({
                                ...e,
                                label: e?.title,
                                value: e?.value,
                              })
                            ),
                        }}
                        schema={{ grid: 1 }}
                        value={submitStatus?.reason}
                        onChange={(e) => {
                          setSubmitStatus({ ...submitStatus, reason: e });
                        }}
                      />
                      {error && <Alert status="warning">{t(error)}</Alert>}
                      <HStack space={4}>
                        <FrontEndTypo.DefaultButton
                          flex="1"
                          textColor={"textMaroonColor.400"}
                          isDisabled={isDisable}
                          onPress={(e) => handaleCancel()}
                        >
                          {t("CANCEL")}
                        </FrontEndTypo.DefaultButton>
                        <FrontEndTypo.DefaultButton
                          flex="1"
                          textColor={"textMaroonColor.400"}
                          isDisabled={isDisable}
                          onPress={(e) =>
                            handlePartiallyDone(item?.session_tracks?.[0]?.id)
                          }
                        >
                          {t("SAVE")}
                        </FrontEndTypo.DefaultButton>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              )}
            </VStack>
          ) : (
            <FrontEndTypo.DefaultButton
              borderWidth="0"
              background={"green.500"}
            >
              {t("SYLLABUS_COMPLETED")}
            </FrontEndTypo.DefaultButton>
          )}
        </VStack>
      </CardComponent>
    </VStack>
  );
}
