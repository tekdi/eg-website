import React, { useState, useEffect } from "react";
import {
  HStack,
  FormControl,
  Input,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
  Image,
  Box,
} from "native-base";
import {
  useWindowSize,
  Subtitle,
  login,
  logout,
  Layout,
  BodyMedium,
  FrontEndTypo,
  IconByName,
  getOnboardingURLData,
  removeOnboardingURLData,
  removeOnboardingMobile,
  CustomAlert,
} from "@shiksha/common-lib";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const styles = {
  box: {
    background:
      "linear-gradient(135deg, #e2f2fc -10%, #faf6f3 35%, #faf6f3 60%,#faf6f3 70%, #e2f2fc 110%)",
  },
};

export default function Login() {
  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isUserRegisterExist, setIsUserRegisterExist] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        let onboardingURLData = await getOnboardingURLData();
        setCohortData(onboardingURLData?.cohortData);
        setProgramData(onboardingURLData?.programData);
        if (onboardingURLData?.cohortData) {
          setIsUserRegisterExist(true);
        } else {
          setIsUserRegisterExist(false);
        }
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  const removeRegisterExist = async () => {
    await removeOnboardingURLData();
    await removeOnboardingMobile();
    setIsUserRegisterExist(false);
  };

  const { t } = useTranslation();
  const [ref, setRef] = React.useState(null);
  const [width, height] = useWindowSize();
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = React.useState({});
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [language, setLanguage] = React.useState();
  useEffect(() => {
    setLanguage(localStorage.getItem("lang") || "en");
  }, []);

  const validate = () => {
    let arr = {};
    if (
      typeof credentials?.username === "undefined" ||
      credentials?.username === ""
    ) {
      arr = { ...arr, username: t("USERNAME_IS_REQUIRED") };
    }

    if (
      typeof credentials?.password === "undefined" ||
      credentials?.password === ""
    ) {
      arr = { ...arr, password: t("PASSWORD_IS_REQUIRED") };
    }

    setErrors(arr);

    if (arr.username || arr.password) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validate()) {
      setIsButtonLoading(true);
      const { error } = credentials ? await login(credentials) : {};
      if (!error) {
        navigate("/");
        navigate(0);
      } else {
        setIsButtonLoading(false);
        setErrors({ alert: t(error) });
      }
    } else {
      setIsButtonLoading(false);
      logout();
      setErrors({ alert: t("PLEASE_ENTER_VALID_CREDENTIALS") });
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: location?.state
          ? ["backBtn", "helpBtn", "pwaBtn"]
          : ["helpBtn", "langBtn", "pwaBtn"],
        _box: { styles: { boxShadow: "0px 3px 16px rgba(0, 0, 0, 0.12)" } },
        _customProps: { display: "none" },
      }}
      analyticsPageTitle={"LOGIN"}
      pageTitle={t("LOGIN")}
      getRefAppBar={(e) => setRef(e)}
    >
      <VStack bg="bgGreyColor.200" minH={height - ref?.clientHeight} space="1">
        <FrontEndTypo.H1 color="textMaroonColor.400" ml="6" pt="6">
          {t("LOGIN")}
        </FrontEndTypo.H1>
        {isUserRegisterExist && (
          <Box py={6} px={4} mb={5}>
            <Alert
              status="info"
              shadow="AlertShadow"
              alignItems={"start"}
              mb="3"
            >
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <FrontEndTypo.H3>
                  {t("REGISTER_EXIST_LOGIN")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name)}
                </FrontEndTypo.H3>
                <CloseIcon
                  onClick={() => removeRegisterExist()}
                  style={{ cursor: "pointer" }}
                />
              </HStack>
            </Alert>
          </Box>
        )}

        <Image
          alignSelf="center"
          source={{
            uri: `/images/logos/${language}/educate-girls-pragati-300X300.png`,
          }}
          alt="Educate Girls"
          resizeMode="contain"
          size={200}
        />
        <VStack space={5} p="5">
          <CustomAlert
            title={t("ENTER_USERNAME_PASSWORD_SENT_ON_MOBILE")}
            status={"info"}
          />

          {"alert" in errors && (
            <Alert w="100%" status={"error"}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Subtitle color="coolGray.800">{errors.alert}</Subtitle>
                  </HStack>
                  <IconButton
                    variant="unstyled"
                    icon={<CloseIcon size="3" color="coolGray.600" />}
                    onPress={(e) => setErrors({})}
                  />
                </HStack>
              </VStack>
            </Alert>
          )}
          <form>
            <VStack space="2">
              <FormControl isRequired isInvalid={"username" in errors}>
                {/* <FormControl.Label
                _text={{ fontSize: "14px", fontWeight: "400" }}
                mb="10px"
              >
                {t("USERNAME")}
              </FormControl.Label> */}
                <Input
                  rounded="lg"
                  height="48px"
                  bg="white"
                  variant="unstyled"
                  p={"10px"}
                  placeholder={t("ENTER") + " " + t("USERNAME")}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      username: e?.target?.value?.trim(),
                    })
                  }
                />
                {"username" in errors && (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {errors.username}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={"password" in errors}>
                {/* <FormControl.Label
                _text={{ fontSize: "14px", fontWeight: "400" }}
              >
                {t("PASSWORD")}
              </FormControl.Label> */}

                <Input
                  rounded="lg"
                  height="48px"
                  bg="white"
                  variant="unstyled"
                  p={"10px"}
                  placeholder={t("ENTER") + " " + t("PASSWORD")}
                  type={showPassword ? "text" : "password"}
                  InputRightElement={
                    <IconByName
                      name={showPassword ? "EyeLineIcon" : "EyeOffLineIcon"}
                      _icon={{ size: "16px", color: "Defaultcolor.400" }}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  }
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e?.target?.value,
                    })
                  }
                />
                {"password" in errors && (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {errors.password}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </VStack>
            {/* <Caption>{t("TEXT_MESSAGE_MOBILE_NUMBER")}</Caption> */}
            {/* <BodyLarge>{t("RESEND_MY_USERNAME")}</BodyLarge> */}
            <FrontEndTypo.Primarybutton
              flex={1}
              p="4"
              my="5"
              onPress={handleLogin}
              isLoading={isButtonLoading}
            >
              {t("LOGIN")}
            </FrontEndTypo.Primarybutton>
          </form>
          <BodyMedium color="primary.500" textAlign="center">
            <FrontEndTypo.H2
              color="blueText.450"
              underline
              onPress={() => {
                navigate("/reset-password");
              }}
            >
              {t("USER_FORGET_PASSWORD")}
            </FrontEndTypo.H2>
          </BodyMedium>
        </VStack>
      </VStack>
    </Layout>
  );
}
