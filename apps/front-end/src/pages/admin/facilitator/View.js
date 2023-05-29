import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  facilitatorRegistryService,
  H3,
  H1,
  H2,
  BodySmall,
  Loading,
  t,
  authRegistryService,
  ImageView,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
  Modal,
  FormControl,
  Input,
  ChevronRightIcon,
  useToast,
  Image,
} from "native-base";
import { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import StatusButton from "./view/StatusButton";
import Steper from "component/Steper";

const Experience = (obj) => {
  return (
    <VStack>
      {obj?.role_title ? (
        <Text>
          {t("ROLE")} : {obj?.role_title}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.experience_in_years ? (
        <Text>
          {t("YEARS_OF_EX")} : {obj?.experience_in_years}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.description ? (
        <Text>
          {t("DESCRIPTION")} : {obj?.description}
        </Text>
      ) : (
        <React.Fragment />
      )}
    </VStack>
  );
};

export default function FacilitatorView({ footerLinks }) {
  const toast = useToast();

  const { id } = useParams();
  const [data, setData] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [otpData, setotpData] = React.useState();
  const [errors, setErrors] = React.useState({});

  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
  }, []);

  const showData = (item) => (item ? item : "-");

  const validate = () => {
    let arr = {};
    if (
      typeof credentials?.password === "undefined" ||
      credentials?.password === ""
    ) {
      arr = { ...arr, password: t("PASSWORD_IS_REQUIRED") };
    }

    if (
      typeof credentials?.confirmPassword === "undefined" ||
      credentials?.confirmPassword === ""
    ) {
      arr = { ...arr, confirmPassword: t("USER_CONFIRM_PASSWORD_IS_REQUIRED") };
    }

    setErrors(arr);
    if (arr.password || arr.confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    const sendotpBody = {
      mobile: data?.mobile.toString(),
      reason: "verify_mobile",
    };
    const datas = await authRegistryService.sendOtp(sendotpBody);
    setotpData(datas);
  };

  const handleResetPassword = async (password, confirm_password) => {
    if (validate()) {
      if (password === confirm_password) {
        const bodyData = {
          id: id.toString(),
          password: password,
        };
        const resetPassword = await authRegistryService.resetPasswordAdmin(
          bodyData
        );
        if (resetPassword.success === true) {
          setCredentials();
          setModalVisible(false);
          toast.show({
            title: "Success",
            variant: "solid",
            description: resetPassword?.message,
          });

          navigate("/");
          return { status: true };
        } else if (resetPassword.success === false) {
          setCredentials();
          setModalVisible(false);
          return { status: false };
        }
      }
    } else {
      setCredentials();
    }
  };

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data) || data.error) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }
  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <Image
              source={{
                uri: "/profile.svg",
              }}
              alt="Prerak Orientation"
              size="30px"
              resizeMode="contain"
            />
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <H1 color="textGreyColor.550"> {t("ALL_PRERAK")}</H1>
          </HStack>
          <HStack alignItems="center" flexWrap="wrap">
            <VStack flex="0.6" direction="column">
              <HStack alignItems="center" mb="6" space="4" flexWrap="wrap">
                <H1
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {data?.first_name} {data?.last_name}
                </H1>
                <ChipStatus status={data?.status} />
                <HStack
                  bg="badgeColor.400"
                  rounded={"md"}
                  alignItems="center"
                  p="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="CellphoneLineIcon"
                    color="textGreyColor.300"
                  />
                  <Text>{data?.mobile}</Text>
                </HStack>
                <HStack
                  bg="badgeColor.400"
                  rounded={"md"}
                  p="2"
                  alignItems="center"
                  space="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="MapPinLineIcon"
                    color="textGreyColor.300"
                  />
                  <BodySmall>
                    {[
                      data?.state,
                      data?.district,
                      data?.block,
                      data?.village,
                      data?.grampanchayat,
                    ]
                      .filter((e) => e)
                      .join(",")}
                  </BodySmall>
                </HStack>
              </HStack>
              <H2 bold pb="2">
                {t("ELIGIBILITY_CRITERIA").toUpperCase()}
              </H2>
              <HStack width={"100%"}>
                <Box flex={0.3}>
                  <Steper size={100} type="circle" progress={75} bg="white" />
                </Box>
                <VStack flex={0.7} space="2">
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall> {t("QUALIFICATION")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        {
                          value: 135,
                          color: "progressBarColor.200",
                        },
                        { value: 80, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("WORK_EXPERIENCE")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("VOLUNTEER_EXPERIENCE")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("AVAILABILITY")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
            <HStack flex="0.4" pl="5" justifyContent="center">
              {data?.documents?.[0]?.name ? (
                <ImageView
                  source={{
                    uri: data?.documents?.[0]?.name,
                  }}
                  // alt="Alternate Text"
                  width={"190px"}
                  height={"190px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="textGreyColor.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </HStack>
          </HStack>

          <HStack alignItems={Center} space="9" pt="5">
            <VStack flex={0.3} space="5">
              <Button
                bg="sendMessageBtn.200"
                leftIcon={<IconByName isDisabled name="MessageLineIcon" />}
              >
                {t("SEND_MESSAGE")}
              </Button>
            </VStack>
            <VStack flex={0.2} space="1" direction="row">
              <Button
                variant="outlinePrimary"
                leftIcon={<IconByName isDisabled name="LockUnlockLineIcon" />}
                onPress={() => {
                  setModalVisible(true);
                  handleSendOtp();
                }}
              >
                {t("USER_RESET_PASSWORD")}
              </Button>
            </VStack>
          </HStack>

          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header textAlign={"Center"}>
                {t("USER_RESET_PASSWORD")}
              </Modal.Header>
              <Modal.Body p="5" pb="10" mx={5} overflowX="hidden">
                <HStack space={3}>
                  <IconByName isDisabled name="UserLineIcon" />
                  <H3
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {data?.first_name} {data?.last_name}
                  </H3>
                </HStack>
                <br />
                <FormControl isRequired isInvalid>
                  <VStack justifyContent="space-between" space={30}>
                    <Input
                      id="password"
                      rounded="lg"
                      height="48px"
                      bg="white"
                      variant="unstyled"
                      p={"10px"}
                      type="password"
                      placeholder={
                        t("ENTER") + " " + t("NEW") + " " + t("PASSWORD")
                      }
                      value={credentials?.password ? credentials?.password : ""}
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

                    <Input
                      id="confirmPassword"
                      rounded="lg"
                      height="48px"
                      bg="white"
                      variant="unstyled"
                      p={"10px"}
                      type="password"
                      placeholder={
                        t("CONFIRM") + " " + t("NEW") + " " + t("PASSWORD")
                      }
                      value={
                        credentials?.confirmPassword
                          ? credentials?.confirmPassword
                          : ""
                      }
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          confirmPassword: e?.target?.value?.trim(),
                        })
                      }
                    />

                    {"confirmPassword" in errors ? (
                      <FormControl.ErrorMessage
                        _text={{
                          fontSize: "xs",
                          color: "error.500",
                          fontWeight: 500,
                        }}
                      >
                        {!credentials?.confirmPassword ? (
                          errors.confirmPassword
                        ) : (
                          <React.Fragment />
                        )}
                      </FormControl.ErrorMessage>
                    ) : (
                      <React.Fragment />
                    )}
                  </VStack>
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="space-between" space={30}>
                  <Button
                    borderRadius="full"
                    colorScheme="blueGray"
                    onPress={() => {
                      setModalVisible(false);
                      setCredentials();
                    }}
                  >
                    {t("CANCEL")}
                  </Button>
                  <Button
                    borderRadius="full"
                    colorScheme="trueGray"
                    onPress={() => {
                      credentials?.password === credentials?.confirmPassword
                        ? handleResetPassword(
                            credentials?.password,
                            credentials?.confirmPassword
                          )
                        : toast.show({
                            title: "Error",
                            variant: "solid",
                            description: t(
                              "USER_CONFIRM_PASSWORD_AND_PASSWORD_VALIDATION"
                            ),
                          });
                    }}
                  >
                    <HStack>
                      {t("USER_SET_NEW_PASSWORD")}
                      <ChevronRightIcon size="xs" />
                    </HStack>
                  </Button>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <VStack space={"5"} p="5" mt="6">
            <H2 bold>{t("PROFILE_DETAILS").toUpperCase()}</H2>
            <HStack justifyContent="space-between">
              <VStack space={"5"} w="50%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <Heading fontSize="16px">{t("BASIC_DETAILS")}</Heading>
                  <IconByName
                    color="editIcon.300"
                    size="30px"
                    name="EditBoxLineIcon"
                  ></IconByName>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("FIRST_NAME")} </Text>
                  <Text>{showData(data?.first_name)}</Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("LAST_NAME")} </Text>
                  <Text>{showData(data?.last_name)}</Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("MOBILE_NO")} </Text>
                  <Text>{showData(data?.mobile)}</Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("DATE_OF_BIRTH")} </Text>
                  <Text>{showData(data?.dob)}</Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("GENDER")} </Text>
                  <Text>{showData(data?.gender)}</Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("ADDRESS")} </Text>
                  <Text>
                    {[
                      data?.state,
                      data?.district,
                      data?.block,
                      data?.village,
                      data?.grampanchayat,
                    ].filter((e) => e).length > 0
                      ? [
                          data?.state,
                          data?.district,
                          data?.block,
                          data?.village,
                          data?.grampanchayat,
                        ]
                          .filter((e) => e)
                          .join(", ")
                      : "-"}
                  </Text>
                </HStack>

                <HStack>
                  <Text color="warmGray.500">{t("AADHAAR_NO")} </Text>
                  <Text>{showData(data?.aadhar_token)}</Text>
                </HStack>
              </VStack>
              <HStack
                space="20px"
                w="50%"
                bg="light.100"
                p="6"
                ml="2"
                rounded="xl"
              >
                <VStack
                  display="Flex"
                  flexDirection="column"
                  space="20px"
                  w="100%"
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="light.400"
                    pb="1"
                    borderBottomWidth="1"
                  >
                    <Heading fontSize="16px">{t("EDUCATION")} </Heading>
                    <IconByName
                      color="editIcon.300"
                      size="30px"
                      name="EditBoxLineIcon"
                    ></IconByName>
                  </HStack>
                  <VStack>
                    <Text color="warmGray.500">{t("QUALIFICATION")} </Text>
                    <VStack>
                      {data?.qualifications && data?.qualifications
                        ?.filter(
                          (e) =>
                            e?.qualification_master?.type === "qualification"
                        )
                        ?.map((qua, key) => {
                          return (
                            <Text key={key}>
                              {qua?.qualification_master?.name}
                            </Text>
                          );
                        })}
                    </VStack>
                    <VStack space="2">
                      <Text color="warmGray.500">
                        {t("TEACHING_QUALIFICATION")}{" "}
                      </Text>
                      {data?.qualifications ? (
                        data?.qualifications
                          ?.filter(
                            (e) => e?.qualification_master?.type === "teaching"
                          )
                          ?.map((qua, key) => {
                            return (
                              <Text key={key}>
                                {qua?.qualification_master?.name}
                              </Text>
                            );
                          })
                      ) : (
                        <Text>{"-"}</Text>
                      )}
                    </VStack>
                  </VStack>

                  <VStack space="4">
                    <VStack space="2">
                      <Text color="warmGray.500">{t("WORK_EXPERIENCE")} </Text>
                      <VStack space={5}>
                        {data?.experience ? (
                          data?.experience?.map((e, key) => (
                            <Experience key={key} {...e} />
                          ))
                        ) : (
                          <Text>{"-"}</Text>
                        )}
                      </VStack>
                    </VStack>
                    <VStack space="2">
                      <Text color="warmGray.500">
                        {t("VOLUNTEER_EXPERIENCE")}
                      </Text>
                      <VStack space={5}>
                        {data?.vo_experience ? (
                          data?.vo_experience?.map((e, key) => (
                            <Experience key={key} {...e} />
                          ))
                        ) : (
                          <Text>{"-"}</Text>
                        )}
                      </VStack>
                    </VStack>
                  </VStack>
                  <HStack space="20px">
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      borderColor="light.400"
                      pb="1"
                      borderBottomWidth="1"
                    >
                      <Heading fontSize="16px">{t("OTHER_DETAILS")}</Heading>
                      <IconByName
                        color="editIcon.300"
                        size="30px"
                        name="EditBoxLineIcon"
                      ></IconByName>
                    </HStack>
                    <HStack>
                      <Text color="warmGray.500">{t("AVAILABILITY")} </Text>
                      <Text>
                        {showData(
                          data?.program_faciltators?.availability?.replaceAll(
                            "_",
                            " "
                          )
                        )}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text color="warmGray.500">{t("DEVICE_OWNERSHIP")} </Text>
                      <Text>{showData(data?.device_ownership)}</Text>
                    </HStack>
                    <HStack>
                      <Text color="warmGray.500">{t("TYPE_OF_DEVICE")} </Text>
                      <Text>{showData(data?.device_type)}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
            </HStack>
          </VStack>
          <StatusButton {...{ data, setData }} />
        </VStack>

        {/* <VStack
          flex={0.18}
          bg="white.300"
          px="3"
          py="5"
          space={"5"}
          borderColor="light.400"
          pb="1"
          borderLeftWidth="1"
        >
          <HStack justifyContent="space-between" alignItems={"center"}>
            <IconByName isDisabled name="EditBoxLineIcon" />
            <H3>{t("COMMENT_SECTION")}</H3>
            <IconByName isDisabled name="ArrowRightSLineIcon" />
          </HStack>
          <VStack space={"3"}>
            {[
              { name: t("YOU"), message: t("PROFILE_NEEDS_TO_BE_COMPLETED") },
              {
                name: "Manoj",
                message: t("PROFILE_NEEDS_TO_BE_COMPLETED"),
              },
            ].map((item, key) => (
              <VStack key={key} space={"1"}>
                <HStack space={"3"}>
                  <IconByName
                    isDisabled
                    color="gray.300"
                    _icon={{ size: "24px" }}
                    name="AccountCircleLineIcon"
                  />
                  <BodyLarge>{item?.name}</BodyLarge>
                </HStack>
                <Box bg="gray.200" p="4">
                  <BodySmall>{item?.message}</BodySmall>
                </Box>
              </VStack>
            ))}
          </VStack>
        </VStack> */}
      </HStack>
    </Layout>
  );
}
