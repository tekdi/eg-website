import React, { useState } from "react";
import {
  HStack,
  Button,
  Box,
  FormControl,
  Input,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
  Image,
} from "native-base";
import {
  useWindowSize,
  Subtitle,
  t,
  login,
  logout,
  H1,
  Layout,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
const styles = {
  box: {
    background:
      "linear-gradient(135deg, #e2f2fc -10%, #faf6f3 35%, #faf6f3 60%,#faf6f3 70%, #e2f2fc 110%)",
  },
};

export default function Login() {
  const [ref, setRef] = React.useState(null);
  const [width, Height] = useWindowSize();
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();

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
      const loginData = await login(credentials);
      navigate("/");
      navigate(0);
    } else {
      logout();
      setErrors({ alert: t("PLEASE_ENTER_VALID_CREDENTIALS") });
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["helpBtn"],
        _box: { styles: { boxShadow: "0px 3px 16px rgba(0, 0, 0, 0.12)" } },
      }}
      getRefAppBar={(e) => setRef(e)}
    >
      <VStack
        bg="bgGreyColor.200"
        minH={Height - ref?.clientHeight}
        space="50px"
      >
        <H1 color="textMaroonColor.400" textAlign="center" pt="6">
          {t("LOGIN")}
        </H1>
        <Image
          alignSelf="center"
          source={{
            uri: "/login.png",
          }}
          alt=""
          width="240"
          height="144"
        />
        <VStack space={5} p="5">
          <Alert status="info" colorScheme="info" textAlign="center">
            <VStack space={2} flexShrink={1}>
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  {t("ENTER_USERNAME_PASSWORD_SENT_ON_MOBILE")}
                </HStack>
              </HStack>
            </VStack>
          </Alert>
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
            <></>
          )}
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
                <></>
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
                type="password"
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e?.target?.value,
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
                  {errors.password}
                </FormControl.ErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
          </VStack>
          {/* <Caption>{t("TEXT_MESSAGE_MOBILE_NUMBER")}</Caption> */}
          {/* <BodyLarge>{t("RESEND_MY_USERNAME")}</BodyLarge> */}
          <Button flex={1} variant={"primary"} p="4" onPress={handleLogin}>
            {t("LOGIN")}
          </Button>
          {/* <BodyMedium color="primary.500" textAlign="center">
              {t("CHANGE_MY_PASSWORD")}
            </BodyMedium> */}
        </VStack>
      </VStack>
    </Layout>
  );
}
