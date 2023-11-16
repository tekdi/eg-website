import React, { useState } from "react";
import {
  IconByName,
  AdminLayout as Layout,
  facilitatorRegistryService,
  Loading,
  t,
  authRegistryService,
  ImageView,
  AdminTypo,
  tableCustomStyles,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  Center,
  HStack,
  Text,
  VStack,
  Modal,
  FormControl,
  Input,
  useToast,
  Checkbox,
} from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import StatusButton from "./view/StatusButton";
import DataTable from "react-data-table-component";
import Clipboard from "component/Clipboard";
const Experience = (obj) => {
  return (
    <VStack>
      {obj?.role_title && (
        <Text>
          {t("ROLE")} : {obj?.role_title}
        </Text>
      )}
      {obj?.experience_in_years && (
        <Text>
          {t("YEARS_OF_EX")} : {obj?.experience_in_years}
        </Text>
      )}
      {obj?.description && (
        <Text>
          {t("DESCRIPTION")} : {obj?.description}
        </Text>
      )}
    </VStack>
  );
};

const columns = (t) => [
  {
    name: t("ID"),
    selector: (row) => row?.id,
  },
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        <AdminTypo.H5 bold>
          {row?.first_name + " "}
          {row?.last_name ? row?.last_name : ""}
        </AdminTypo.H5>
      </HStack>
    ),
    attr: "name",
    wrap: true,
  },
  {
    name: t("ROLE"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        <AdminTypo.H5 bold>
          {row?.program_faciltators.length > 0
            ? t("PRERAK")
            : row?.program_beneficiaries.length > 0
            ? t("LEARNER")
            : ""}
        </AdminTypo.H5>
      </HStack>
    ),
    attr: "name",
    wrap: true,
  },
];

