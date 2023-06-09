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
  AdminTypo,
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
  Image,
  useToast,
} from "native-base";
import { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import StatusButton from "./view/StatusButton";
import Steper from "component/Steper";
import Interviewschedule from "./view/Interviewschedule";
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassword(!confirmPassword);
  };
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
           
            <AdminTypo.H1 color="Activatedcolor.400">
              {" "}
              {t("ALL_PRERAK")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
             <AdminTypo.H1
                  color="textGreyColor.800"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {data?.first_name} {data?.last_name}
                </AdminTypo.H1>
          </HStack>
          <HStack alignItems="center" flexWrap="wrap">
            <VStack flex="0.6" direction="column">
              <HStack alignItems="center" mb="6" space="4" flexWrap="wrap">
               
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
                  <AdminTypo.H6 color="textGreyColor.600" bold>
                    {data?.mobile}
                  </AdminTypo.H6>
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
                  <AdminTypo.H6 color="textGreyColor.600" bold>
                    {[
                      data?.state,
                      data?.district,
                      data?.block,
                      data?.village,
                      data?.grampanchayat,
                    ]
                      .filter((e) => e)
                      .join(",")}
                  </AdminTypo.H6>
                </HStack>
              </HStack>
              <AdminTypo.H4 color="textGreyColor.800" bold pb="2">
                {t("ELIGIBILITY_CRITERIA").toUpperCase()}
              </AdminTypo.H4>
              <HStack width={"100%"}>
                <Box flex={0.3}>
                  <Steper size={100} type="circle" progress={75} bg="white" />
                </Box>
                <VStack flex={0.7} space="2">
                  <HStack alignItems={"center"} space={"2"}>
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {" "}
                      {t("QUALIFICATION")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("WORK_EXPERIENCE")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("VOLUNTEER_EXPERIENCE")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("AVAILABILITY")}
                    </AdminTypo.H7>
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
            <VStack>
              <AdminTypo.PrimaryButton
                leftIcon={<IconByName isDisabled name="MessageLineIcon" />}
              >
                {t("SEND_MESSAGE")}
              </AdminTypo.PrimaryButton>
            </VStack>
            <VStack>
              <AdminTypo.Secondarybutton
                leftIcon={<IconByName isDisabled name="LockUnlockLineIcon" />}
                onPress={() => {
                  setModalVisible(true);
                  handleSendOtp();
                }}
              >
                {t("USER_RESET_PASSWORD")}
              </AdminTypo.Secondarybutton>
            </VStack>
          </HStack>
          <Box paddingTop="32px">
            {data?.status === "screened" ? (
              <Interviewschedule />
            ) : (
              <React.Fragment />
            )}
          </Box>
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header textAlign={"Center"}>
                <AdminTypo.H1 color="textGreyColor.500">
                  {t("USER_RESET_PASSWORD")}
                </AdminTypo.H1>
              </Modal.Header>
              <Modal.Body>
                <HStack justifyContent="space-between">
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      Username
                    </AdminTypo.H6>
                  </HStack>
                  <ChipStatus status={data?.status}>
                    <AdminTypo.H6 bold>
                      {data?.first_name} {data?.last_name}
                    </AdminTypo.H6>
                  </ChipStatus>
                </HStack>
                <FormControl isRequired isInvalid mt="4">
                  <VStack space={30}>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      InputRightElement={
                        <IconByName
                          name="EyeOffLineIcon"
                          _icon={{ size: "16px", color: "Defaultcolor.400" }}
                          onPress={() => {
                            togglePasswordVisibility();
                          }}
                        />
                      }
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
                    <AdminTypo.H6>
                      8 characters, 1 Capital, 1 Small, 1 Number
                    </AdminTypo.H6>
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
                      type={confirmPassword ? "text" : "password"}
                      InputRightElement={
                        <IconByName
                          name="EyeOffLineIcon"
                          _icon={{ size: "16px", color: "Defaultcolor.400" }}
                          onPress={() => {
                            toggleConfirmPasswordVisibility();
                          }}
                        />
                      }
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
                    <AdminTypo.H6>
                      8 characters, 1 Capital, 1 Small, 1 Number
                    </AdminTypo.H6>
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
                <HStack justifyContent="space-between" width="100%">
                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      setModalVisible(false);
                      setCredentials();
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton
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
                    {t("USER_SET_NEW_PASSWORD")}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <VStack space={"5"} p="5" mt="6">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS").toUpperCase()}
            </AdminTypo.H4>
            <HStack justifyContent="space-between">
              <VStack space={"5"} w="50%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("BASIC_DETAILS")}
                  </AdminTypo.H5>
                  <IconByName
                    color="editIcon.300"
                    size="30px"
                    name="EditBoxLineIcon"
                  ></IconByName>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("FIRST_NAME")} :
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.first_name)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("LAST_NAME")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.last_name)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("MOBILE_NO")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.mobile)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("DATE_OF_BIRTH")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.dob)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("GENDER")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.gender)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("ADDRESS")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" pl="1" bold>
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
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("AADHAAR_NO")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {showData(data?.aadhar_token)}
                  </AdminTypo.H5>
                </HStack>
              </VStack>
              <VStack
                space={"5"}
                w="50%"
                bg="light.100"
                p="6"
                rounded="xl"
                ml="3"
              >
                <HStack bg="light.100" p="1" mx="1" rounded="xl">
                  <VStack space="20px" w="100%">
                    <VStack space="20px" w="100%" rounded="xl">
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        borderColor="light.400"
                        pb="1"
                        borderBottomWidth="1"
                      >
                        <AdminTypo.H5 color="textGreyColor" bold>
                          {t("EDUCATION")}{" "}
                        </AdminTypo.H5>
                        <IconByName
                          color="editIcon.300"
                          size="30px"
                          name="EditBoxLineIcon"
                        ></IconByName>
                      </HStack>
                      <HStack>
                        <AdminTypo.H5 color="textGreyColor.550">
                          {t("QUALIFICATION")}{" "}
                        </AdminTypo.H5>
                        <AdminTypo.H5 color="textGreyColor.800" bold>
                          {data?.qualifications &&
                            data?.qualifications
                              ?.filter(
                                (e) =>
                                  e?.qualification_master?.type ===
                                  "qualification"
                              )
                              ?.map((qua, key) => {
                                return (
                                  <AdminTypo.H5
                                    color="textGreyColor.800"
                                    bold
                                    key={key}
                                  >
                                    {qua?.qualification_master?.name}
                                  </AdminTypo.H5>
                                );
                              })}
                        </AdminTypo.H5>
                        <HStack space="2">
                          <AdminTypo.H5 color="textGreyColor.550">
                            {t("TEACHING_QUALIFICATION")}{" "}
                          </AdminTypo.H5>
                          {data?.qualifications ? (
                            data?.qualifications
                              ?.filter(
                                (e) =>
                                  e?.qualification_master?.type === "teaching"
                              )
                              ?.map((qua, key) => {
                                return (
                                  <AdminTypo.H5
                                    color="textGreyColor.800"
                                    bold
                                    key={key}
                                  >
                                    {qua?.qualification_master?.name}
                                  </AdminTypo.H5>
                                );
                              })
                          ) : (
                            <Text>{"-"}</Text>
                          )}
                        </HStack>
                      </HStack>

                      <VStack space="4">
                        <HStack space="2">
                          <AdminTypo.H5 color="textGreyColor.550">
                            {t("WORK_EXPERIENCE")}{" "}
                          </AdminTypo.H5>
                          <VStack space={5}  width="70%">
                            {data?.experience ? (
                              data?.experience?.map((e, key) => (
                                <Experience key={key} {...e} />
                              ))
                            ) : (
                              <AdminTypo.H5 color="textGreyColor.800" bold>
                                {"-"}
                              </AdminTypo.H5>
                            )}
                          </VStack>
                        </HStack>
                        <HStack space="2">
                          <AdminTypo.H5 color="textGreyColor.550">
                            {t("VOLUNTEER_EXPERIENCE")}
                          </AdminTypo.H5>
                          <VStack space={5} width="70%">
                            {data?.vo_experience ? (
                              data?.vo_experience?.map((e, key) => (
                                <Experience key={key} {...e} />
                              ))
                            ) : (
                              <AdminTypo.H5 color="textGreyColor.800" bold>
                                {"-"}
                              </AdminTypo.H5>
                            )}
                          </VStack>
                        </HStack>
                      </VStack>
                    </VStack>
                  </VStack>
                </HStack>
                <VStack space="20px" w="100%" mt="3" rounded="xl">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="light.400"
                    pb="1"
                    borderBottomWidth="1"
                  >
                    <AdminTypo.H5 color="textGreyColor" bold>
                      {t("OTHER_DETAILS")}
                    </AdminTypo.H5>
                    <IconByName
                      color="editIcon.300"
                      size="22px"
                      name="EditBoxLineIcon"
                    ></IconByName>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("AVAILABILITY")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {showData(
                        data?.program_faciltators?.availability?.replaceAll(
                          "_",
                          " "
                        )
                      )}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("DEVICE_OWNERSHIP")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {showData(data?.device_ownership)}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("TYPE_OF_DEVICE")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {showData(data?.device_type)}
                    </AdminTypo.H5>
                  </HStack>
                </VStack>
              </VStack>
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
