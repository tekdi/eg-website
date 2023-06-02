import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";
import { Box, Button, Alert, VStack, HStack } from "native-base";
import { FrontEndTypo, t, Layout } from "@shiksha/common-lib";

export default function AdharSuccess() {
  const navigate = useNavigate();

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
    >
      <Box borderBottomWidth="2" borderColor="gray.400">
        <Button
          variant="ghost"
          display="flex"
          justifyContent="flex-start"
          onPress={() => navigate(-1)}
        >
          <WestIcon />
        </Button>
      </Box>

      <Box px="4">
        <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          (OKYC)
        </FrontEndTypo.H1>
        <Alert status="success" colorScheme="success" textAlign="center" my="4">
          <VStack space={2} flexShrink={1}>
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <FrontEndTypo.H4>
                  {t("YOUR_AADHAAR_VERIFICATION_IS_SUCCESSFUL")}
                </FrontEndTypo.H4>
              </HStack>
            </HStack>
          </VStack>
        </Alert>

        <FrontEndTypo.Primarybutton mt={20}>
          {t("CONTINUE_LOGIN")}
        </FrontEndTypo.Primarybutton>
      </Box>
    </Layout>
  );
}
