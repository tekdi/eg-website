import React, { useState } from "react";
import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  CustomRadio,
} from "@shiksha/common-lib";
import { Alert, HStack, Pressable, VStack } from "native-base";
import { useTranslation } from "react-i18next";

// const StartSessionButton = ({ onPress, isDisabled, t }) => (
//   <FrontEndTypo.DefaultButton
//     textColor={"textMaroonColor.400"}
//     icon={
//       <IconByName
//         name="ArrowRightLineIcon"
//         _icon={{
//           color: "textMaroonColor.400",
//           size: "25px",
//         }}
//       />
//     }
//     isDisabled={isDisabled}
//     onPress={onPress}
//   >
//     {t("SESSION_STARTED")}
//   </FrontEndTypo.DefaultButton>
// );

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
      {error && (
        <Alert status="warning">
          {React.isValidElement(error) ? error : t(error)}
        </Alert>
      )}
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
  isDisable,
  // handleStartSession,
  sessionActive,
  handlePartiallyDone,
  setSubmitStatus,
  submitStatus,
  enumOptions,
  handleCancel,
  error,
}) => {
  const { t } = useTranslation();
  const [buttonHide, setButtonHide] = React.useState();

  React.useEffect(() => {
    if (sessionActive) {
      let btn = [];
      if (
        !["complete", "incomplete"].includes(sessionActive?.status) &&
        sessionActive?.ordering === 1
      ) {
        if (submitStatus?.status) {
          btn = [submitStatus?.status];
        } else {
          btn = ["incomplete", "complete"];
        }
      }

      if (
        sessionActive?.countSession < 1.5 &&
        submitStatus?.status !== "complete"
      ) {
        btn = [...btn, "incomplete"];
      }
      if (
        ((sessionActive?.status === "incomplete" &&
          sessionActive?.countSession < 1.5) ||
          (!sessionActive?.status && sessionActive?.countSession < 1)) &&
        submitStatus?.status !== "incomplete"
      ) {
        btn = [...btn, "complete"];
      }
      setButtonHide(btn);
    }
  }, [sessionActive, submitStatus]);

  return (
    <VStack>
      {/* {!["incomplete", "complete"].includes(
        sessionDetails?.session_tracks?.[0]?.status
      ) ? (
        <StartSessionButton
          onPress={() => handleStartSession(sessionDetails?.id)}
          isDisabled={sessionDetails?.session_tracks?.[0] || isDisable}
          t={t}
        />
      ) : ( */}
      <VStack space={4}>
        {buttonHide?.includes("complete") && (
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
            handleCancel={handleCancel}
            handlePartiallyDone={(id) => handlePartiallyDone(id)}
          />
        )}

        {buttonHide?.includes("incomplete") && (
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
              onChange={(e) => setSubmitStatus({ ...submitStatus, reason: e })}
            />
            {error && (
              <Alert status="warning">
                {React.isValidElement(error) ? error : t(error)}
              </Alert>
            )}
            <HStack space={4}>
              <FrontEndTypo.DefaultButton
                flex="1"
                textColor={"textMaroonColor.400"}
                isDisabled={isDisable}
                onPress={handleCancel}
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
      {/* )} */}
    </VStack>
  );
};

export default React.memo(SessionActions);

export const SessionList = React.memo(
  ({ sessionList, sessionActive, setModalVisible }) => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(true);

    // Separate completed and incomplete sessions
    const completedSessions = sessionList?.filter(
      (item) => item?.session_tracks?.[0]?.status === "complete"
    );

    const incompleteSessions = sessionList?.filter(
      (item) => item?.session_tracks?.[0]?.status !== "complete"
    );

    return (
      <VStack flex={1} space={"5"}>
        {completedSessions?.length > 0 && (
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <CardComponent
              _header={{ px: "0", pt: "0" }}
              _body={{
                px: "4",
                py: "3",
                pb: "3",
                roundedTop: "10px",
                bg: "gray.100",
              }}
              _vstack={{ p: 0, space: 0, flex: 1 }}
            >
              <HStack justifyContent={"space-between"}>
                <HStack space="4" alignItems={"center"}>
                  <IconByName
                    name="CheckboxCircleFillIcon"
                    color="greenIconColor"
                    _icon={{ size: "24px" }}
                  />
                  <FrontEndTypo.H2 alignItem="center">
                    {t("COMPLETED_SESSIONS")}
                  </FrontEndTypo.H2>
                </HStack>
                <IconByName
                  alignContent={"right"}
                  name={collapsed ? "ArrowDownSLineIcon" : "ArrowUpSLineIcon"}
                  _icon={{ size: "25px" }}
                />
              </HStack>
            </CardComponent>
          </Pressable>
        )}
        {completedSessions?.length > 0 &&
          !collapsed &&
          completedSessions?.map((item) => (
            <Pressable
              onPress={async () => await setModalVisible(item?.id)}
              isDisabled={sessionActive?.ordering !== item?.ordering}
              key={item?.id}
            >
              <CardComponent
                _header={{ px: "0", pt: "0" }}
                _body={{
                  px: "4",
                  py: "3",
                  pb: "3",
                  roundedTop: "10px",
                  bg: "white",
                }}
                _vstack={{ p: 0, space: 0, flex: 1 }}
              >
                <HStack justifyContent={"space-between"}>
                  <HStack space="4" alignItems={"center"}>
                    <IconByName
                      name="CheckboxCircleFillIcon"
                      color="greenIconColor"
                      _icon={{ size: "24px" }}
                    />
                    <FrontEndTypo.H2 alignItem="center">
                      {t("SESSION") + " " + item?.ordering}
                    </FrontEndTypo.H2>
                  </HStack>
                  <IconByName
                    alignContent={"right"}
                    name="ArrowRightSLineIcon"
                    _icon={{ size: "25px" }}
                  />
                </HStack>
              </CardComponent>
            </Pressable>
          ))}
        {incompleteSessions?.map((item) => (
          <Pressable
            onPress={async () => await setModalVisible(item?.id)}
            isDisabled={sessionActive?.ordering !== item?.ordering}
            key={item?.id}
          >
            <CardComponent
              _header={{ px: "0", pt: "0" }}
              _body={{
                px: "4",
                py: "3",
                pb: "3",
                roundedTop: "10px",
                bg:
                  sessionActive?.ordering !== item?.ordering
                    ? "gray.100"
                    : "white",
              }}
              _vstack={{ p: 0, space: 0, flex: 1 }}
            >
              <HStack justifyContent={"space-between"}>
                <HStack space="4" alignItems={"center"}>
                  {item?.session_tracks?.[0]?.status === "complete" && (
                    <IconByName
                      name="CheckboxCircleFillIcon"
                      color="greenIconColor"
                      _icon={{ size: "24px" }}
                    />
                  )}
                  {item?.session_tracks?.[0]?.status === "incomplete" && (
                    <IconByName
                      color="warningColor"
                      name="TimeFillIcon"
                      _icon={{ size: "24px" }}
                    />
                  )}

                  <FrontEndTypo.H2
                    alignItem="center"
                    color="floatingLabelColor.500"
                  >
                    {t("SESSION") + " " + item?.ordering}
                  </FrontEndTypo.H2>
                </HStack>
                <IconByName
                  alignContent={"right"}
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "25px" }}
                />
              </HStack>
            </CardComponent>
          </Pressable>
        ))}
      </VStack>
    );
  }
);
