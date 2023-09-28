import { FrontEndTypo, IconByName, Layout } from "@shiksha/common-lib";
import { Box, HStack, VStack } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function PcrView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
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
      <Box p="2" marginTop="10%">
        <VStack
          px="5"
          py="4"
          space="4"
          borderRadius="10px"
          borderWidth="1px"
          bg="white"
          borderColor="appliedColor"
          width="80%"
          alignSelf="center"
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            borderColor="light.300"
            pb="1"
            borderBottomWidth="2"
          >
            <FrontEndTypo.H2 bold underline>
              {t("PCR_DETAILS")} :-
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
                A
              </FrontEndTypo.H4>
            </HStack>
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                fontWeight="400"
                flex="0.5"
              >
                {t("EVALUATION-1")}
              </FrontEndTypo.H3>

              <FrontEndTypo.H4
                color="textGreyColor.800"
                fontWeight="400"
                flex="0.3"
                bold
              >
                A
              </FrontEndTypo.H4>
            </HStack>
            <HStack space="4">
              <FrontEndTypo.H3
                color="textGreyColor.50"
                fontWeight="400"
                flex="0.5"
              >
                {t("EVALUATION-2")}
              </FrontEndTypo.H3>
              <FrontEndTypo.H4
                color="textGreyColor.800"
                fontWeight="400"
                flex="0.3"
                bold
              >
                A
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
                A
              </FrontEndTypo.H4>
            </HStack>
          </VStack>

          <HStack>
            <FrontEndTypo.H5></FrontEndTypo.H5>
          </HStack>
        </VStack>
      </Box>
    </Layout>
  );
}
