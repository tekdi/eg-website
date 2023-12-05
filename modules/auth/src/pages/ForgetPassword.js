import React, { useState } from "react";
import {
  HStack,
  FormControl,
  Input,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
  Image,
  useToast,
} from "native-base";
import {
  useWindowSize,
  Subtitle,
  t,
  Layout,
  authRegistryService,
  CustomOTPBox,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

const styles = {
  box: {
    background:
      "linear-gradient(135deg, #e2f2fc -10%, #faf6f3 35%, #faf6f3 60%,#faf6f3 70%, #e2f2fc 110%)",
  },
};

export default function ForgetPassword() {
  const toast = useToast();

  const [ref, setRef] = React.useState(null);
  const [width, Height] = useWindowSize();
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = React.useState({});
  const [visible, setVisible] = useState(false);
  const [OtpValue, setOtpValue] = useState(true);
  const [isDisable, setIsDisable] = React.useState(false);

  const [otpData, setotpData] = useState();
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate("/login");
  };

  const validate = () => {
    let arr = {};
    if (
      typeof credentials?.username === "undefined" ||
      credentials?.username === ""
    ) {
      arr = { ...arr, username: t("USERNAME_IS_REQUIRED") };
    }

    setErrors(arr);
    return !arr.username;
  };

  const validatePassword = () => {
    let arr = {};
    if (
      typeof credentials?.password === "undefined" ||
      credentials?.password === ""
    ) {
      arr = { ...arr, password: t("PASSWORD_IS_REQUIRED") };
    }
    if (
      typeof credentials?.confirm_password === "undefined" ||
      credentials?.confirm_password === ""
    ) {
      arr = {
        ...arr,
        confirm_password: t("USER_CONFIRM_PASSWORD_IS_REQUIRED"),
      };
    }

    setErrors(arr);
    if (arr.password || arr.confirm_password) {
      return false;
    }
    return true;
  };

  const handleLogin = async (username) => {
    if (validate()) {
      setIsDisable(true);
      const sendotpBody = {
        username: username.toString(),
        reason: "verify-mobile",
      };
      const datas = await authRegistryService.resetPasswordByUserName(
        sendotpBody
      );
      if (datas.success === true) {
        setIsDisable(true);
        setotpData(datas);
        setVisible(true);
        setOtpValue(false);
      } else if (datas.status === 400) {
        setIsDisable(false);
        toast.show({
          title: "Error",
          variant: "solid",
          description: datas?.error,
        });
      }
    } else {
      setIsDisable(false);
      setErrors({ alert: t("USERNAME_IS_REQUIRED") });
    }
  };

  const handleResetPassword = async (username, password, confirm_password) => {
    if (validatePassword()) {
      if (password === confirm_password) {
        const bodyData = {
          username: username,
          otp: credentials?.otp.toString(),
          reason: "verify-mobile",
          hash: otpData?.data?.hash,
          password: password,
        };

        const resetPassword = await authRegistryService.forgetPassword(
          bodyData
        );
        if (resetPassword.success === true) {
          toast.show({
            title: "Success",
            variant: "solid",
            description: resetPassword?.message,
          });
          navigate("/");
        } else if (resetPassword.status === 400) {
          toast.show({
            title: "Error",
            variant: "solid",
            description: resetPassword?.error,
          });
        }
      } else if (datas.success === false) {
        alert("Confirm password and password does not match ");
      }
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["helpBtn", "backBtn"],
        _box: { styles: { boxShadow: "0px 3px 16px rgba(0, 0, 0, 0.12)" } },
      }}
      getRefAppBar={(e) => setRef(e)}
    >
      <VStack
        bg="bgGreyColor.200"
        minH={Height - ref?.clientHeight}
        space="50px"
      >
        <FrontEndTypo.H1 color="textMaroonColor.400" ml="6" pt="6">
          {t("USER_RESET_PASSWORD")}
        </FrontEndTypo.H1>
        <Image
          alignSelf="center"
          source={{
            uri: "/images/auth/forget_password.png",
          }}
          alt="reset password"
          width="310"
          height="215"
        />
        <VStack space={5} p="5">
          {"alert" in errors ? (
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
          ) : (
            <React.Fragment />
          )}
          <VStack space="4">
            <FormControl isRequired isInvalid={"username" in errors}>
              <Input
                isInvalid
                _input={{ type: "number", sagar: "sagar" }}
                rounded="lg"
                height="48px"
                bg="white"
                variant="unstyled"
                p={"10px"}
                placeholder={t("ENTER") + " " + t("USERNAME")}
                value={credentials?.username}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    username: e?.target?.value?.trim(),
                  })
                }
              />
              {"username" in errors ? (
                <FormControl.ErrorMessage
                  _text={{
                    fontSize: "xs",
                    color: "error.500",
                    fontWeight: 500,
                  }}
                >
                  {errors.username}
                </FormControl.ErrorMessage>
              ) : (
                <React.Fragment />
              )}
            </FormControl>
            {visible ? (
              <FormControl isRequired isInvalid={"otp" in errors}>
                <CustomOTPBox
                  onChange={(e) => {
                    setCredentials({
                      ...credentials,
                      otp: e.trim(),
                    });
                  }}
                  resendOTP={() => {
                    handleLogin(credentials?.username);
                  }}
                />
                {"otp" in errors ? (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {errors.otp}
                  </FormControl.ErrorMessage>
                ) : (
                  <React.Fragment />
                )}
              </FormControl>
            ) : (
              <React.Fragment />
            )}
            {credentials?.otp ? (
              <VStack space={4}>
                <FormControl isRequired isInvalid={"password" in errors}>
                  <Input
                    rounded="lg"
                    height="48px"
                    bg="white"
                    variant="unstyled"
                    p={"10px"}
                    placeholder={t("ENTER") + " " + t("PASSWORD")}
                    type="password"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e?.target?.value?.trim(),
                      })
                    }
                  />
                  {"password" in errors ? (
                    <FormControl.ErrorMessage
                      _text={{
                        fontSize: "xs",
                        color: "error.500",
                        fontWeight: 500,
                      }}
                    >
                      {!credentials?.password ? (
                        errors.password
                      ) : (
                        <React.Fragment />
                      )}
                    </FormControl.ErrorMessage>
                  ) : (
                    <React.Fragment />
                  )}
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={"confirm_password" in errors}
                >
                  <Input
                    rounded="lg"
                    height="48px"
                    bg="white"
                    variant="unstyled"
                    p={"10px"}
                    placeholder={t("ENTER") + " " + t("USER_CONFIRM_PASSWORD")}
                    type="password"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        confirm_password: e?.target?.value?.trim(),
                      })
                    }
                  />
                  {"confirm_password" in errors ? (
                    <FormControl.ErrorMessage
                      _text={{
                        fontSize: "xs",
                        color: "error.500",
                        fontWeight: 500,
                      }}
                    >
                      {!credentials?.confirm_password ? (
                        errors.confirm_password
                      ) : (
                        <React.Fragment />
                      )}
                    </FormControl.ErrorMessage>
                  ) : (
                    <React.Fragment />
                  )}
                </FormControl>
              </VStack>
            ) : (
              <React.Fragment />
            )}
          </VStack>
          {OtpValue ? (
            <FrontEndTypo.Primarybutton
              flex={1}
              p="4"
              onPress={() => {
                handleLogin(credentials?.username);
              }}
              isDisabled={isDisable}
              isLoading={isDisable}
            >
              {t("SEND")}
            </FrontEndTypo.Primarybutton>
          ) : (
            <FrontEndTypo.Primarybutton
              flex={1}
              variant={"primary"}
              p="4"
              onPress={() => {
                credentials?.password === credentials?.confirm_password
                  ? handleResetPassword(
                      credentials?.username,
                      credentials?.password,
                      credentials?.confirm_password
                    )
                  : toast.show({
                      title: "Error",
                      variant: "solid",
                      description:
                        "Confirm password is not matched with Password",
                    });
              }}
            >
              {t("SUBMIT")}
            </FrontEndTypo.Primarybutton>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}
