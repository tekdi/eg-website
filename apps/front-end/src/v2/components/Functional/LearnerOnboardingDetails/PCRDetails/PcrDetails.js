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
  Select,
  CheckIcon,
  Box,
  ScrollView,
  FormControl,
  Text,
  Heading,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const isDisabledSelect = ({ pcrCreated, attr }) => {
  const data = pcrCreated;
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

const isHideSelect = ({ pcrCreated, attr }) => {
  const data = pcrCreated;
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

          <VStack mt={6} alignItems={"start"}>
            <FrontEndTypo.H3
              color="textGreyColor.750"
              lineHeight="21px"
              fontWeight="600"
            >
              {t("PCR_EDUCATION_LEVEL")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H3 mt="6" fontWeight="600" color="textGreyColor.750">
              {t("PCR_INITIAL_LEVEL")}
            </FrontEndTypo.H3>

            <FrontEndTypo.H4 my="6" fontWeight="600" color="textGreyColor.750">
              {t("EVALUATE_ON_THE_FIRST_DAY_OF_CAMP")}
            </FrontEndTypo.H4>
          </VStack>
          <VStack space="2" alignItems={"center"}>
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
                  {t("LEARNER_LEVEL")}
                </Text>
              </FormControl.Label>
              <Select
                //isDisabled={isDisabledSelect({ pcrCreated })}
                minH={"56px"}
                selectedValue={data?.baseline_learning_level || "Select"}
                accessibilityLabel="SELECT"
                placeholder={
                  data?.baseline_learning_level?.toUpperCase() || "Select"
                }
                dropdownIcon={
                  <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
                }
                borderColor={
                  data?.baseline_learning_level
                    ? "floatingLabelColor.500"
                    : "inputBorderColor.500"
                }
                bg="#FFFFFF"
                borderWidth={data?.baseline_learning_level ? "2px" : "1px"}
                borderRadius={"4px"}
                fontSize={"16px"}
                letterSpacing={"0.5px"}
                fontWeight={400}
                lineHeight={"24px"}
                mt={1}
                onValueChange={(itemValue) =>
                  setData({ ...data, baseline_learning_level: itemValue })
                }
              >
                {selectBaselineData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={item?.title}
                      label={t(item?.title)}
                      value={item?.value}
                    />
                  );
                })}
              </Select>
            </FormControl>
          </VStack>
          {/* {isHideSelect({
            pcrCreated,
            attr: "rapid_assessment_first_learning_level",
          }) && (
            <VStack mt={8} space="2" alignItems={"center"}>
              <FrontEndTypo.H3 fontSize="sm" color="textMaroonColor.400">
                {t("PCR_EVALUATION_1")}
              </FrontEndTypo.H3>
              <Select
                isFocused={{ borderColor: "inputBorderColor.500" }}
                isDisabled={isDisabledSelect({ pcrCreated })}
                selectedValue={data?.baseline_learning_level || "Select"}
                accessibilityLabel="SELECT"
                placeholder={
                  data?.baseline_learning_level?.toUpperCase() || "Select"
                }
                mt={1}
                onValueChange={(itemValue) =>
                  setData({ ...data, baseline_learning_level: itemValue })
                }
                minH={"56px"}
                // key={data?.baseline_learning_level + items}
                dropdownIcon={
                  <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
                }
                borderColor={
                  data?.baseline_learning_level
                    ? "floatingLabelColor.500"
                    : "inputBorderColor.500"
                }
                bg="#FFFFFF"
                borderWidth={data?.baseline_learning_level ? "2px" : "1px"}
                borderRadius={"4px"}
                fontSize={"16px"}
                letterSpacing={"0.5px"}
                fontWeight={400}
                lineHeight={"24px"}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
              >
                {selectBaselineData?.map((item, i) => {
                  return (
                    <Select.Item
                      key={item?.title}
                      label={t(item?.title)}
                      value={item?.value}
                    />
                  );
                })}
              </Select>
            </FormControl>
          </VStack>
          {isHideSelect({
            pcrCreated,
            attr: "rapid_assessment_first_learning_level",
          }) && (
            <VStack>
              <VStack mt={6} alignItems={"start"}>
                <FrontEndTypo.H3 fontWeight="600" color="textGreyColor.750">
                  {t("PCR_EVALUATION_1")}
                </FrontEndTypo.H3>
                <FrontEndTypo.H4
                  fontWeight="600"
                  my="6"
                  color="textGreyColor.750"
                >
                  {t("EVALUATE_THE_FIRST_DAY_OF_THE_CAMP")}
                </FrontEndTypo.H4>
              </VStack>
              <VStack space="2" alignItems={"center"}>
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
                      {t("EVALUATION_ONE")}
                    </Text>
                  </FormControl.Label>

                  <Select
                    isDisabled={isDisabledSelect({
                      pcrCreated,
                      attr: "rapid_assessment_first_learning_level",
                    })}
                    selectedValue={
                      data?.rapid_assessment_first_learning_level?.toUpperCase() ||
                      ""
                    }
                    accessibilityLabel="SELECT"
                    placeholder={
                      data?.rapid_assessment_first_learning_level || "Select"
                    }
                    mt={1}
                    onValueChange={(itemValue) =>
                      setData({
                        ...data,
                        rapid_assessment_first_learning_level: itemValue,
                      })
                    }
                    minH={"56px"}
                    // key={
                    //   data?.rapid_assessment_first_learning_level?.toUpperCase() +
                    //   items
                    // }
                    dropdownIcon={
                      <IconByName
                        color="grayTitleCard"
                        name="ArrowDownSFillIcon"
                      />
                    }
                    borderColor={
                      data?.rapid_assessment_first_learning_level?.toUpperCase()
                        ? "floatingLabelColor.500"
                        : "inputBorderColor.500"
                    }
                    bg="#FFFFFF"
                    borderWidth={
                      data?.rapid_assessment_first_learning_level?.toUpperCase()
                        ? "2px"
                        : "1px"
                    }
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    letterSpacing={"0.5px"}
                    fontWeight={400}
                    lineHeight={"24px"}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                  >
                    {selectRapidData?.map((item, i) => {
                      return (
                        <Select.Item
                          key={item?.title}
                          label={t(item?.title)}
                          value={item?.value}
                        />
                      );
                    })}
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          )} */}

          {/* {isHideSelect({
            pcrCreated,
            attr: "rapid_assessment_second_learning_level",
          }) && (
            <VStack>
              <VStack mt={6} alignItems={"start"}>
                <FrontEndTypo.H3 fontWeight="600" color="textGreyColor.750">
                  {t("PCR_EVALUATION_2")}
                </FrontEndTypo.H3>
                <FrontEndTypo.H4
                  fontWeight="600"
                  my="6"
                  color="textGreyColor.750"
                >
                  {t("EVALUATE_THE_FIRST_DAY_OF_THE_CAMP")}
                </FrontEndTypo.H4>
              </VStack>
              <VStack space="2" alignItems={"center"}>
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
                      {t("EVALUATION_TWO")}
                    </Text>
                  </FormControl.Label>

                  <Select
                    isDisabled={isDisabledSelect({
                      pcrCreated,
                      attr: "rapid_assessment_second_learning_level",
                    })}
                    selectedValue={
                      data?.rapid_assessment_second_learning_level || ""
                    }
                    accessibilityLabel="Select"
                    placeholder={
                      data?.rapid_assessment_second_learning_level || "Select"
                    }
                    mt={1}
                    onValueChange={(itemValue) => {
                      setData({
                        ...data,
                        rapid_assessment_second_learning_level: itemValue,
                      });
                    }}
                    minH={"56px"}
                    // key={data?.rapid_assessment_second_learning_level + items}
                    dropdownIcon={
                      <IconByName
                        color="grayTitleCard"
                        name="ArrowDownSFillIcon"
                      />
                    }
                    borderColor={
                      data?.rapid_assessment_second_learning_level
                        ? "floatingLabelColor.500"
                        : "inputBorderColor.500"
                    }
                    bg="#FFFFFF"
                    borderWidth={
                      data?.rapid_assessment_second_learning_level
                        ? "2px"
                        : "1px"
                    }
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    letterSpacing={"0.5px"}
                    fontWeight={400}
                    lineHeight={"24px"}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                  >
                    {selectRapidData?.map((item, i) => {
                      return (
                        <Select.Item
                          key={item?.title}
                          label={t(item?.title)}
                          value={item?.value}
                        />
                      );
                    })}
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          )} */}

          {/* {isHideSelect({
            pcrCreated,
            attr: "endline_learning_level",
          }) && (
            <VStack>
              <VStack mt={6} alignItems={"start"}>
                <FrontEndTypo.H3 fontWeight="600" color="textGreyColor.750">
                  {t("PCR_FINAL_EVALUATON")}
                </FrontEndTypo.H3>
                <FrontEndTypo.H4
                  fontWeight="600"
                  my="6"
                  color="textGreyColor.750"
                >
                  {t("EVALUATE_THE_FIRST_DAY_OF_THE_CAMP")}
                </FrontEndTypo.H4>
              </VStack>
              <VStack space="2" alignItems={"center"}>
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
                      {t("FINAL_LEARNING_LEVEL")}
                    </Text>
                  </FormControl.Label>

                  <Select
                    isDisabled={isDisabledSelect({
                      pcrCreated,
                      attr: "endline_learning_level",
                    })}
                    selectedValue={data?.endline_learning_level || ""}
                    accessibilityLabel="Select"
                    placeholder={data?.endline_learning_level || "Select"}
                    mt={1}
                    onValueChange={(itemValue) =>
                      setData({ ...data, endline_learning_level: itemValue })
                    }
                    minH={"56px"}
                    // key={data?.endline_learning_level + items}
                    dropdownIcon={
                      <IconByName
                        color="grayTitleCard"
                        name="ArrowDownSFillIcon"
                      />
                    }
                    borderColor={
                      data?.endline_learning_level
                        ? "floatingLabelColor.500"
                        : "inputBorderColor.500"
                    }
                    bg="#FFFFFF"
                    borderWidth={data?.endline_learning_level ? "2px" : "1px"}
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    letterSpacing={"0.5px"}
                    fontWeight={400}
                    lineHeight={"24px"}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                  >
                    {selectBaselineData?.map((item, i) => {
                      return (
                        <Select.Item
                          key={item?.title}
                          label={t(item?.title)}
                          value={item?.value}
                        />
                      );
                    })}
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          )}
          <Box pt="4" display={"flex"} alignItems={"center"}>
          )} */}
          <Box pt="4" display={"flex"} alignItems={"center"}>
            <FrontEndTypo.Primarybutton
              onPress={() => {
                createPcr();
              }}
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
