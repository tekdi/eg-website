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
  Center,
  Stack,
} from "native-base";
import {
  useWindowSize,
  BodyMedium,
  Subtitle,
  H3,
  t,
  Caption,
  BodyLarge,
  login,
  logout,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

const styles = {
  box: {
    background:
      "linear-gradient(135deg, #e2f2fc -10%, #faf6f3 35%, #faf6f3 60%,#faf6f3 70%, #e2f2fc 110%)",
  },
};

export default function Login() {
  const ref = React.useRef(null);
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
    <Stack>
      <Center p="5" ref={ref} minH={Height / 2}>
        <Box width={"300px"} height={"150px"} bg="gray.300" rounded={"lg"}>
          {/* <Image
            source={{
              uri: "/splash.png",
            }}
            // alt="Alternate Text"
            width={"300px"}
            height={"118px"}
          /> */}
        </Box>
      </Center>
      <Box p="5" roundedTopRight={60} bg="gray.200" minH={Height - Height / 2}>
        <VStack space={5}>
          <H3 pt="4">{t("LOGIN")}</H3>
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
          <VStack space="4">
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
                      username: e.target.value,
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
                      password: e.target.value,
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
            <Caption>{t("TEXT_MESSAGE_MOBILE_NUMBER")}</Caption>
            <BodyLarge>{t("RESEND_MY_USERNAME")}</BodyLarge>
            <Button flex={1} variant={"primary"} onPress={handleLogin}>
              {t("SUBMIT")}
            </Button>
            <BodyMedium color="primary.500" textAlign="center">
              {t("CHANGE_MY_PASSWORD")}
            </BodyMedium>
          </VStack>
        </VStack>
      </Box>
    </Stack>
  );
}
