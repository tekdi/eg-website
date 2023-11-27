import { campService, FrontEndTypo, Layout } from "@shiksha/common-lib";
import { Box, HStack, VStack, Alert, Image } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampExecutionEnd({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { id } = useParams();

  const [facilitator, setFacilitator] = React.useState();

  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
    setLoading(false);
  }, [id]);

  return (
    <Layout _appBar={{ name: t("CAMP_EXECUTION") }} loading={loading}>
      <VStack py={6} px={4} mb={5} space="6">
        <Box
          margin={"auto"}
          height={"200px"}
          width={"380px"}
          borderColor={"black"}
          bg={"red.100"}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={{
              uri: "/airoplane.gif",
            }}
            alt="airoplane.gif"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={-1}
          />

          <VStack alignItems="center" justifyContent="center">
            <FrontEndTypo.H2
              marginTop={"15px"}
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
            >
              {t("LETS_START_TODAYS_CAMP")}
            </FrontEndTypo.H2>
          </VStack>
        </Box>
        <Alert status="warning">
          <HStack alignItems={"center"} space={2}>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("DONT_CLOSE_SCREEN")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
        <HStack space={4} alignSelf={"center"}>
          <FrontEndTypo.Secondarybutton
            onPress={() => navigate(`/camps/${id}/attendance`)}
          >
            {t("ATTENDANCE")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Secondarybutton
            onPress={() => navigate(`/camps/${id}/activities`)}
          >
            {t("TODAYS_TASKS")}
          </FrontEndTypo.Secondarybutton>
        </HStack>
        <FrontEndTypo.Primarybutton isDisabled={true}>
          {t("END_CAMP")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}