export default function FacilitatorView({ footerLinks }) {
  const toast = useToast();

  const { id } = useParams();
  const [data, setData] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [adhaarModalVisible, setAdhaarModalVisible] = React.useState(false);
  const [aadhaarValue, setAadhaarValue] = React.useState();
  const [duplicateUserList, setDuplicateUserList] = React.useState();
  const [aadhaarerror, setAadhaarError] = React.useState();
  const [credentials, setCredentials] = React.useState();
  const [errors, setErrors] = React.useState({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);
  const [qualifications, setQualifications] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);
  const [editfields, seteditfields] = React.useState([]);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isSaveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  const handleCheckboxChange = (value) => {
    setSelectedCheckboxes((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((checkbox) => checkbox !== value);
      } else {
        return [...prevSelected, value];
      }
    });

    // Update the state to enable the Save button if at least one checkbox is checked
    setSaveButtonEnabled(true);
  };

  const editRequest = async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
      selectedFields: selectedCheckboxes,
    };

    try {
      const result = await benificiaryRegistoryService.editFields(obj);
      if (result.success) {
        setIsEditSuccess(true);
        setEditModal(false);
        setSelectedCheckboxes([]);
      } else {
        console.error("Edit fields API call not successful");
      }
    } catch (error) {
      console.error("Error editing fields:", error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassword(!confirmPassword);
  };

  const openModal = () => {
    setEditModal(true);
  };
  const navigate = useNavigate();

  React.useEffect(async () => {
    const profileDetails = async () => {
      const result = await facilitatorRegistryService.getOne({ id });
      setData(result);
      setAadhaarValue(result?.aadhar_no);
      const qualificationList =
        await facilitatorRegistryService.getQualificationAll();
      const qual = JSON.parse(result?.program_faciltators?.qualification_ids);
      if (qual?.length > 0) {
        const filterData = qualificationList?.filter((e) => {
          const qualData = qual?.find((item) => `${item}` === `${e?.id}`);
          return qualData ? true : false;
        });

        setQualifications(filterData);
      }
    };
    await profileDetails();
  }, []);

  React.useEffect(() => {
    const createData = async () => {
      try {
        const result = await benificiaryRegistoryService.getRequestDetails(id);
        console.log("updatedata", updatedData);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    const updateData = async () => {
      try {
        const result = await benificiaryRegistoryService.createEditRequest();
        console.log("createdata", result);
      } catch (error) {
        console.error("Error creating edit request:", error);
      }
    };

    createData();
    updateData();
  }, [id]);

  const showData = (item) => item || "-";

  const validate = () => {
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
  };
  console.log(isSaveButtonEnabled);

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
          setModalVisible(false);
          return { status: true };
        } else if (resetPassword.success === false) {
          setCredentials();
          setModalVisible(false);
          return { status: false };
        }
      } else if (password !== confirm_password) {
        setCredentials();
        setModalVisible(false);
        return { status: false };
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

  const handleAadhaarUpdate = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const maxLength = 12;
    const truncatedValue = numericValue.slice(0, maxLength);
    setAadhaarValue(truncatedValue);
  };

  const updateAadhaar = async () => {
    const aadhaar_no = {
      id: id,
      aadhar_no: aadhaarValue,
    };
    const result = await facilitatorRegistryService.updateAadhaarNumber(
      aadhaar_no
    );
    if (aadhaarValue.length < 12) {
      setAadhaarError("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER");
    } else if (!result?.success) {
      setAadhaarError("AADHAAR_NUMBER_ALREADY_EXISTS");
      setDuplicateUserList(result?.data?.users);
    } else {
      setData({ ...data, aadhar_no: aadhaarValue });
      setAdhaarModalVisible(false);
    }
  };

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H1 color="Activatedcolor.400">
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

          <HStack alignItems={Center} space="9">
            {/* <VStack>
              <AdminTypo.PrimaryButton
                leftIcon={<IconByName isDisabled name="MessageLineIcon" />}
              >
                {t("SEND_MESSAGE")}
              </AdminTypo.PrimaryButton>
            </VStack> */}
            <VStack>
              <AdminTypo.Secondarybutton
                leftIcon={<IconByName isDisabled name="LockUnlockLineIcon" />}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                {t("USER_RESET_PASSWORD")}
              </AdminTypo.Secondarybutton>
            </VStack>
          </HStack>
          {/* <Box paddingTop="32px">
            {data?.status === "screened" ? (
              <Interviewschedule />
            ) : (
              <React.Fragment />
            )}
          </Box> */}
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
                    <AdminTypo.H6 color="textGreyColor.100">
                      Username
                    </AdminTypo.H6>
                  </HStack>
                  <ChipStatus status={data?.status} flex={1}>
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
                        {!credentials?.confirmPassword &&
                          errors.confirmPassword}
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

          <VStack space={"5"} p="5" mt="6">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS").toUpperCase()}
            </AdminTypo.H4>
            {data?.aadhar_verified === "yes" && (
              <AdminTypo.Secondarybutton
                my="3"
                onPress={isEditSuccess ? undefined : openModal}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                }}
              >
                {isEditSuccess ? t("CLOSED_FOR_EDIT") : t("OPEN_FOR_EDIT")}
              </AdminTypo.Secondarybutton>
            )}
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
                  {/* <IconByName
                    color="editIcon.300"
                    size="30px"
                    name="EditBoxLineIcon"
                  /> */}
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("FIRST_NAME")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {showData(data?.first_name)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("MIDDLE_NAME")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {showData(data?.middle_name)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("LAST_NAME")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {showData(data?.last_name)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.7" color="textGreyColor.550">
                    {t("MOBILE_NO")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {showData(data?.mobile)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("DATE_OF_BIRTH")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {showData(data?.dob)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("GENDER")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {showData(data?.gender)}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 bold flex="0.4" color="textGreyColor.550">
                    {t("ADDRESS")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5
                    color="textGreyColor.800"
                    flex="0.4"
                    pl="1"
                    bold
                  >
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
                  <AdminTypo.H5 bold flex="0.67" color="textGreyColor.550">
                    {t("AADHAAR_NO")}:
                  </AdminTypo.H5>
                  <HStack
                    flex="1"
                    alignItems={"center"}
                    space={"4"}
                    justifyContent={"space-between"}
                  >
                    <AdminTypo.H5
                      justifyContent={"center"}
                      alignItems={"center"}
                      color="textGreyColor.800"
                      bold
                    >
                      {showData(data?.aadhar_no)}
                    </AdminTypo.H5>
                    <IconByName
                      bg="white"
                      color="textMaroonColor.400"
                      name="PencilLineIcon"
                      onPress={(e) => {
                        setAdhaarModalVisible(!adhaarModalVisible);
                      }}
                    />
                  </HStack>
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
                          {t("EDUCATION")}
                        </AdminTypo.H5>
                        {/* <IconByName
                          color="editIcon.300"
                          size="30px"
                          name="EditBoxLineIcon"
                        /> */}
                      </HStack>
                      <HStack>
                        <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                          {t("QUALIFICATION")}:
                        </AdminTypo.H5>
                        <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                          {
                            <AdminTypo.H5 color="textGreyColor.800" bold>
                              {data?.qualifications?.qualification_master?.name}
                            </AdminTypo.H5>
                          }
                        </AdminTypo.H5>
                      </HStack>

                      <HStack space="2">
                        <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                          {t("TEACHING_QUALIFICATION")}:
                        </AdminTypo.H5>
                        {
                          <AdminTypo.H5
                            flex="0.7"
                            color="textGreyColor.800"
                            bold
                          >
                            {qualifications?.map((e) => e?.name).join(", ")}
                          </AdminTypo.H5>
                        }
                      </HStack>

                      <VStack space="4">
                        <HStack space="2">
                          <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                            {t("WORK_EXPERIENCE")}:
                          </AdminTypo.H5>
                          <VStack flex="0.7" space={5} width="70%">
                            <AdminTypo.H5 bold>
                              {data?.experience ? (
                                data?.experience?.map((e, key) => (
                                  <Experience key={e} {...e} />
                                ))
                              ) : (
                                <AdminTypo.H5
                                  flex="0.7"
                                  color="textGreyColor.800"
                                  bold
                                >
                                  {"-"}
                                </AdminTypo.H5>
                              )}
                            </AdminTypo.H5>
                          </VStack>
                        </HStack>
                        <HStack space="2">
                          <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                            {t("VOLUNTEER_EXPERIENCE")}:
                          </AdminTypo.H5>
                          <VStack flex="0.7" space={5} width="70%" pl="1">
                            <AdminTypo.H5 bold>
                              {data?.vo_experience ? (
                                data?.vo_experience?.map((e, key) => (
                                  <Experience key={e} {...e} />
                                ))
                              ) : (
                                <AdminTypo.H5
                                  flex="0.7"
                                  color="textGreyColor.800"
                                  bold
                                >
                                  {"-"}
                                </AdminTypo.H5>
                              )}
                            </AdminTypo.H5>
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
                    {/* <IconByName
                      color="editIcon.300"
                      size="22px"
                      name="EditBoxLineIcon"
                    /> */}
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                      {t("AVAILABILITY")}:
                    </AdminTypo.H5>
                    <AdminTypo.H5 flex="0.69" color="textGreyColor.800" bold>
                      {showData(
                        data?.program_faciltators?.availability?.replaceAll(
                          "_",
                          " "
                        )
                      )}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                      {t("DEVICE_OWNERSHIP")}:
                    </AdminTypo.H5>
                    <AdminTypo.H5 flex="0.69" color="textGreyColor.800" bold>
                      {showData(data?.device_ownership)}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                      {t("TYPE_OF_DEVICE")}:
                    </AdminTypo.H5>
                    <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                      {showData(data?.device_type)}
                    </AdminTypo.H5>
                  </HStack>
                </VStack>
              </VStack>
            </HStack>

            {data?.aadhar_verified === "in_progress" && (
              <VStack space={"5"} w="100%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("AADHAAR_DETAILS")}
                  </AdminTypo.H5>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <ImageView
                    source={{ document_id: data?.aadhaar_front?.id }}
                    alt="aadhaar_front"
                    width="40vw"
                    height="45vh"
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="worksheetBoxText.100"
                    alignSelf="Center"
                  />
                  <ImageView
                    source={{ document_id: data?.aadhaar_back?.id }}
                    alt="aadhaar_front"
                    width="40vw"
                    height="45vh"
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="worksheetBoxText.100"
                    alignSelf="Center"
                  />
                </HStack>
              </VStack>
            )}
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
        <Modal isOpen={adhaarModalVisible} avoidKeyboard size="xl">
          <Modal.Content>
            <Modal.Header textAlign={"Center"}>
              <AdminTypo.H1 color="textGreyColor.500">
                {t("UPDATE_AADHAAR")}
              </AdminTypo.H1>
            </Modal.Header>
            <Modal.Body>
              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                {t("AADHAAR_NO")}:
                <Input
                  value={aadhaarValue}
                  maxLength={12}
                  name="numberInput"
                  onChange={handleAadhaarUpdate}
                />
              </HStack>
              <AdminTypo.H5 mt={3} ml={4} color={"textMaroonColor.400"}>
                {aadhaarerror ? t(aadhaarerror) : ""}
              </AdminTypo.H5>

              {aadhaarerror === "AADHAAR_NUMBER_ALREADY_EXISTS" && (
                <DataTable
                  customStyles={tableCustomStyles}
                  columns={[...columns(t)]}
                  data={duplicateUserList}
                  persistTableHead
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <AdminTypo.Secondarybutton
                  onPress={() => setAdhaarModalVisible(false)}
                >
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton onPress={updateAadhaar}>
                  {t("SAVE")}
                </AdminTypo.PrimaryButton>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Modal isOpen={editModal} avoidKeyboard size="xl">
          <Modal.Content>
            <Modal.Header textAlign={"Center"}>
              <AdminTypo.H1 color="textGreyColor.500">
                {t("REQUESTING_FOR_CHANGE")}
              </AdminTypo.H1>
            </Modal.Header>
            <Modal.Body>
              <Center>
                <VStack space={3}>
                  <Checkbox
                    value="Profile Photo"
                    size="sm"
                    isChecked={selectedCheckboxes.includes("Profile Photo")}
                    onChange={() => handleCheckboxChange("Profile Photo")}
                  >
                    {t("PROFILE_PHOTO")}
                  </Checkbox>
                  <Checkbox
                    value="Address"
                    size="sm"
                    isChecked={selectedCheckboxes.includes("Address")}
                    onChange={() => handleCheckboxChange("Address")}
                  >
                    {t("ADDRESS")}
                  </Checkbox>
                  <AdminTypo.H4 borderBottomWidth="1">
                    {t("OTHER_DETAILS")}
                  </AdminTypo.H4>
                  <Checkbox
                    value="Availability"
                    size="sm"
                    isChecked={selectedCheckboxes.includes("Availability")}
                    onChange={() => handleCheckboxChange("Availability")}
                  >
                    {t("AVAILABILITY")}
                  </Checkbox>
                  <Checkbox
                    value="Device Ownership"
                    size="sm"
                    isChecked={selectedCheckboxes.includes("Device Ownership")}
                    onChange={() => handleCheckboxChange("Device Ownership")}
                  >
                    {t("DEVICE_OWNERSHIP")}
                  </Checkbox>
                  <Checkbox
                    value="Type of Device"
                    size="sm"
                    isChecked={selectedCheckboxes.includes("Type of Device")}
                    onChange={() => handleCheckboxChange("Type of Device")}
                  >
                    {t("TYPE_OF_DEVICE")}
                  </Checkbox>
                </VStack>
              </Center>
            </Modal.Body>
            <Modal.Footer>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <AdminTypo.Secondarybutton onPress={() => setEditModal(false)}>
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  onPress={() => editRequest()}
                  disabled={!isSaveButtonEnabled}
                >
                  {t("SAVE")}
                </AdminTypo.PrimaryButton>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </HStack>
    </Layout>
  );
}
