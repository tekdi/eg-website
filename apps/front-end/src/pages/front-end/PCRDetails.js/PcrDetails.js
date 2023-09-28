import {
  FrontEndTypo,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
} from "@shiksha/common-lib";
import React, { useState } from "react";
import { VStack, Select, CheckIcon, Box, ScrollView } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PcrDetails = () => {
  const [status, setStatus] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectBaselineData, setselectBaselineData] = useState();
  const [selectRapidData, setselectRapidData] = useState();

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setselectBaselineData(result?.data?.PCR_SCORES_BASELINE_AND_ENDLINE);
    setselectRapidData(result?.data?.PCR_SCORES_RAPID_QUESTION);
  }, []);

  const CreatePcr = async () => {
    await benificiaryRegistoryService.createPCRScores();
    setStatus();
  };

  console.log(status);
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("PCR_DETAILS"),
        onPressBackButton: (e) => {
          navigate(`/beneficiary/${id}/pcrview`);
        },
      }}
    >
      <ScrollView>
        <VStack width="90%" p="4">
          <FrontEndTypo.H1>{t("PCR Learning Level Assesment")}</FrontEndTypo.H1>
          <VStack mt={8} space="2" alignItems={"center"}>
            <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
              {t(
                "Initial learning leven (Evaluate on the first day of the camp)"
              )}
            </FrontEndTypo.H3>
            <Select
              selectedValue={status?.initialEvaluation || ""}
              accessibilityLabel="Select"
              placeholder={status?.initialEvaluation || "Select"}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                setStatus({ ...status, initialEvaluation: itemValue })
              }
            >
              {selectBaselineData?.map((item, i) => {
                return (
                  <Select.Item
                    key={i}
                    label={`${t(item.title)}`}
                    value={item.value}
                  />
                );
              })}
            </Select>
          </VStack>

          {status?.initialEvaluation && (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("Evaluation -1 (Evaluate the first day of the camp)")}
              </FrontEndTypo.H3>
              <Select
                selectedValue={status?.evaluation1 || ""}
                accessibilityLabel="Select"
                placeholder={status?.evaluation1 || "Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, evaluation1: itemValue })
                }
              >
                {selectRapidData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={i}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            </VStack>
          )}

          {status?.initialEvaluation && status?.evaluation1 ? (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("Evaluation -2(Evaluate the first day of the camp)")}
              </FrontEndTypo.H3>
              <Select
                selectedValue={status?.evaluation2 || ""}
                accessibilityLabel="Select"
                placeholder={status?.evaluation2 || "Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, evaluation2: itemValue })
                }
              >
                {selectRapidData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={i}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            </VStack>
          ) : (
            <></>
          )}

          {status?.initialEvaluation &&
          status?.evaluation1 &&
          status?.evaluation2 ? (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("Final learning level (Evaluate on the first day of camp)")}
              </FrontEndTypo.H3>
              <Select
                selectedValue={status?.finalEvaluation || ""}
                accessibilityLabel="Select"
                placeholder={status?.finalEvaluation || "Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, finalEvaluation: itemValue })
                }
              >
                {selectBaselineData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={i}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            </VStack>
          ) : (
            <></>
          )}

          {status?.initialEvaluation &&
          status?.evaluation1 &&
          status?.evaluation2 &&
          status?.finalEvaluation ? (
            <Box pt="4">
              <FrontEndTypo.Primarybutton
                onPress={() => {
                  CreatePcr();
                }}
              >
                {t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </Box>
          ) : (
            <></>
          )}
        </VStack>
      </ScrollView>
    </Layout>
  );
};

export default PcrDetails;
