import { useCallback, useEffect, useState } from "react";
import {
  AdminLayout,
  AdminTypo,
  authRegistryService,
  Breadcrumb,
  CardComponent,
  IconByName,
  ImageView,
  PcuserService,
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Modal,
  useToast,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AssignedList from "./AssignedList";

import { changePasswordValidation } from "v2/utils/Helper/JSHelper";
import DatePicker from "../../../v2/components/Static/FormBaseInput/DatePicker";

function View() {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState();
  const [pcData, setPcData] = useState();
  const [assignPrerak, setAssignPrerak] = useState();
  const [assignPrerakCount, setAssignPrerakCount] = useState();
  const [dailyActivities, setDailyActivities] = useState([]);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [filter, setFilter] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPassword((prevConfirmPassword) => !prevConfirmPassword);
  }, []);

  const validate = useCallback(() => {
    const arr = changePasswordValidation(credentials, t);
    setErrors(arr);
    return !(arr.password || arr.confirmPassword);
  }, [credentials, t]);

  const handleResetPassword = async () => {
    setIsButtonLoading(true);
    if (validate()) {
      const bodyData = {
        id: id.toString(),
        password: credentials?.password,
      };
      const resetPassword =
        await authRegistryService.resetPasswordAdmin(bodyData);
      if (resetPassword.success === true) {
        setCredentials();
        setPasswordModal(false);
        toast.show({
          title: "Success",
          variant: "solid",
          description: resetPassword?.message,
        });
        setPasswordModal(false);
        setIsButtonLoading(false);
        return { status: true };
      } else if (resetPassword.success === false) {
        setIsButtonLoading(false);
        setCredentials();
        setPasswordModal(false);
        return { status: false };
      }
    } else {
      setIsButtonLoading(false);
      setCredentials();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await PcuserService.pcDetails({
        id: id,
        limit: 10,
        page: 1,
      });
      setData(result);
      setAssignPrerakCount(result?.data);
    };

    fetchData();
  }, [pcData]);

  useEffect(() => {
    const fetchData = async () => {
      if (filter?.date) {
        const payload = {
          ...filter,
          user_id: id,
        };
        const data = await PcuserService.activitiesDetails(payload);
        setDailyActivities(data?.data?.activities);
      }
    };
    fetchData();
  }, [filter]);

  return (
    <AdminLayout>
      <VStack flex={1} mt="5" space={4} p="4">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack space={2} alignItems={"center"}>
                  <IconByName name="TeamFillIcon" size="md" />
                  <AdminTypo.H4 bold>
                    {t("ALL_PRAGATI_COORDINATOR")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/admin/pc",
              icon: "GroupLineIcon",
            },

            <Chip
              textAlign="center"
              key={pcData?.id}
              lineHeight="15px"
              label={[
                pcData?.first_name,
                pcData?.middle_name,
                pcData?.last_name,
              ]
                .filter(Boolean)
                .join(" ")}
            />,
          ]}
        />
        <HStack justifyContent={"space-between"} flexWrap="wrap">
          <VStack space="4" flexWrap="wrap">
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
                {pcData?.mobile}
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
                  pcData?.state,
                  pcData?.district,
                  pcData?.block,
                  pcData?.village,
                  pcData?.grampanchayat,
                ]
                  .filter((e) => e)
                  .join(",")}
              </AdminTypo.H6>
            </HStack>
            <HStack space={4}>
              <AdminTypo.Secondarybutton
                onPress={() => setIsModalOpen(true)}
                rightIcon={
                  <IconByName
                    color="#084B82"
                    _icon={{}}
                    size="15px"
                    name="ShareLineIcon"
                  />
                }
              >
                {t("VIEW_DAILY_ACTIVITIES")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.Secondarybutton
                onPress={() => setPasswordModal(true)}
                rightIcon={
                  <IconByName
                    color="#084B82"
                    _icon={{}}
                    size="15px"
                    name="ShareLineIcon"
                  />
                }
              >
                {t("RESET_PASSWORD")}
              </AdminTypo.Secondarybutton>
            </HStack>
          </VStack>
          <HStack flex="0.5" justifyContent="center">
            {pcData?.profile_photo_1?.name ? (
              <ImageView
                source={{
                  uri: pcData?.profile_photo_1?.name,
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
        <HStack alignItems={"center"} p={4} space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0, flex: 1, bg: "light.100" }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            item={{
              ...data,
              name: `${pcData?.first_name}${pcData?.middle_name ? " " + pcData.middle_name : ""}${pcData?.last_name ? " " + pcData.last_name : ""}`,
              address: `${pcData?.state ?? ""}, ${pcData?.district ?? ""}, ${
                pcData?.block ?? ""
              }, ${pcData?.village ?? ""}${
                pcData?.address ? `, ${pcData?.address}` : ""
              }`,
              prerak_assigned: `${assignPrerakCount?.total_count}`,
              user_id: `${pcData?.user_id || ""}`,
              mobile: `${pcData?.mobile || ""}`,
              email_id: `${pcData?.email_id || ""}`,
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "USER_ID",
              "NAME",
              "MOBILE_NUMBER",
              "EMAIL_ID",
              "PRERAK_ASSIGNED",
              "IP_ADDRESS",
            ]}
            arr={[
              "user_id",
              "name",
              "mobile",
              "email_id",
              "prerak_assigned",
              "address",
            ]}
          />
        </HStack>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          safeAreaTop={true}
          size="xl"
        >
          <Modal.Content>
            <Modal.Header p="5" borderBottomWidth="0">
              <Box
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <AdminTypo.H3 color="black">{t("PC_ACTIVITIES")}</AdminTypo.H3>
                <Box style={{ flexDirection: "row" }}>
                  <Button
                    colorScheme="red"
                    onPress={(e) => setIsModalOpen(false)}
                  >
                    {t("CLOSE")}
                  </Button>
                  {/* <Button
                    ml={2}
                    colorScheme="red"
                    onPress={handleContinueBtn}
                    // isDisabled={isDisable}
                  >
                    {t("COMMENT")}
                  </Button> */}
                </Box>
              </Box>
              <Box width={"40%"}>
                <DatePicker setFilter={setFilter} filter={filter} />
              </Box>
            </Modal.Header>

            <Modal.Body p="5" pb="10">
              <VStack space="5" minHeight={"100px"}>
                {filter?.date && (
                  <table cellSpacing={"5px"} cellPadding={"5px"}>
                    <tr>
                      <th>{t("TITLE")}</th>
                      <th>{t("Description")}</th>
                      <th>{t("STATUS")}</th>
                      <th>{t("DURATION")}</th>
                    </tr>
                    {dailyActivities?.map((item, index) => {
                      return (
                        <tr
                          style={{ textAlign: "center", margin: "10px 0 " }}
                          key={index + 1}
                        >
                          <td>{t(item?.type)}</td>
                          <td>{item?.description}</td>
                          <td>{t("COMPLETED")}</td>
                          <td>
                            {item?.hours}:{item?.minutes}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                )}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal
          isOpen={passwordModal}
          onClose={() => setPasswordModal(false)}
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
                  <AdminTypo.H6 color="textGreyColor.100">
                    Username
                  </AdminTypo.H6>
                </HStack>
                <AdminTypo.H3 bold>{pcData?.username}</AdminTypo.H3>
              </HStack>
              <FormControl isRequired isInvalid mt="4" auto>
                <VStack space={3}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    InputRightElement={
                      <IconByName
                        name={showPassword ? "EyeLineIcon" : "EyeOffLineIcon"}
                        _icon={{ size: "16px", color: "Defaultcolor.400" }}
                        onPress={() => {
                          togglePasswordVisibility();
                        }}
                      />
                    }
                    name="new-password"
                    placeholder={
                      t("ENTER") + " " + t("NEW") + " " + t("PASSWORD")
                    }
                    autoComplete="new-password"
                    value={credentials?.password || ""}
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
                        name={
                          confirmPassword ? "EyeLineIcon" : "EyeOffLineIcon"
                        }
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
                    setPasswordModal(false);
                    setCredentials();
                  }}
                >
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  isLoading={isButtonLoading}
                  onPress={() => {
                    handleResetPassword();
                  }}
                >
                  {t("USER_SET_NEW_PASSWORD")}
                </AdminTypo.PrimaryButton>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <AssignedList setPcData={setPcData} setAssignPrerak={setAssignPrerak} />
      </VStack>
    </AdminLayout>
  );
}

View.propTypes = {};

export default View;
