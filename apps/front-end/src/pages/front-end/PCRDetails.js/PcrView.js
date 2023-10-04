import {
  FrontEndTypo,
  IconByName,
  Layout,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { Box, HStack, VStack } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PcrView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = React.useState({});

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getPCRScores({ id });
    const userData = result?.data?.filter((item) => item.user_id == id);
    setData(userData[0]);
  }, []);

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "loginBtn", "langBtn", "userInfo"],

        name: t("PCR_DETAILS"),
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box p="2" marginTop="1%">
        <VStack
          px="5"
          py="4"
          space="4"
          borderRadius="10px"
          borderWidth="1px"
          bg="white"
          borderColor="appliedColor"
          width="98%"
          alignSelf="center"
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            borderColor="light.300"
            pb="1"
            borderBottomWidth="1"
          >
            <FrontEndTypo.H2 bold underline>
              {t("PCR_EDUCATION_LEVEL")} :-
            </FrontEndTypo.H2>

            <IconByName
              name="EditBoxLineIcon"
              color="iconColor.100"
              onPress={() => {
                navigate(`/beneficiary/${id}/pcrdetails`);
              }}
            />
          </HStack>
          <VStack space="4">
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                flex="0.5"
                fontWeight="400"
              >
                {t("PRIAMRY_LEVEL_EDUCATION")}
              </FrontEndTypo.H3>
              <FrontEndTypo.H4 color="textGreyColor.800" fontWeight="400" bold>
                {data?.baseline_learning_level
                  ? data?.baseline_learning_level?.toUpperCase()
                  : "-"}
              </FrontEndTypo.H4>
            </HStack>
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                fontWeight="400"
                flex="0.5"
              >
                {t("EVALUATION_1")}
              </FrontEndTypo.H3>

              <FrontEndTypo.H4
                color="textGreyColor.800"
                fontWeight="400"
                flex="0.3"
                bold
              >
                {data?.rapid_assessment_first_learning_level
                  ? data?.rapid_assessment_first_learning_level
                  : "-"}
              </FrontEndTypo.H4>
            </HStack>
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                fontWeight="400"
                flex="0.5"
              >
                {t("EVALUATION_2")}
              </FrontEndTypo.H3>
              <FrontEndTypo.H4
                color="textGreyColor.800"
                fontWeight="400"
                flex="0.3"
                bold
              >
                {data?.rapid_assessment_second_learning_level
                  ? data?.rapid_assessment_second_learning_level
                  : "-"}
              </FrontEndTypo.H4>
            </HStack>
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                fontWeight="400"
                flex="0.5"
              >
                {t("FINAL_LEVEL_EDUCATION")}
              </FrontEndTypo.H3>
              <FrontEndTypo.H4
                color="textGreyColor.800"
                fontWeight="400"
                flex="0.4"
                bold
              >
                {data?.endline_learning_level
                  ? data?.endline_learning_level?.toUpperCase()
                  : "-"}
              </FrontEndTypo.H4>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Layout>
  );
}
