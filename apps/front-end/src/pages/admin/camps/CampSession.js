import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CampSession({ footerLinks }) {
  const { id } = useParams();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = React.useState(true);
  const [enumOptions, setEnumOptions] = React.useState({});

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

  const startCamp = async (session_id) => {
    setIsDisable(true);
    const data = await campService.creatCampSession({
      learning_lesson_plan_id: session_id,
      camp_id: id,
    });
    console.log({ data });
    await getData();
  };

  console.log({ sessionDetails });
  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{"पाठ्यक्रम सूची"}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      {sessionDetails?.map((item, i) => (
        <SessionCard
          startCamp={startCamp}
          item={item}
          previusItem={sessionDetails?.[i - 1]}
          isDisable={isDisable}
          setIsDisable={setIsDisable}
          enumOptions={enumOptions}
          sessionDetails={sessionDetails}
        />
      ))}
    </Layout>
  );
}

export function SessionCard({
  enumOptions,
  startCamp,
  item,
  previusItem,
  sessionDetails,
}) {
  const [submitStatus, setSubmitStatus] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);

  const handleStartSession = async (id) => {
    setIsDisable(true);
    await startCamp(id);
    setIsDisable(false);
  };

  return (
    <VStack flex={1} space={"5"} p="5" background={"bgGreyColor.200"}>
      <CardComponent
        children={
          <VStack p="5" space="4">
            <VStack alignItems="center">
              <FrontEndTypo.H3
                alignContent={"Center"}
                color="textMaroonColor.400"
                bold
              >
                {item?.title}
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
                isDisable={
                  !previusItem ||
                  previusItem?.session_tracks?.[0]?.status === "complete" ||
                  isDisable
                }
                onPress={() => startCamp(item?.id)}
              >
                सत्र शुरू किया?
              </FrontEndTypo.DefaultButton>
            ) : item?.session_tracks?.[0]?.status !== "complete" ? (
              <VStack space="4">
                <VStack>
                  <FrontEndTypo.DefaultButton
                    background={"#FF0000"}
                    onPress={(e) => setSubmitStatus("completed")}
                  >
                    पाठ्यक्रम पूरा हो गया
                  </FrontEndTypo.DefaultButton>
                  {submitStatus === "completed" && (
                    <VStack bg="red.100 ">
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
                        value={
                          sessionDetails?.data
                            ?.learning_lesson_plans_master?.[0]
                            ?.session_tracks?.[0]?.lesson_plan_complete_feedback
                        }
                        // onChange={(e) => {
                        //   setReasonValue(e);
                        // }}
                      />
                      <HStack>
                        <FrontEndTypo.Primarybutton
                          onPress={(e) => setSubmitStatus()}
                        >
                          cancel
                        </FrontEndTypo.Primarybutton>
                        <FrontEndTypo.Primarybutton>
                          save
                        </FrontEndTypo.Primarybutton>
                      </HStack>
                    </VStack>
                  )}
                </VStack>

                <VStack>
                  <FrontEndTypo.DefaultButton
                    onPress={(e) => setSubmitStatus("incompleted")}
                    textColor={"textMaroonColor.400"}
                  >
                    पाठ आधा पूरा हुआ
                  </FrontEndTypo.DefaultButton>
                  {submitStatus === "incompleted" && (
                    <VStack bg="red.100 ">
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
                        value={
                          sessionDetails?.data
                            ?.learning_lesson_plans_master?.[0]
                            ?.session_tracks?.[0]
                            ?.lesson_plan_incomplete_feedback
                        }
                        // onChange={(e) => {
                        //   setReasonValue(e);
                        // }}
                      />
                      <HStack>
                        <FrontEndTypo.Primarybutton
                          onPress={(e) => setSubmitStatus()}
                        >
                          cancel
                        </FrontEndTypo.Primarybutton>
                        <FrontEndTypo.Primarybutton>
                          save
                        </FrontEndTypo.Primarybutton>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              </VStack>
            ) : (
              <FrontEndTypo.DefaultButton background={"green.500"}>
                पाठ्यक्रम पूरा हो गया
              </FrontEndTypo.DefaultButton>
            )}
          </VStack>
        }
      />
    </VStack>
  );
}
