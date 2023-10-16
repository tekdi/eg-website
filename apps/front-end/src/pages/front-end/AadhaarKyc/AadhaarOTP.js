import React from "react";
import { Button, FormControl, Pressable, VStack } from "native-base";
import {
  FrontEndTypo,
  t,
  Layout,
  aadhaarService,
  CustomOTPBox,
  authRegistryService,
  checkAadhaar,
} from "@shiksha/common-lib";

export default function AdharOTP({
  id,
  aadhaarNumber,
  setPage,
  setLoading,
  error,
  setError,
  handalBack,
  setOtpFailedPopup,
  sendData,
  setAttempt,
  footerLinks,
  setAadhaarCompare,
  user,
}) {
  const [data, setData] = React.useState({
    otpNumber: "",
    securityCode: "",
  });

  const generateCode = () => {
    const maths = Math;
    const random = maths.random();
    setData({ ...data, securityCode: Math.floor(1000 + random * 9000) });
  };

  const handleSubmit = async () => {
    setError();
    if (!id || !aadhaarNumber || !data.otpNumber || !data.securityCode) {
      setError({ ...error, top: "All Fields are required" });
      return;
    }
    setLoading(true);
    const bodyData = {
      id: id,
      otp: data.otpNumber,
      shareCode: data.securityCode,
      aadhaarNumber,
    };
    const res = await aadhaarService.complete(bodyData);
    if (res.status === "complete") {
      const result = checkAadhaar(user, res?.aadhaar);
      console.log(result);
      setAadhaarCompare(result);
      authRegistryService.aadhaarKyc({
        id,
        aadhar_no: aadhaarNumber,
        aadhar_token: aadhaarNumber,
        aadhar_verified: "yes",
        aadhaar_verification_mode: "offline",
      });
      setPage ? setPage("aadhaarSuccess") : setPage();
    } else {
      setAttempt("number");
      setError({
        ...error,
        top: res.error,
      });
      setOtpFailedPopup(true);
    }
    setLoading(false);
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
        onPressBackButton: handalBack,
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      {error?.top && (
        <FrontEndTypo.Prompts m="5" status="danger" flex="1">
          {error?.top}
        </FrontEndTypo.Prompts>
      )}
      <VStack px="4" space={4}>
        <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          (OKYC)
        </FrontEndTypo.H1>
        <VStack>
          <FormControl>
            <CustomOTPBox
              isHideResendOtp
              placeholder="000000"
              required
              isInvalid={error?.otpNumber}
              schema={{
                title: "ENTER_6_DIGIT_OTP",
                help: error?.otpNumber && error.otpNumber,
              }}
              value={data?.otpNumber ? data?.otpNumber : ""}
              borderColor="gray.500"
              p="4"
              maxWidth={120}
              onChange={(value) => {
                setData({ ...data, otpNumber: value });
              }}
            />
          </FormControl>
          <Pressable onPress={(e) => sendData()}>
            <FrontEndTypo.H3 mt="4" color="textMaroonColor.400">
              {t("RESEND")}
            </FrontEndTypo.H3>
          </Pressable>
        </VStack>
        <VStack space={2}>
          <FrontEndTypo.H3 color="textMaroonColor.400" bold mt="5">
            {t("CREATE_4_DIGIT_SHARE_CODE")}
          </FrontEndTypo.H3>
          <FrontEndTypo.Prompts status={"info"}>
            {t("PLEASE_ENTER_A_4_DIGIT_NUMBER")}
          </FrontEndTypo.Prompts>
          <FrontEndTypo.H4 color="gray.500">
            {t("YOUR_AADHAAR_OKYC_MESSAGE")}
          </FrontEndTypo.H4>
          <Button
            onPress={generateCode}
            p="2"
            variant="link"
            _text={{ color: "textMaroonColor.400" }}
          >
            {t("AUTO_GENERATE")}
          </Button>
          <FormControl>
            <CustomOTPBox
              isHideResendOtp
              otpCount="4"
              placeholder="6YE3ZH"
              required
              isInvalid={error?.securityCode}
              schema={{
                title: "ENTER_SECURITY_CODE",
                help: error?.securityCode && error.securityCode,
              }}
              value={data?.securityCode ? data?.securityCode : ""}
              borderColor="gray.500"
              p="4"
              maxWidth={120}
              onChange={(value) => {
                setData({ ...data, securityCode: value });
              }}
            />
          </FormControl>
        </VStack>
        <FrontEndTypo.Secondarybutton
          bg={!data.otpNumber || !data.securityCode ? "gray.300" : "gray.500"}
          isDisabled={!data?.otpNumber || !data?.securityCode}
          onPress={handleSubmit}
        >
          {t("CONTINUE")}
        </FrontEndTypo.Secondarybutton>
      </VStack>
    </Layout>
  );
}
