import React from "react";
import {
  Box,
  Alert,
  FormControl,
  Image,
  HStack,
  VStack,
  Actionsheet,
} from "native-base";
import {
  FrontEndTypo,
  t,
  Layout,
  aadhaarService,
  FloatingInput,
  facilitatorRegistryService,
  Loading,
  IconByName,
} from "@shiksha/common-lib";
import AdharOTP from "./AadhaarOTP";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QrScannerKyc from "./QrScannerKyc/QrScannerKyc";
import ManualUpload from "./ManualUpload/ManualUpload";

export default function AdharKyc() {
  const location = useLocation();
  const [page, setPage] = React.useState();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [user, setUser] = React.useState();
  const [captchaImg, setCaptchaImg] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [otpFailedPopup, setOtpFailedPopup] = React.useState(false);
  const { id, type } = useParams();
  const navigate = useNavigate();

  React.useEffect(async () => {
    if (!page) {
      aadhaarInit();
    }
    setLoading(false);
  }, [page]);

  React.useEffect(() => {
    const typeData = type?.toLowerCase();
    if (typeData === "qr") {
      setPage(typeData);
    }
  }, [type]);

  const getCaptcha = async (id) => {
    const res = await aadhaarService.initiate({ id });
    setCaptchaImg(res?.captchaImage);
    setData({ ...data, captchaCode: "" });
  };
  const aadhaarInit = async (id) => {
    setLoading(true);
    const res = await aadhaarService.okyc();
    if (res.id) {
      getCaptcha(res.id);
      setData({ ...data, id: res.id });
      getUser();
    }
    setLoading(false);
  };
  const getUser = async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    if (result?.id) {
      setUser(result);
    }
  };

  const sendData = async () => {
    setLoading(true);
    const res = await aadhaarService.verify(data);

    if (res?.data?.code === "invalid_aadhaar_number") {
      setError({
        ...error,
        aadhaarNumber: res.error,
      });
    } else if (res?.data?.code === "invalid_captcha_entered") {
      setError({
        ...error,
        captchaCode: res.error,
      });
    } else if (res?.code === "otp_sent") {
      setPage("otp");
    } else {
      setError({
        ...error,
        top: res.error,
      });
      setOtpFailedPopup(true);
    }
    setLoading(false);
  };

  const handalBack = () => {
    if (page === "otp") {
      setPage();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      {page === "qr" ? (
        <QrScannerKyc {...{ setOtpFailedPopup, setPage, setError, id }} />
      ) : page === "upload" ? (
        <ManualUpload {...{ setLoading, setPage, setOtpFailedPopup }} />
      ) : page === "otp" && data?.aadhaarNumber ? (
        <AdharOTP
          {...data}
          {...{
            setPage,
            setLoading,
            error,
            setError,
            handalBack,
            setOtpFailedPopup,
          }}
        />
      ) : (
        <Layout
          _appBar={{
            onlyIconsShow: ["backBtn", "userInfo"],
            name: `${user?.first_name}${
              user?.last_name ? " user.last_name" : ""
            }`,
            profile_url: user?.documents[0]?.name,
            _box: { bg: "white", shadow: "appBarShadow" },
            _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
            onPressBackButton: handalBack,
          }}
        >
          {page === "aadhaarSuccess" ? (
            <Box px="4">
              <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
                {t("OFFLINE_AADHAAR_VERIFICATION")}
                (OKYC)
              </FrontEndTypo.H1>
              <Alert
                status="success"
                colorScheme="success"
                textAlign="center"
                my="4"
              >
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

              <FrontEndTypo.Primarybutton
                mt={20}
                onPress={(e) => {
                  if (location?.state) {
                    navigate(location?.state);
                  } else {
                    navigate(-1);
                    navigate(0);
                  }
                }}
              >
                {t("CONTINUE")}
              </FrontEndTypo.Primarybutton>
            </Box>
          ) : (
            <VStack p="4" space={4}>
              {error?.top && (
                <FrontEndTypo.Prompts m="5" status="danger" flex="1">
                  {error?.top}
                </FrontEndTypo.Prompts>
              )}
              <FrontEndTypo.H1 bold color="textMaroonColor.400">
                {t("OFFLINE_AADHAAR_VERIFICATION")}
                (OKYC)
              </FrontEndTypo.H1>
              <VStack space="2">
                <FloatingInput
                  placeholder="0000 0000 0000"
                  required
                  isInvalid={error?.aadhaarNumber}
                  schema={{
                    title: "AADHAAR_NUMBER",
                    help: error?.aadhaarNumber && error.aadhaarNumber,
                  }}
                  value={data?.aadhaarNumber ? data?.aadhaarNumber : ""}
                  borderColor="gray.500"
                  onChange={(value) => {
                    if (value?.length >= 12) {
                      if (
                        value &&
                        !`${value}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
                      ) {
                        setError({
                          ...error,
                          aadhaarNumber: `${t(
                            "AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER"
                          )}`,
                        });
                      } else {
                        setError({
                          ...error,
                          aadhaarNumber: null,
                        });
                      }
                      if (value?.length <= 12) {
                        setData({ ...data, aadhaarNumber: value });
                      }
                    } else {
                      setData({ ...data, aadhaarNumber: value });
                      setError({
                        ...error,
                        aadhaarNumber: null,
                      });
                    }
                  }}
                />
                {!error?.aadhaarNumber && (
                  <FrontEndTypo.H4 color="gray.500">
                    {t("ENTER_YOUR_AADHAAR_NUMBER")}
                  </FrontEndTypo.H4>
                )}
              </VStack>

              <VStack mt="2">
                <FormControl.Label
                  htmlFor="captchaCode"
                  mb="2"
                  display="flex"
                  flexDirection="column"
                >
                  <FrontEndTypo.H3 color="textMaroonColor.400" bold mt="5">
                    {t("ENTER_SECURITY_CODE")}
                  </FrontEndTypo.H3>
                </FormControl.Label>
                <Box p="4" shadow="appBar">
                  <Image
                    width="180"
                    height={50}
                    key={captchaImg}
                    src={`data:image/jpeg;charset=utf-8;base64,${captchaImg}`}
                    alt="captcha image"
                  />
                </Box>
                <FloatingInput
                  placeholder="6YE3ZH"
                  required
                  isInvalid={error?.captchaCode}
                  schema={{
                    title: "CAPTCHA_CODE",
                    help: error?.captchaCode && error.captchaCode,
                  }}
                  value={data?.captchaCode ? data?.captchaCode : ""}
                  borderColor="gray.500"
                  p="4"
                  maxWidth={120}
                  onChange={(value) => {
                    setData({ ...data, captchaCode: value });
                  }}
                />
                {!error?.captchaCode && (
                  <FrontEndTypo.H4 color="gray.500">
                    {t("TYPE_THE_CHARACTERS_YOU_SEE_IN_THE_PICTURE")}
                  </FrontEndTypo.H4>
                )}
              </VStack>

              <Alert status="info" colorScheme="info" textAlign="center" my="4">
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
                        {t(
                          "WE_WILL_SEND_YOU_AN_OTP_TO_THE_MOBILE_NUMBER_LINKED_WITH_YOUR_AADHAAR"
                        )}
                      </FrontEndTypo.H4>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>

              <ul style={{ padding: "0px 20px", marginTop: "10px" }}>
                <li style={{ listStyleType: "disc" }}>
                  <FrontEndTypo.H5 color="gray.600" fontWeight="500">
                    {t(
                      "I_AGREE_TO_DOWNLOAD_MY_AADHAAR_XML_FILE_FROM_THE_UIDAI_WEBSITE_TO_COMPLETE_AADHAAR_OFFLINE_VERIFICATION_WITH_SMALLCASE"
                    )}
                  </FrontEndTypo.H5>
                </li>

                <li style={{ listStyleType: "disc" }}>
                  <FrontEndTypo.H5 fontWeight="500" color="gray.600">
                    {t("DISCLAIMER_MESSAGE")}
                  </FrontEndTypo.H5>
                </li>
              </ul>

              <FormControl.Label htmlFor="checkMark" alignItems="center">
                <input
                  type="checkbox"
                  id="checkMark"
                  name="checkMark"
                  onChange={(e) => {
                    setData({ ...data, checkMark: e?.target?.checked });
                  }}
                />
                <FrontEndTypo.H4 pr="4" color="textGreyColor.800" bold>
                  {t("I_HAVE_READ_AND_UNDERSTOOD_ALL_OF_THE_POINTS_ABOVE")}
                </FrontEndTypo.H4>
              </FormControl.Label>
              <FrontEndTypo.Secondarybutton
                isDisabled={
                  !data?.aadhaarNumber || !data?.captchaCode || !data?.checkMark
                }
                onPress={sendData}
              >
                {t("CONTINUE")}
              </FrontEndTypo.Secondarybutton>
            </VStack>
          )}
        </Layout>
      )}
      <Actionsheet
        isOpen={otpFailedPopup && page !== "aadhaarSuccess"}
        onClose={() => setOtpFailedPopup(false)}
      >
        <Actionsheet.Content alignItems={"left"}>
          <HStack justifyContent={"space-between"} alignItems="strat">
            <FrontEndTypo.H1
              color="textGreyColor.800"
              p="2"
              onPress={(e) => setPage("upload")}
            >
              {t("AADHAR_KYC_VERIFICATION_FAILED")}
            </FrontEndTypo.H1>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setOtpFailedPopup(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <VStack bg="white" width={"100%"} space="5" p="5">
          <FrontEndTypo.Secondarybutton
            onPress={() => {
              setData();
              setOtpFailedPopup(false);
              setError();
              aadhaarInit();
              setPage();
            }}
          >
            {t("RETRY_AADHAR_NUMER_KYC")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Secondarybutton
            onPress={() => {
              setPage("qr");
              setOtpFailedPopup(false);
            }}
          >
            {t("RETRY_AADHAR_QR_KYC")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Secondarybutton
            onPress={() => {
              setPage("upload");
              setOtpFailedPopup(false);
            }}
          >
            {t("RETRY_AADHAR_UPLOAD_KYC")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Primarybutton
            onPress={() => {
              navigate(-1);
            }}
          >
            {t("GO_BACK")}
          </FrontEndTypo.Primarybutton>

          <HStack alignItems="center" mb="3" color="red.600">
            <FrontEndTypo.H4 pl="2" color="red.600">
              {t("MOBILE_NUMBER_IS_NOT_LINKED_TO_AADHAAR_CARD")}
            </FrontEndTypo.H4>
          </HStack>
        </VStack>
      </Actionsheet>
    </Box>
  );
}
