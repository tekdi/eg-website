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
  const { id } = useParams();
  const [status, setStatus] = useState({ user_id: id });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectBaselineData, setselectBaselineData] = useState();
  const [selectRapidData, setselectRapidData] = useState();
  const [pcrCreated, setPcrCreated] = useState();
  const [data, setData] = useState();

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setselectBaselineData(result?.data?.PCR_SCORES_BASELINE_AND_ENDLINE);
    setselectRapidData(result?.data?.PCR_SCORES_RAPID_QUESTION);
  }, []);

  const SavePcr = async () => {
    const result = await benificiaryRegistoryService.getPcrScroresUpdate();
    setData(result);
  };
  const CreatePcr = async (id) => {
    const result = await benificiaryRegistoryService.createPCRScores(
      status,
      id
    );
    setPcrCreated(result);
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "loginBtn", "langBtn", "userInfo"],
        name: t("PCR_DETAILS"),
        onPressBackButton: (e) => {
          navigate(`/beneficiary/${id}/pcrview`);
        },
      }}
    >
      <ScrollView>
        <VStack p="4">
          <FrontEndTypo.H1>{t("PCR_EDUCATION_LEVEL")}</FrontEndTypo.H1>
          <VStack mt={8} space="2" alignItems={"center"}>
            <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
              {t("PCR_INITIAL_LEVEL")}
            </FrontEndTypo.H3>
            {status?.rapid_assessment_first_learning_level ? (
              <Select
                isDisabled={true}
                selectedValue={status?.baseline_learning_level || ""}
                accessibilityLabel="Select"
                placeholder={status?.baseline_learning_level || "Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, baseline_learning_level: itemValue })
                }
              >
                {selectBaselineData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={"i"}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            ) : (
              <Select
                selectedValue={""}
                accessibilityLabel="Select"
                placeholder={data?.baseline_learning_level || "Select"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) =>
                  setStatus({ ...status, baseline_learning_level: itemValue })
                }
              >
                {selectBaselineData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={"i"}
                      label={`${t(item.title)}`}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            )}
          </VStack>

          {status?.baseline_learning_level && (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("PCR_EVALUATION_1")}
              </FrontEndTypo.H3>
              {status?.rapid_assessment_second_learning_level ? (
                <Select
                  isDisabled={true}
                  selectedValue={
                    status?.rapid_assessment_first_learning_level || ""
                  }
                  accessibilityLabel="Select"
                  placeholder={
                    status?.rapid_assessment_first_learning_level || "Select"
                  }
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({
                      ...status,
                      rapid_assessment_first_learning_level: itemValue,
                    })
                  }
                >
                  {selectRapidData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              ) : (
                <Select
                  selectedValue={
                    status?.rapid_assessment_first_learning_level || ""
                  }
                  accessibilityLabel="Select"
                  placeholder={
                    status?.rapid_assessment_first_learning_level || "Select"
                  }
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({
                      ...status,
                      rapid_assessment_first_learning_level: itemValue,
                    })
                  }
                >
                  {selectRapidData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              )}
            </VStack>
          )}

          {status?.baseline_learning_level &&
          status?.rapid_assessment_first_learning_level ? (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("PCR_EVALUATION_2")}
              </FrontEndTypo.H3>
              {status?.endline_learning_level ? (
                <Select
                  isDisabled={true}
                  selectedValue={
                    status?.rapid_assessment_second_learning_level || ""
                  }
                  accessibilityLabel="Select"
                  placeholder={
                    status?.rapid_assessment_second_learning_level || "Select"
                  }
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({
                      ...status,
                      rapid_assessment_second_learning_level: itemValue,
                    })
                  }
                >
                  {selectRapidData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              ) : (
                <Select
                  selectedValue={
                    status?.rapid_assessment_second_learning_level || ""
                  }
                  accessibilityLabel="Select"
                  placeholder={
                    status?.rapid_assessment_second_learning_level || "Select"
                  }
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({
                      ...status,
                      rapid_assessment_second_learning_level: itemValue,
                    })
                  }
                >
                  {selectRapidData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              )}
            </VStack>
          ) : (
            <></>
          )}

          {status?.baseline_learning_level &&
          status?.rapid_assessment_first_learning_level &&
          status?.rapid_assessment_second_learning_level ? (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("PCR_FINAL_EVALUATON")}
              </FrontEndTypo.H3>

              {pcrCreated?.success ? (
                <Select
                  isDisabled={true}
                  selectedValue={status?.endline_learning_level || ""}
                  accessibilityLabel="Select"
                  placeholder={status?.endline_learning_level || "Select"}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({ ...status, endline_learning_level: itemValue })
                  }
                >
                  {selectBaselineData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              ) : (
                <Select
                  selectedValue={status?.endline_learning_level || ""}
                  accessibilityLabel="Select"
                  placeholder={status?.endline_learning_level || "Select"}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({ ...status, endline_learning_level: itemValue })
                  }
                >
                  {selectBaselineData?.map((item, i) => {
                    return (
                      <Select.Item
                        key={"i"}
                        label={`${t(item.title)}`}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
              )}
            </VStack>
          ) : (
            <></>
          )}

          {status?.endline_learning_level &&
          status?.baseline_learning_level &&
          status?.rapid_assessment_first_learning_level &&
          status?.rapid_assessment_second_learning_level ? (
            <Box pt="4">
              {!pcrCreated?.success ? (
                <FrontEndTypo.Primarybutton
                  onPress={() => {
                    CreatePcr();
                  }}
                >
                  {t("SAVE")}
                </FrontEndTypo.Primarybutton>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <Box pt="4">
              <FrontEndTypo.Primarybutton
                onPress={() => {
                  SavePcr();
                }}
              >
                {t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Layout>
  );
};

export default PcrDetails;
