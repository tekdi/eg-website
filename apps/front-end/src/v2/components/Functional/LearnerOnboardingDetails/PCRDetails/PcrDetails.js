import {
  FrontEndTypo,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
} from "@shiksha/common-lib";
import React, { useState } from "react";
import {
  VStack,
  CheckIcon,
  Box,
  ScrollView,
  FormControl,
  Text,
  Heading,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { select as Select } from "component/BaseInput";

const isDisabledSelect = ({ data, attr }) => {
  let result = false;
  switch (attr) {
    case "rapid_assessment_first_learning_level":
      if (
        data?.rapid_assessment_second_learning_level ||
        data?.endline_learning_level
      )
        result = true;
      break;
    case "rapid_assessment_second_learning_level":
      if (data?.endline_learning_level) result = true;
      break;
    case "endline_learning_level":
      break;
    default:
      if (
        data?.rapid_assessment_first_learning_level ||
        data?.rapid_assessment_second_learning_level ||
        data?.endline_learning_level
      )
        result = true;
      break;
  }
  return result;
};

const isHideSelect = ({ data, attr }) => {
  let result = false;
  switch (attr) {
    case "rapid_assessment_first_learning_level":
      if (
        data?.baseline_learning_level ||
        data?.rapid_assessment_first_learning_level ||
        data?.rapid_assessment_second_learning_level ||
        data?.endline_learning_level
      )
        result = true;
      break;
    case "rapid_assessment_second_learning_level":
      if (
        data?.rapid_assessment_first_learning_level ||
        data?.rapid_assessment_second_learning_level ||
        data?.endline_learning_level
      )
        result = true;
      break;
    case "endline_learning_level":
      if (
        data?.rapid_assessment_second_learning_level ||
        data?.endline_learning_level
      )
        result = true;
      break;
    default:
      result = true;
      break;
  }
  return result;
};

const PcrDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectBaselineData, setselectBaselineData] = useState();
  const [selectRapidData, setselectRapidData] = useState();
  const [pcrCreated, setPcrCreated] = useState();
  const [data, setData] = React.useState({});
  const [isDisable, setIsDisable] = React.useState(false);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setselectBaselineData(result?.data?.PCR_SCORES_BASELINE_AND_ENDLINE);
    setselectRapidData(result?.data?.PCR_SCORES_RAPID_QUESTION);
  }, []);

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getPCRScores({ id });
    const userData = Array.isArray(result?.data)
      ? result?.data.filter((item) => item?.user_id == id)
      : [];
    const {
      baseline_learning_level,
      rapid_assessment_first_learning_level,
      rapid_assessment_second_learning_level,
      endline_learning_level,
    } = userData[0] || {};
    const newData = {
      baseline_learning_level,
      rapid_assessment_first_learning_level,
      rapid_assessment_second_learning_level,
      endline_learning_level,
    };
    setData(newData);
    setPcrCreated(newData);
  }, []);

  const createPcr = async () => {
    setIsDisable(true);
    const result = await benificiaryRegistoryService.createPCRScores({
      ...data,
      user_id: id,
    });
    setPcrCreated(result?.pcr_scores);
    navigate(`/beneficiary/${id}/pcrview`);
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
      analyticsPageTitle={"BENEFICIARY_PCR_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("PCR_DETAILS")}
    >
      <ScrollView>
        <VStack p="4">
          <Heading
            fontSize={"20px"}
            lineHeight={"30px"}
            fontWeight={"600"}
            color="textGreyColor.900"
          >
            {t("PCR_DETAILS")}
          </Heading>
          <FrontEndTypo.H3
            color="textGreyColor.750"
            lineHeight="21px"
            fontWeight="600"
          >
            {t("PCR_EDUCATION_LEVEL")}
          </FrontEndTypo.H3>
          {/* first select */}
          <CustomSelect
            {...{
              data: pcrCreated,
              options: {
                enumOptions: selectBaselineData?.map((e) => ({
                  ...(e || {}),
                  label: e?.title,
                })),
              },
              value: data?.baseline_learning_level || "",
              schema: {
                title: "PCR_INITIAL_LEVEL",
                description: "EVALUATE_ON_THE_FIRST_DAY_OF_CAMP",
                label: "LEARNER_LEVEL",
              },
              onChange: (itemValue) => {
                setData({
                  ...data,
                  baseline_learning_level: itemValue,
                });
              },
            }}
          />
          {/* second select */}
          <CustomSelect
            {...{
              data: pcrCreated,
              attr: "rapid_assessment_first_learning_level",
              options: {
                enumOptions: selectRapidData?.map((e) => ({
                  ...(e || {}),
                  label: e?.title,
                })),
              },
              value: data?.rapid_assessment_first_learning_level || "",
              schema: {
                title: "PCR_EVALUATION_1",
                description: "EVALUATE_THE_FIRST_DAY_OF_THE_CAMP",
                label: "EVALUATION_ONE",
              },
              onChange: (itemValue) => {
                setData({
                  ...data,
                  rapid_assessment_first_learning_level: itemValue,
                });
              },
            }}
          />

          {/* third select */}
          <CustomSelect
            {...{
              data: pcrCreated,
              attr: "rapid_assessment_second_learning_level",
              options: {
                enumOptions: selectRapidData?.map((e) => ({
                  ...(e || {}),
                  label: e?.title,
                })),
              },
              value: data?.rapid_assessment_second_learning_level || "",
              schema: {
                title: "PCR_EVALUATION_2",
                description: "EVALUATE_THE_FIRST_DAY_OF_THE_CAMP",
                label: "EVALUATION_TWO",
              },
              onChange: (itemValue) => {
                setData({
                  ...data,
                  rapid_assessment_second_learning_level: itemValue,
                });
              },
            }}
          />

          {/* fourth select */}
          <CustomSelect
            {...{
              data: pcrCreated,
              attr: "endline_learning_level",
              options: {
                enumOptions: selectBaselineData?.map((e) => ({
                  ...(e || {}),
                  label: e?.title,
                })),
              },
              value: data?.endline_learning_level || "",
              schema: {
                title: "PCR_FINAL_EVALUATON",
                description: "EVALUATE_THE_FIRST_DAY_OF_THE_CAMP",
                label: "FINAL_LEARNING_LEVEL",
              },
              onChange: (itemValue) => {
                setData({
                  ...data,
                  endline_learning_level: itemValue,
                });
              },
            }}
          />

          <Box pt="4" display={"flex"} alignItems={"center"}>
            <FrontEndTypo.Primarybutton
              onPress={createPcr}
              isDisabled={isDisable}
              w="60%"
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Box>
        </VStack>
      </ScrollView>
    </Layout>
  );
};

