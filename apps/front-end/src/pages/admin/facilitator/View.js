import React, { useCallback, useEffect, useState, memo, lazy } from "react";
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
  CardComponent,
  FrontEndTypo,
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
import DataTable from "react-data-table-component";
import Clipboard from "component/Clipboard";
import { MultiCheck } from "component/BaseInput";
const StatusButton = lazy(() => import("./view/StatusButton"));

const checkboxoptions = [
  {
    label: "AVAILABILITY",
    value: "availability",
  },
  {
    label: "DEVICE_OWNERSHIP",
    value: "device_ownership",
  },
  {
    label: "TYPE_OF_DEVICE",
    value: "device_type",
  },
];
const addressoptions = [
  {
    label: "DISTRICT",
    value: "district",
  },
  {
    label: "BLOCK",
    value: "block",
  },
  {
    label: "VILLAGE_WARD",
    value: "village",
  },
];
const profileOptions = [
  {
    label: "PROFILE_PHOTO",
    value: "profile_photo_1",
  },
];
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
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [adhaarModalVisible, setAdhaarModalVisible] = useState(false);
  const [aadhaarValue, setAadhaarValue] = useState();
  const [duplicateUserList, setDuplicateUserList] = useState();
  const [aadhaarerror, setAadhaarError] = useState();
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState();
  const [fieldCheck, setFieldCheck] = useState();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPassword((prevConfirmPassword) => !prevConfirmPassword);
  }, []);

  const openModal = useCallback(() => {
    setEditModal(true);
  }, []);

  const navigate = useNavigate();

  const profileDetails = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  useEffect(() => {
    const fetchData = async () => {
      const obj = {
        edit_req_for_context: "users",
        edit_req_for_context_id: id,
      };
      const result = await benificiaryRegistoryService.getEditFields(obj);
      if (result.data[0]) {
        setEditData(result?.data[0]);
      }
      let field;
      const parseField = result?.data[0]?.fields;
      if (parseField && typeof parseField === "string") {
        field = JSON.parse(parseField);
      }
      setFieldCheck(field || []);
    };
    fetchData();
  }, []);

  const editRequest = async () => {
    setIsButtonLoading(true);
    if (!editData) {
      const obj = {
        edit_req_for_context: "users",
        edit_req_for_context_id: id,
        edit_req_by: id,
        fields: fieldCheck,
      };
      await benificiaryRegistoryService.createEditRequest(obj);
    } else {
      const updateObj = {
        status: "approved",
        id: editData?.id,
        fields: fieldCheck,
      };
      await benificiaryRegistoryService.updateRequestDetails(updateObj);
    }
    setEditModal(false);
  };

  const showData = (item) => item || "-";

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
          setIsButtonLoading(false);
          return { status: true };
        } else if (resetPassword.success === false) {
          setIsButtonLoading(false);
          setCredentials();
          setModalVisible(false);
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

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data) || data.error) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  const handleAadhaarUpdate = (event) => {
    const inputValue = event?.target?.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const maxLength = 12;
    const truncatedValue = numericValue.slice(0, maxLength);
    setAadhaarValue(truncatedValue);
  };

  const updateAadhaar = async () => {
    setIsButtonLoading(true);
    const aadhaar_no = {
      id: id,
      aadhar_no: aadhaarValue,
    };
    const result = await facilitatorRegistryService.updateAadhaarNumber(
      aadhaar_no
    );
    if (aadhaarValue?.length < 12) {
      setAadhaarError("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER");
      setIsButtonLoading(false);
    } else if (!result?.success) {
      setAadhaarError("AADHAAR_NUMBER_ALREADY_EXISTS");
      setDuplicateUserList(result?.data?.users);
      setIsButtonLoading(false);
    } else {
      setData({ ...data, aadhar_no: aadhaarValue });
      setAdhaarModalVisible(false);
    }
    setIsButtonLoading(false);
  };
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
              <ChipStatus status={data?.status} />
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
            <VStack space={4}>
              <AdminTypo.Secondarybutton
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                {t("USER_RESET_PASSWORD")}
              </AdminTypo.Secondarybutton>
              {data?.aadhar_verified === "okyc_ip_verified" && (
                <AdminTypo.PrimaryButton onPress={openModal}>
                  {t("OPEN_FOR_EDIT")}
                </AdminTypo.PrimaryButton>
              )}
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

          <VStack space={"5"} p="4">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS").toUpperCase()}
            </AdminTypo.H4>

            <HStack justifyContent="space-between">
              <VStack w="50%">
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("BASIC_DETAILS")}
                  label={[
                    "FIRST_NAME",
                    "MIDDLE_NAME",
                    "LAST_NAME",
                    "MOBILE_NO",
                    "DATE_OF_BIRTH",
                    "GENDER",
                    "ADDRESS",
                    "AADHAAR_NO",
                  ]}
                  item={showData({
                    ...data,
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
                    aadhaar: (
                      <HStack space={4} alignItems={"center"}>
                        <FrontEndTypo.H3>
                          {data?.aadhar_no ? data?.aadhar_no : "-"}
                        </FrontEndTypo.H3>
                        <IconByName
                          bg="light.100"
                          color="textMaroonColor.400"
                          name="PencilLineIcon"
                          onPress={(e) => {
                            setAdhaarModalVisible(!adhaarModalVisible);
                          }}
                        />
                      </HStack>
                    ),
                  })}
                  arr={[
                    "first_name",
                    "middle_name",
                    "last_name",
                    "mobile",
                    "dob",
                    "gender",
                    "address",
                    "aadhaar",
                  ]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
              </VStack>
              <VStack space={"2"} w="50%" ml="3">
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("EDUCATION")}
                  label={[
                    "QUALIFICATION",
                    "TEACHING_QUALIFICATION",
                    "WORK_EXPERIENCE",
                    "VOLUNTEER_EXPERIENCE",
                  ]}
                  format={{ qualification_reference_document_id: "file" }}
                  item={{
                    ...data,
                    qualification_reference_document_id:
                      data?.qualifications?.qualification_reference_document_id,
                    qualification: (
                      <FrontEndTypo.H3>
                        {data?.qualifications?.qualification_master?.name}
                      </FrontEndTypo.H3>
                    ),
                    teching_qualification: qualifications
                      ?.map((e) => t(e?.name))
                      .join(", "),
                    work_experience:
                      data?.experience?.[0] &&
                      data?.experience?.map((e, key) => (
                        <Experience key={e} {...e} />
                      )),
                    volunteer_experience:
                      data?.vo_experience?.[0] &&
                      data?.vo_experience?.map((e, key) => (
                        <Experience key={e} {...e} />
                      )),
                  }}
                  arr={[
                    "qualification",
                    "teching_qualification",
                    "work_experience",
                    "volunteer_experience",
                    "qualification_reference_document_id",
                  ]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("OTHER_DETAILS")}
                  label={["AVAILABILITY", "DEVICE_OWNERSHIP", "TYPE_OF_DEVICE"]}
                  item={showData({
                    ...data,
                    availability:
                      data?.program_faciltators?.availability
                        ?.replaceAll("_", " ")
                        ?.charAt(0)
                        ?.toUpperCase() +
                      data?.program_faciltators?.availability
                        ?.replaceAll("_", " ")
                        ?.slice(1),

                    device_ownership:
                      data?.device_ownership.charAt(0).toUpperCase() +
                      data?.device_ownership.slice(1),
                    device_type:
                      data?.device_type.charAt(0).toUpperCase() +
                      data?.device_type.slice(1),
                  })}
                  arr={["availability", "device_ownership", "device_type"]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
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
          <StatusButton
            {...{ data, setData, updateDataCallBack: profileDetails }}
          />
        </VStack>
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
                <AdminTypo.PrimaryButton
                  isDisabled={isButtonLoading}
                  onPress={updateAadhaar}
                >
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
              <AdminTypo.H5>{t("REQUESTING_FOR_CHANGE_MESSAGE")}</AdminTypo.H5>
            </Modal.Header>
            <Modal.Body>
              <HStack>
                <VStack flex={1}>
                  <CardComponent
                    _header={{ bg: "light.100" }}
                    _vstack={{
                      bg: "light.100",
                      space: 2,
                      pt: "2",
                      m: "1",
                    }}
                    title={
                      <SelectAllCheckBox
                        fields={profileOptions.map((e) => e.value)}
                        title={t("PROFILE_PHOTO")}
                        {...{ setFieldCheck, fieldCheck }}
                      />
                    }
                  >
                    <MultiCheck
                      value={fieldCheck || []}
                      onChange={(e) => {}}
                      schema={{
                        grid: 1,
                      }}
                      options={{
                        enumOptions: profileOptions,
                      }}
                    />
                  </CardComponent>
                </VStack>
                <VStack flex={1}>
                  <CardComponent
                    _header={{ bg: "light.100" }}
                    _vstack={{
                      bg: "light.100",
                      space: 2,
                      pt: "2",
                      m: "1",
                    }}
                    title={
                      <SelectAllCheckBox
                        fields={addressoptions.map((e) => e.value)}
                        title={t("ADDRESS")}
                        {...{ setFieldCheck, fieldCheck }}
                      />
                    }
                  >
                    <MultiCheck
                      value={fieldCheck || []}
                      onChange={(e) => {}}
                      schema={{
                        grid: 1,
                      }}
                      options={{
                        enumOptions: addressoptions,
                      }}
                    />
                  </CardComponent>
                </VStack>
                <VStack flex={1}>
                  <CardComponent
                    _header={{ bg: "light.100" }}
                    _vstack={{
                      bg: "light.100",
                      space: 1,
                      pt: "2",
                      m: "1",
                    }}
                    title={
                      <SelectAllCheckBox
                        fields={checkboxoptions.map((e) => e.value)}
                        title={t("OTHER_DETAILS")}
                        {...{ setFieldCheck, fieldCheck }}
                      />
                    }
                  >
                    <MultiCheck
                      value={fieldCheck || []}
                      onChange={(e) => {}}
                      schema={{
                        grid: 1,
                      }}
                      options={{
                        enumOptions: checkboxoptions,
                      }}
                    />
                  </CardComponent>
                </VStack>
              </HStack>
            </Modal.Body>
            <Modal.Footer>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <AdminTypo.Secondarybutton onPress={() => setEditModal(false)}>
                  {t("CANCEL")}
                </AdminTypo.Secondarybutton>
                <AdminTypo.PrimaryButton
                  isDisabled={isButtonLoading}
                  onPress={() => editRequest()}
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

const SelectAllCheckBox = memo(
  ({ fields, title, setFieldCheck, fieldCheck }) => {
    const handleChange = useCallback(
      (e) => {
        if (!e) {
          const checkedFields = fieldCheck?.filter(
            (field) => !fields?.includes(field)
          );
          setFieldCheck(checkedFields);
        } else {
          const checkedFields = fieldCheck?.filter(
            (field) => !fields?.includes(field)
          );
          setFieldCheck([...checkedFields, ...fields]);
        }
      },
      [fields, fieldCheck, setFieldCheck]
    );

    return (
      <Checkbox onChange={handleChange} colorScheme="danger">
        {title}
      </Checkbox>
    );
  }
);
