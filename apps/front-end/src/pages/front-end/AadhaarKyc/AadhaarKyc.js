import React, { useEffect } from "react";
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
  Layout,
  aadhaarService,
  FloatingInput,
  facilitatorRegistryService,
  Loading,
  IconByName,
  BodyMedium,
} from "@shiksha/common-lib";
import AadhaarOTP from "./AadhaarOTP";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QrScannerKyc from "./QrScannerKyc/QrScannerKyc";
import ManualUpload from "./ManualUpload/ManualUpload";
import { useTranslation } from "react-i18next";
import AadhaarSuccess from "./AadhaarSuccess";
import Aadhaarokyc2 from "./Aadhaarokyc2";

export default function AdharKyc({ footerLinks }) {
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
  const attemptCount = 0;
  const [isQRDisabled, setIsQRDisabled] = React.useState(false);
  const [isAadharDisabled, setIsAadharDisabled] = React.useState(false);
  const { t } = useTranslation();
  const [aadhaarCompare, setAadhaarCompare] = React.useState();
  const [loadingHeight, setLoadingHeight] = React.useState(0);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  React.useEffect(async () => {
    if (page === "aadhaar-number") {
      aadhaarInit();
    }
    setLoading(false);
    setIsQRDisabled(
      localStorage.getItem("addhar-number") < attemptCount ||
        localStorage.getItem("addhar-qr") < attemptCount
    );
    setIsAadharDisabled(localStorage.getItem("addhar-number") < attemptCount);
    getUser();
  }, [page]);

  React.useEffect(() => {
    const typeData = type?.toLowerCase();
    if (["qr", "aadhaar-number", "upload", "okyc2"].includes(typeData)) {
      setPage(typeData);
    } else {
      setPage();
    }
  }, [type]);

  const getCaptcha = async (id) => {
    const res = await aadhaarService.initiate({ id });
    setCaptchaImg(res?.captchaImage);
    setData({ ...data, id, captchaCode: "" });
  };

  const aadhaarInit = async (id) => {
    setLoading(true);
    setError();
    const res = await aadhaarService.okyc();
    if (res.id) {
      getCaptcha(res.id);
      setData({ ...data, id: res.id });
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
      setAttempt("addhar-number");
      setPage("otp");
    } else if (res?.code === "send_otp_failed") {
      setAttempt("addhar-number");
    } else {
      setAttempt("addhar-number");
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
      navigate(-1, {
        state: { aadhar_no: location?.state },
      });
    }
  };

  const setAttempt = (type) => {
    const attemptCount = localStorage.getItem(type)
      ? localStorage.getItem(type)
      : 0;
    localStorage.setItem(type, parseInt(attemptCount) + 1);
  };

  if (isQRDisabled || isAadharDisabled) {
    if (
      (isAadharDisabled && page === "qr") ||
      (isQRDisabled && page === "upload")
    ) {
      setPage();
      setOtpFailedPopup(true);
    }
  }

  if (loading) {
    return <Loading />;
  }
  // if (user?.aadhar_verified === "yes") {
  //   return (
  //     <Layout _footer={{ menues: footerLinks }}>
  //       <Alert status="success" alignItems={"start"}>
  //         <HStack alignItems="center" space="2" color>
  //           <Alert.Icon />
  //           <BodyMedium>
  //             {t("YOUR_AADHAAR_VERIFICATION_IS_SUCCESSFUL")}
  //           </BodyMedium>
  //         </HStack>
  //       </Alert>
  //     </Layout>
  //   );
  // }
  return (
    <Box>
      {page === "okyc2" ? (
        <Aadhaarokyc2
          {...{
            setPage,
            setLoading,
            error,
            setError,
            handalBack,
            setAttempt,
            footerLinks,
            setAadhaarCompare,
            user,
          }}
        />
      ) : page === "qr" ? (
        <QrScannerKyc
          {...{
            setOtpFailedPopup,
            setPage,
            setError,
            id,
            setAttempt,
            setAadhaarCompare,
            user,
          }}
        />
      ) : page === "upload" ? (
        <ManualUpload
          {...{
            setLoading,
            setPage,
            setOtpFailedPopup,
            footerLinks,
            setAadhaarCompare,
          }}
        />
      ) : page === "otp" && data?.aadhaarNumber ? (
        <AadhaarOTP
          {...data}
          {...{
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
          }}
        />
      ) : (
        <Layout
          getBodyHeight={(e) => setLoadingHeight(e)}
          _appBar={{
            onlyIconsShow: ["backBtn", "userInfo"],
            name: `${user?.first_name}${
              user?.last_name ? " " + user.last_name : ""
            }`,
            profile_url: user?.profile_photo_1?.id,
            _box: { bg: "white", shadow: "appBarShadow" },
            _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
            onPressBackButton: handalBack,
          }}
          _footer={{ menues: footerLinks }}
          _page={{ _scollView: { bg: "formBg.500" } }}
        >
          {page === "aadhaarSuccess" ? (
            <AadhaarSuccess
              user={user}
              aadhaarCompare={aadhaarCompare}
              location={location}
              type={type}
            />
          ) : page === "aadhaar-number" ? (
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
                        value?.length <= 12 &&
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
                <HStack p="4" shadow="appBar">
                  <Image
                    width="180"
                    height={50}
                    key={captchaImg}
                    src={`data:image/jpeg;charset=utf-8;base64,${captchaImg}`}
                    alt="captcha image"
                  />
                  <IconByName
                    onPress={(e) => aadhaarInit()}
                    name="RefreshLineIcon"
                  />
                </HStack>
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

              <Alert
                status="warning"
                colorScheme="warning"
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
          ) : (
            <Box>
              <Loading
                height={loadingHeight}
                customComponent={
                  <VStack w="100%">
                    {error?.top && (
                      <FrontEndTypo.Prompts m="5" status="danger" flex="1">
                        {error?.top}
                      </FrontEndTypo.Prompts>
                    )}
                    <AadhaarOptions
                      {...{
                        redirect: location?.state,
                        setData,
                        setOtpFailedPopup,
                        setError,
                        aadhaarInit,
                        setPage,
                        navigate,
                        isQRDisabled,
                        isAadharDisabled,
                        id,
                      }}
                    />
                  </VStack>
                }
              />
            </Box>
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
        <AadhaarOptions
          {...{
            setData,
            setOtpFailedPopup,
            setError,
            aadhaarInit,
            setPage,
            navigate,
            isQRDisabled,
            isAadharDisabled,
            id,
          }}
        />
      </Actionsheet>
    </Box>
  );
}

const AadhaarOptions = ({
  setData,
  setOtpFailedPopup,
  setError,
  aadhaarInit,
  setPage,
  navigate,
  isQRDisabled,
  redirect,
  id,
}) => {
  const { t } = useTranslation();
  const [user, setUser] = React.useState();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    if (result?.id) {
      setUser(result);
    }
  };
  return (
    <VStack bg="white" width={"100%"} space="5" p="5">
      <FrontEndTypo.Secondarybutton
        onPress={() => {
          setData();
          setOtpFailedPopup(false);
          setError();
          aadhaarInit();
          setPage("aadhaar-number");
          navigate(`/aadhaar-kyc/${id}/okyc2`);
        }}
      >
        {t("TRY_AADHAR_NUMER_KYC")}
      </FrontEndTypo.Secondarybutton>
      {/* <FrontEndTypo.Secondarybutton
        isDisabled={isAadharDisabled}
        onPress={() => {
          setPage("qr");
          setOtpFailedPopup(false);
          navigate(`/aadhaar-kyc/${id}/QR`);
        }}
      >
        {t("TRY_AADHAR_QR_KYC")}
      </FrontEndTypo.Secondarybutton> */}
      {user?.aadhar_verified === "in_progress" ? (
        <React.Fragment></React.Fragment>
      ) : (
        <FrontEndTypo.Secondarybutton
          isDisabled={isQRDisabled}
          onPress={() => {
            setPage("upload");
            setOtpFailedPopup(false);
            navigate(`/aadhaar-kyc/${id}/upload`, {
              state: redirect,
            });
          }}
        >
          {t("TRY_AADHAR_UPLOAD_KYC")}
        </FrontEndTypo.Secondarybutton>
      )}
      <FrontEndTypo.Primarybutton
        onPress={() => {
          navigate(-1);
        }}
      >
        {t("GO_BACK")}
      </FrontEndTypo.Primarybutton>
    </VStack>
  );
};
