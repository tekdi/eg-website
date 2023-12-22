import React from "react";
import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  CustomRadio,
} from "@shiksha/common-lib";
import { Alert, HStack, VStack } from "native-base";

const StartSessionButton = ({ onPress, isDisabled, t }) => (
  <FrontEndTypo.DefaultButton
    textColor={"textMaroonColor.400"}
    icon={
      <IconByName
        name="ArrowRightLineIcon"
        _icon={{
          color: "textMaroonColor.400",
          size: "25px",
        }}
      />
    }
    isDisabled={isDisabled}
    onPress={onPress}
  >
    {t("SESSION_STARTED")}
  </FrontEndTypo.DefaultButton>
);

const CompleteButton = ({ onPress, t }) => (
  <FrontEndTypo.DefaultButton
    borderWidth="0"
    background={"textMaroonColor.500"}
    onPress={onPress}
  >
    {t("SYLLABUS_COMPLETED")}
  </FrontEndTypo.DefaultButton>
);

const IncompleteButton = ({ onPress, t }) => (
  <FrontEndTypo.DefaultButton
    borderColor="red.400"
    borderWidth="1"
    textColor="textMaroonColor.400"
    background=""
    onPress={onPress}
  >
    {t("SYLLABUS_INCOMPLETED")}
  </FrontEndTypo.DefaultButton>
);

const SessionFeedback = ({
  t,
  submitStatus,
  setSubmitStatus,
  enumOptions,
  error,
  isDisable,
  handleCancel,
  handlePartiallyDone,
}) => (
  <CardComponent title={t("HOW_WAS_SESSION")}>
    <VStack space="4">
      <CustomRadio
        options={{
          enumOptions: enumOptions?.SESSION_COMPLETED?.map((e) => ({
            ...e,
            label: e?.title,
            value: e?.value,
          })),
        }}
        schema={{ grid: 1, _pressable: { p: 2 } }}
        value={submitStatus?.reason}
        onChange={(e) => setSubmitStatus({ ...submitStatus, reason: e })}
      />
      {error && <Alert status="warning">{t(error)}</Alert>}
      <HStack space={4}>
        <FrontEndTypo.DefaultButton
          flex="1"
          textColor={"textMaroonColor.400"}
          isDisabled={isDisable}
          onPress={(e) => handleCancel()}
        >
          {t("CANCEL")}
        </FrontEndTypo.DefaultButton>
        <FrontEndTypo.DefaultButton
          flex="1"
          textColor={"textMaroonColor.400"}
          isDisabled={isDisable}
          onPress={(e) => handlePartiallyDone(submitStatus?.id)}
        >
          {t("SAVE")}
        </FrontEndTypo.DefaultButton>
      </HStack>
    </VStack>
  </CardComponent>
);

const SessionActions = ({
  sessionDetails,
  isDisable,
  handleStartSession,
  handleCompleteButton,
  handlePartiallyDone,
  setSubmitStatus,
  submitStatus,
  enumOptions,
  error,
  t,
}) => {
  return (
    <>
      {!["incomplete", "complete"].includes(
        sessionDetails?.session_tracks?.[0]?.status
      ) ? (
        <StartSessionButton
          onPress={() => handleStartSession(sessionDetails?.id)}
          isDisabled={sessionDetails?.session_tracks?.[0] || isDisable}
          t={t}
        />
      ) : (
        <VStack space={4}>
          {handleCompleteButton() && (
            <CompleteButton
              onPress={() => setSubmitStatus({ status: "complete" })}
              t={t}
            />
          )}
          {submitStatus?.status === "complete" && (
            <SessionFeedback
              t={t}
              submitStatus={submitStatus}
              setSubmitStatus={setSubmitStatus}
              enumOptions={enumOptions}
              error={error}
              isDisable={isDisable}
              handleCancel={() => setSubmitStatus({})}
              handlePartiallyDone={(id) => handlePartiallyDone(id)}
            />
          )}

          {sessionDetails?.session_tracks?.[0]?.status === "incomplete" &&
            submitStatus?.status !== "complete" && (
              <IncompleteButton
                onPress={() => setSubmitStatus({ status: "incomplete" })}
                t={t}
              />
            )}
          {submitStatus?.status === "incomplete" && (
            <VStack space={4} p="4">
              <CustomRadio
                options={{
                  enumOptions: enumOptions?.SESSION_PARTIALLY_COMPLETE?.map(
                    (e) => ({
                      ...e,
                      label: e?.title,
                      value: e?.value,
                    })
                  ),
                }}
                schema={{ grid: 1, _pressable: { p: 2 } }}
                value={submitStatus?.reason}
                onChange={(e) =>
                  setSubmitStatus({ ...submitStatus, reason: e })
                }
              />
              {error && <Alert status="warning">{t(error)}</Alert>}
              <HStack space={4}>
                <FrontEndTypo.DefaultButton
                  flex="1"
                  textColor={"textMaroonColor.400"}
                  isDisabled={isDisable}
                  onPress={() => setSubmitStatus({})}
                >
                  {t("CANCEL")}
                </FrontEndTypo.DefaultButton>
                <FrontEndTypo.DefaultButton
                  flex="1"
                  textColor={"textMaroonColor.400"}
                  isDisabled={isDisable}
                  onPress={() => handlePartiallyDone(submitStatus?.id)}
                >
                  {t("SAVE")}
                </FrontEndTypo.DefaultButton>
              </HStack>
            </VStack>
          )}
        </VStack>
      )}
    </>
  );
};

export default SessionActions;