export default PcrDetails;

const CustomSelect = ({ data, attr, ...props }) => {
  const { t } = useTranslation();
  if (
    isHideSelect({
      data,
      attr,
    })
  ) {
    return (
      <VStack space="2">
        <VStack mt={6} alignItems={"start"}>
          <FrontEndTypo.H3 mt="6" fontWeight="600" color="textGreyColor.750">
            {t(props?.schema?.title)}
          </FrontEndTypo.H3>

          <FrontEndTypo.H4 my="6" fontWeight="600" color="textGreyColor.750">
            {t(props?.schema?.description)}
          </FrontEndTypo.H4>
        </VStack>
        <FormControl gap="4">
          <FormControl.Label
            rounded="sm"
            position="absolute"
            left="1rem"
            bg="white"
            px="1"
            m="0"
            height={"1px"}
            alignItems="center"
            style={{
              top: "3px",
              opacity: 1,
              zIndex: 5,
              transition: "all 0.3s ease",
            }}
          >
            <Text
              bg={"white"}
              zIndex={99999999}
              color={"floatingLabelColor.500"}
              fontSize="12"
              fontWeight="400"
            >
              {t(props?.schema?.label)}
            </Text>
          </FormControl.Label>
          <Select
            isDisabled={isDisabledSelect({ data, attr })}
            accessibilityLabel="SELECT"
            placeholder={"Select"}
            {...props}
          />
        </FormControl>
      </VStack>
    );
  }
  return <React.Fragment />;
};
