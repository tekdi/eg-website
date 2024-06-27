import {
  AdminTypo,
  CardComponent,
  IconByName,
  ImageView,
  VolunteerAdminLayout as Layout,
  Loading,
  authRegistryService,
  volunteerRegistryService,
} from "@shiksha/common-lib";
import Clipboard from "component/Clipboard";
import {
  Alert,
  FormControl,
  HStack,
  Input,
  Modal,
  VStack,
  useToast,
} from "native-base";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../../NotFound";
import { ChipStatus } from "./list/ChipStatus";
import Chip from "component/Chip";

export default function FacilitatorView({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();

  const profileDetails = useCallback(async () => {
    const result = await volunteerRegistryService.getOne({ id });
    setData(result?.data);
  }, [id]);

  useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  const showData = (item) => item || "-";

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
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H4 bold color="Activatedcolor.400">
              {t("ALL_PRERAK")}
            </AdminTypo.H4>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <AdminTypo.H4
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              bold
            >
              {data?.first_name} {data?.last_name}
            </AdminTypo.H4>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <Clipboard text={data?.id}>
              <Chip textAlign="center" lineHeight="15px" label={data?.id} />
            </Clipboard>
          </HStack>
          <HStack justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.user_roles?.[0]?.status} />
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                alignItems="center"
                p="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="CellphoneLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {data?.mobile}
                </AdminTypo.H6>
              </HStack>
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="MapPinLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
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
              <ApproveButton {...{ data, id, setData }} />
              <ResetPassword {...{ data, id }} />
            </VStack>
            <HStack flex="0.5" justifyContent="center">
              {data?.profile_photo_1?.name ? (
                <ImageView
                  source={{
                    uri: data?.profile_photo_1?.name,
                  }}
                  alt="profile photo"
                  width={"180px"}
                  height={"180px"}
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

          <VStack space={"5"} p="4">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS").toUpperCase()}
            </AdminTypo.H4>
            <CardComponent
              grid={2}
              _body={{ bg: "light.100" }}
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              label={[
                "FIRST_NAME",
                "MIDDLE_NAME",
                "LAST_NAME",
                "MOBILE_NO",
                "DATE_OF_BIRTH",
                "GENDER",
                "ADDRESS",
                "QUALIFICATION",
              ]}
              item={showData({
                ...data,
                qualification:
                  data?.qualifications?.[0]?.qualification_master?.name,
                address:
                  [
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
                    : "-",
              })}
              arr={[
                "first_name",
                "middle_name",
                "last_name",
                "mobile",
                "dob",
                "gender",
                "address",
                "qualification",
              ]}
            />
          </VStack>
        </VStack>
      </HStack>
    </Layout>
  );
}

const ApproveButton = memo(({ id, data, setData }) => {
  const toast = useToast();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleApproved = async () => {
    setIsButtonLoading(true);
    let status = "approved";
    if (data?.user_roles?.[0]?.status === "approved") {
      status = "applied";
    }
    const { message, error } = await volunteerRegistryService.update({
      id,
      user_roles: { ...(data?.user_roles?.[0] || {}), status },
    });

    if (!error) {
      let pre = data?.user_roles?.[0] || {};
      if (pre) {
        pre = { ...(pre || {}), status };
      }
      setData({ ...data, user_roles: [pre] });
      toast.show({
        render: () => <AlertMessage message={message} status="success" />,
      });
      setModalVisible(false);
    } else {
      toast.show({
        render: () => <AlertMessage message={error} status="warning" />,
      });
    }
    setIsButtonLoading(false);
  };

  return (
    <VStack>
      {data?.user_roles?.[0]?.status === "applied" && (
        <AdminTypo.Secondarybutton onPress={(e) => setModalVisible(true)}>
          {t("APPROVED")}
        </AdminTypo.Secondarybutton>
      )}
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
              {t("CONFIRM")}
            </AdminTypo.H1>
          </Modal.Header>
          <Modal.Body>
            <AdminTypo.H3 py="4" color="textGreyColor.500" textAlign="center">
              {t("VOLUNTEER_CONFIRM_STATUS")}
            </AdminTypo.H3>
          </Modal.Body>
          <Modal.Footer>
            <HStack justifyContent="space-between" width="100%">
              <AdminTypo.Secondarybutton
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                {t("NO")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton
                isLoading={isButtonLoading}
                onPress={handleApproved}
              >
                {t("YES")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
});

const ResetPassword = memo(({ data, id }) => {
  const toast = useToast();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPassword((prevConfirmPassword) => !prevConfirmPassword);
  }, []);

  const validate = useCallback(() => {
    let arr = {};
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (
      typeof credentials?.password === "undefined" ||
      credentials?.password === ""
    ) {
      arr = { ...arr, password: t("PASSWORD_IS_REQUIRED") };
    } else if (!regex.test(credentials?.password)) {
      arr = { ...arr, password: t("PASSWORD_REQUIREMENTS_NOTMATCH") };
    }

    if (
      typeof credentials?.confirmPassword === "undefined" ||
      credentials?.confirmPassword === ""
    ) {
      arr = { ...arr, confirmPassword: t("USER_CONFIRM_PASSWORD_IS_REQUIRED") };
    } else if (!regex.test(credentials?.confirmPassword)) {
      arr = {
        ...arr,
        confirmPassword: t("CONFIRM_PASSWORD_REQUIREMENTS_NOTMATCH"),
      };
    } else if (credentials?.confirmPassword !== credentials?.password) {
      arr = {
        ...arr,
        confirmPassword: t("USER_CONFIRM_PASSWORD_AND_PASSWORD_VALIDATION"),
      };
    }

    setErrors(arr);
    return !(arr.password || arr.confirmPassword);
  }, [credentials, t]);

  const handleResetPassword = async (password, confirm_password) => {
    setIsButtonLoading(true);
    if (validate()) {
      if (password === confirm_password) {
        const bodyData = {
          id: id.toString(),
          password: password,
        };
        const resetPassword =
          await authRegistryService.resetPasswordVolunteerAdmin(bodyData);

        if (resetPassword.success === true) {
          setCredentials();
          setModalVisible(false);
          toast.show({
            title: "Success",
            variant: "solid",
            description: resetPassword?.message,
          });
          setModalVisible(false);
          setIsButtonLoading(false);
          return { status: true };
        } else if (
          resetPassword.success === false ||
          resetPassword.status == "403"
        ) {
          setErrors((arr) => ({
            ...(arr || {}),
            password: resetPassword.message || resetPassword.error,
          }));
          setIsButtonLoading(false);
          setCredentials();
          return { status: false };
        }
      } else if (password !== confirm_password) {
        setIsButtonLoading(false);
        setCredentials();
        setModalVisible(false);
        return { status: false };
      }
    } else {
      setIsButtonLoading(false);
      setCredentials();
    }
  };

  return (
    <HStack space="9">
      <VStack space={4}>
        <AdminTypo.Secondarybutton
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {t("USER_RESET_PASSWORD")}
        </AdminTypo.Secondarybutton>
      </VStack>
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
              <HStack flex={1}>
                <IconByName
                  isDisabled
                  name="UserLineIcon"
                  color="textGreyColor.100"
                  size="xs"
                />
                <AdminTypo.H6 color="textGreyColor.100">Username</AdminTypo.H6>
              </HStack>
              <ChipStatus status={data?.user_roles?.[0]?.status} flex={1}>
                <AdminTypo.H6 bold>{data?.username}</AdminTypo.H6>
              </ChipStatus>
            </HStack>
            <FormControl isRequired isInvalid mt="4">
              <VStack space={3}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  InputRightElement={
                    <IconByName
                      name={showPassword ? "EyeLineIcon" : "EyeOffLineIcon"}
                      _icon={{
                        size: "16px",
                        color: "Defaultcolor.400",
                      }}
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
                {"password" in errors && (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {!credentials?.password && errors.password}
                  </FormControl.ErrorMessage>
                )}

                <Input
                  id="confirmPassword"
                  type={confirmPassword ? "text" : "password"}
                  InputRightElement={
                    <IconByName
                      name={confirmPassword ? "EyeLineIcon" : "EyeOffLineIcon"}
                      _icon={{
                        size: "16px",
                        color: "Defaultcolor.400",
                      }}
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
                {"confirmPassword" in errors && (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {!credentials?.confirmPassword && errors.confirmPassword}
                  </FormControl.ErrorMessage>
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
                isLoading={isButtonLoading}
                onPress={() => {
                  handleResetPassword(
                    credentials?.password,
                    credentials?.confirmPassword
                  );
                }}
              >
                {t("USER_SET_NEW_PASSWORD")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </HStack>
  );
});

const AlertMessage = ({ message, ...props }) => {
  return (
    <Alert status="warning" alignItems={"start"} {...props}>
      <HStack alignItems="center" space="2">
        <Alert.Icon />
        <VStack space="4" width={"100%"}>
          {message}
        </VStack>
      </HStack>
    </Alert>
  );
};
