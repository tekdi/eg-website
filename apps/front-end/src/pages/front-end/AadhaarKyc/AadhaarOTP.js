import React from "react";
import { FormControl, VStack } from "native-base";
import {
  FrontEndTypo,
  t,
  Layout,
  aadhaarService,
  CustomOTPBox,
  authRegistryService,
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
}) {
  const [data, setData] = React.useState({
    otpNumber: "",
    securityCode: "",
  });
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
    console.log(res);
    if (res.status === "complete") {
      authRegistryService.aadhaarKyc({
        id,
        aadhar_no: aadhaarNumber,
        aadhar_token: aadhaarNumber,
        aadhar_verified: "yes",
        aadhaar_verification_mode: "offline",
      });
      setPage && setPage("aadhaarSuccess");
    } else {
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
        <VStack space={2}>
          <FrontEndTypo.H3 color="textMaroonColor.400" bold mt="5">
            {t("ENTER_SECURITY_CODE")}
          </FrontEndTypo.H3>
          <FrontEndTypo.Prompts status={"info"}>
            You can set the pass code as your birth year e.g. 1999 last 4 digits
            of your Aadhaar **** **** 8976
          </FrontEndTypo.Prompts>
          <FrontEndTypo.H4 color="gray.500">
            {t(
              "SET_A_4_DIGIT_PASSCODE_TO_SECURELY_SHARE_YOUR_AADHAAR_ZIP_FILE"
            )}
          </FrontEndTypo.H4>
        </VStack>
        <FormControl>
          <CustomOTPBox
            isHideResendOtp
            otpCount="5"
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
