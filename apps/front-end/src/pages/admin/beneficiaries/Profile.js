import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  benificiaryRegistoryService,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  getUniqueArray,
  FrontEndTypo,
  tableCustomStyles,
  CustomRadio,
  facilitatorRegistryService,
  CardComponent,
  jsonParse,
} from "@shiksha/common-lib";
import {
  Box,
  CheckIcon,
  HStack,
  Modal,
  Select,
  Stack,
  VStack,
  Text,
  Input,
  Actionsheet,
  ScrollView,
  Checkbox,
} from "native-base";
import Chip from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import Clipboard from "component/Clipboard";
import { MultiCheck } from "component/BaseInput";

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
const familyFieldsArray = [
  {
    label: "FATHER_FIRST_NAME",
    value: "father_first_name",
  },
  {
    label: "FATHER_MIDDLE_NAME",
    value: "father_middle_name",
  },
  {
    label: "FATHER_LAST_NAME",
    value: "father_last_name",
  },
  {
    label: "MOTHER_FIRST_NAME",
    value: "mother_first_name",
  },
  {
    label: "MOTHER_MIDDLE_NAME",
    value: "mother_middle_name",
  },
  {
    label: "MOTHER_LAST_NAME",
    value: "mother_last_name",
  },
];
const personalFieldsArray = [
  {
    label: "SOCIAL_CATEGORY",
    value: "social_category",
  },
  {
    label: "MARITAL_STATUS",
    value: "marital_status",
  },
];
const educationalFieldsArray = [
  {
    label: "TYPE_OF_LEARNER",
    value: "type_of_learner",
  },
  {
    label: "LAST_STANDARD_OF_EDUCATION",
    value: "last_standard_of_education",
  },
  {
    label: "LAST_YEAR_OF_EDUCATION",
    value: "last_standard_of_education_year",
  },
  {
    label: "PREVIOUS_SCHOOL_TYPE",
    value: "previous_school_type",
  },
  {
    label: "REASON_FOR_BEING_DEPRIVED_OF_EDUCATION",
    value: "reason_of_leaving_education",
  },
  {
    label: "WHAT_IS_THE_LEARNING_LEVEL_OF_THE_LEARNER",
    value: "learning_level",
  },
];
const addressFieldsArray = [
  {
    label: "STREET_ADDRESS",
    value: "address",
  },
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
  {
    label: "GRAMPANCHAYAT",
    value: "grampanchayat",
  },
];

export default function AgAdminProfile({ footerLinks }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [EditButton, setEditButton] = React.useState(false);
  const [selectData, setselectData] = React.useState([]);
  const [status, setStatus] = React.useState({});
  const { id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();
  const [adhaarModalVisible, setAdhaarModalVisible] = React.useState(false);
  const [aadhaarValue, setAadhaarValue] = React.useState();
  const [duplicateUserList, setDuplicateUserList] = React.useState();
  const [aadhaarerror, setAadhaarError] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [benificiary, setBeneficiary] = React.useState();
  const [contextId, setcontextId] = React.useState();
  const [auditLogs, setauditLogs] = React.useState([]);
  const [auditMonth, setauditMonth] = React.useState([]);
  const [auditYear, setauditYear] = React.useState([]);
  const [enrollmentSubjects, setEnrollmentSubjects] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [editAccessModalVisible, setEditAccessModalVisible] =
    React.useState(false);
  const [reasonValue, setReasonValue] = React.useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);
  const [isOpenReject, setIsOpenReject] = React.useState(false);
  const [benificiaryDropoutReasons, setBenificiaryDropoutReasons] =
    React.useState();
  const [benificiaryRejectReasons, setBenificiaryRejectReasons] =
    React.useState();
  const [benificiaryReactivateReasons, setBenificiaryReactivateReasons] =
    React.useState();
  const [getRequestData, setGetRequestData] = React.useState();
  const { t } = useTranslation();
  const [checkedFields, setCheckedFields] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(false);

  const GetOptions = ({ array, enumType, enumApiData }) => {
    return (
      <VStack>
        {getUniqueArray(array)?.map((item) => (
          <Chip
            textAlign="center"
            key={item}
            lineHeight="15px"
            label={
              <GetEnumValue
                fontSize="14px"
                t={t}
                enumOptionValue={item}
                {...{ enumType, enumApiData }}
              />
            }
          />
        ))}
      </VStack>
    );
  };

  const getAuditData = React.useCallback(async () => {
    const result = await benificiaryRegistoryService.getAuditLogs(contextId);
    if (result && result.length > 0) {
      const uniqueDates = result.reduce(
        (acc, item) => {
          const parsedDate = moment(item?.created_at);
          const date = parsedDate.format("DD");
          const month = parsedDate.format("MMMM");
          const year = parsedDate.format("YYYY");

          setauditLogs((prevState) => [
            ...prevState,
            {
              status: JSON.parse(item?.new_data),
              first_name: item?.user?.first_name,
              middle_name: item?.user?.middle_name,
              last_name: item.user?.last_name,
              date: date,
            },
          ]);

          if (!acc.months.includes(month)) {
            acc.months.push(month);
          }

          if (!acc.years.includes(year)) {
            acc.years.push(year);
          }

          return acc;
        },

        { dates: [], months: [], years: [] }
      );

      setauditMonth(uniqueDates?.months);
      setauditYear(uniqueDates?.years);
    }
  }, [contextId]);

  React.useEffect(async () => {
    let data = {
      edit_page_type: "document_status",
      documents_status: status,
    };
    if (Object.keys(status).length > 0) {
      await benificiaryRegistoryService.getStatusUpdate(id, data);
    }
  }, [status]);

  React.useEffect(() => {
    if (contextId) {
      getAuditData();
    }
  }, [contextId]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      setLoading(true);
      let newData = await benificiaryRegistoryService.getOne(id);
      setData(newData?.result);
      setAadhaarValue(newData?.result?.aadhar_no);
      const subjectId = jsonParse(
        newData?.result?.program_beneficiaries?.subjects
      );
      if (subjectId?.length > 0) {
        let subjectResult = await enumRegistryService.getSubjects({
          board: newData?.result?.program_beneficiaries?.enrolled_for_board,
        });
        const subjectNames = subjectId.map((id) => {
          const matchingSubject = subjectResult?.data?.find(
            (subject) => subject.id === parseInt(id)
          );
          return matchingSubject ? matchingSubject.name : "Subject not found";
        });
        setEnrollmentSubjects(subjectNames);
      }
      setcontextId(newData?.result?.program_beneficiaries?.id);
      setBeneficiary(newData);
      if (newData?.result?.program_beneficiaries?.documents_status) {
        setStatus(
          JSON.parse(newData?.result?.program_beneficiaries?.documents_status)
        );
      }
      let data = await benificiaryRegistoryService.getDocumentStatus();
      setselectData(data);
      const enumData = await enumRegistryService.listOfEnum();
      setEnumOptions(enumData?.data ? enumData?.data : {});
      setBenificiaryDropoutReasons(
        enumData?.data?.BENEFICIARY_REASONS_FOR_DROPOUT_REASONS
      );
      setBenificiaryReactivateReasons(enumData?.data?.REACTIVATE_REASONS);
      setBenificiaryRejectReasons(
        enumData?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER
      );
      const obj = {
        edit_req_for_context: "users",
        edit_req_for_context_id: id,
      };
      const resule = await facilitatorRegistryService?.getEditRequestDetails(
        obj
      );
      if (resule?.data[0]) {
        setGetRequestData(resule?.data[0]);
        const data = JSON.parse(resule?.data[0]?.fields);
        setCheckedFields(data);
      }
    } catch (error) {
      console.error("Error fetching beneficiary data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAadhaarUpdate = React.useCallback((event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    const maxLength = 12;
    const truncatedValue = numericValue.slice(0, maxLength);
    setAadhaarValue(truncatedValue);
  }, []);

  const updateAadhaar = React.useCallback(async () => {
    setIsDisable(true);
    const aadhaar_no = {
      id: id,
      aadhar_no: aadhaarValue,
    };
    const result = await benificiaryRegistoryService.updateAadhaarNumber(
      aadhaar_no
    );
    if (aadhaarValue.length < 12) {
      setIsDisable(false);
      setAadhaarError("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER");
    } else if (!result?.success) {
      setIsDisable(false);
      setAadhaarError("AADHAAR_NUMBER_ALREADY_EXISTS");
      setDuplicateUserList(result?.data?.users);
    } else {
      setIsDisable(false);
      setData({ ...data, aadhar_no: aadhaarValue });
      setAdhaarModalVisible(false);
    }
  }, [aadhaarValue, data, id]);

  const dropoutApiCall = React.useCallback(async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.result?.id?.toString(),
      status: "dropout",
      reason_for_status_update: reasonValue,
    };

    const result = await benificiaryRegistoryService.learnerAdminStatusUpdate(
      bodyData
    );

    if (result) {
      setIsDisable(true);
      setReasonValue("");
      setIsOpenDropOut(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [benificiary, reasonValue]);

  const reactivateApiCall = React.useCallback(async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.result?.id?.toString(),
      status: "identified",
      reason_for_status_update: reactivateReasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setReactivateReasonValue("");
      setIsOpenReactive(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [benificiary, reactivateReasonValue]);

  const RejectApiCall = React.useCallback(async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.result?.id?.toString(),
      status: "rejected",
      reason_for_status_update: reasonValue,
    };

    const result = await benificiaryRegistoryService.statusUpdate(bodyData);

    if (result) {
      setReasonValue("");
      setIsOpenReject(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [benificiary, reasonValue]);

  const renderDropoutButton = React.useMemo(() => {
    const status = benificiary?.result?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      case "enrolled":
      case "approved_ip":
      case "registered_in_camp":
      case "pragati_syc":
      case "activate":
      case "enrolled_ip_verified":
      case null:
        return (
          <AdminTypo.Dangerbutton
            onPress={(e) => setIsOpenDropOut(true)}
            leftIcon={<IconByName name="UserUnfollowLineIcon" isDisabled />}
          >
            {t("MARK_AS_DROPOUT")}
          </AdminTypo.Dangerbutton>
        );
      default:
        return null;
    }
  }, [benificiary]);

  const renderReactivateButton = React.useMemo(() => {
    const status = benificiary?.result?.program_beneficiaries?.status;
    switch (status) {
      case "rejected":
      case "dropout":
        return (
          <AdminTypo.Secondarybutton onPress={(e) => setIsOpenReactive(true)}>
            {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
          </AdminTypo.Secondarybutton>
        );
      default:
        return null;
    }
  }, [benificiary]);

  const renderRejectButton = React.useMemo(() => {
    const status = benificiary?.result?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      case "enrolled":
      case "approved_ip":
      case "registered_in_camp":
      case "pragati_syc":
      case "activate":
      case "enrolled_ip_verified":
      case null:
        return (
          <AdminTypo.Dangerbutton
            onPress={(e) => setIsOpenReject(true)}
            leftIcon={<IconByName name="UserUnfollowLineIcon" isDisabled />}
          >
            {t("REJECT")}
          </AdminTypo.Dangerbutton>
        );
      default:
        return null;
    }
  }, [benificiary]);

  const giveAccess = React.useCallback(async () => {
    if (getRequestData) {
      await facilitatorRegistryService.updateRequestData({
        status: "approved",
        fields: checkedFields,
        requestId: getRequestData?.id,
      });
      setEditAccessModalVisible(false);
    } else {
      await benificiaryRegistoryService.createEditRequest({
        edit_req_for_context: "users",
        edit_req_for_context_id: id,
        fields: checkedFields,
        edit_req_by: data?.program_beneficiaries?.facilitator_id,
      });
      setEditAccessModalVisible(false);
    }
  }, [checkedFields, getRequestData, id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Layout _sidebar={footerLinks} loading={loading}>
      <VStack p={"4"} space={"3%"} width={"100%"}>
        <Box>
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H1 color="Activatedcolor.400">
              {t("PROFILE")}
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
              {data?.program_beneficiaries?.status === "enrolled_ip_verified"
                ? `${
                    data?.program_beneficiaries?.enrollment_first_name ?? "-"
                  } ${data?.program_beneficiaries?.enrollment_last_name ?? "-"}`
                : `${data?.first_name ?? "-"} ${data?.last_name ?? "-"}`}
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
          <HStack p="5" justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.program_beneficiaries?.status} />
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
                  name="Cake2LineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {data?.program_beneficiaries?.status ===
                  "enrolled_ip_verified"
                    ? data?.program_beneficiaries?.enrollment_dob
                    : data?.dob ?? "-"}
                </AdminTypo.H6>
              </HStack>

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
            </VStack>
            <HStack flex="0.5" mt={"-5"} justifyContent={"space-between"}>
              {data?.profile_photo_1?.id ? (
                <ImageView
                  urlObject={data?.profile_photo_1}
                  alt="Alternate Text"
                  width={"200px"}
                  height={"200px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="gray.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </HStack>
          </HStack>
          {/* <HStack mt="6" justifyContent={"space-between"}>
              <AdminTypo.Secondarybutton
                rightIcon={<IconByName name="MessageLineIcon" />}
              >
                {t("Add Comment For Prerak")}
              </AdminTypo.Secondarybutton>
              <Button rounded={"full"}>{t("Assign to Other Prerak")}</Button>
            </HStack> */}
        </Box>

        <Box
          borderWidth={"1px"}
          borderColor={"primary.200"}
          borderStyle={"solid"}
        >
          <VStack space={"5"} p="5">
            <HStack justifyContent={"space-between"}>
              <AdminTypo.H4 bold color="textGreyColor.800">
                {t("PROFILE_DETAILS")}
              </AdminTypo.H4>
              <HStack>
                <HStack space="4">
                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      setModalVisible(true);
                    }}
                  >
                    {t("VIEW_JOURNEY")}
                  </AdminTypo.Secondarybutton>
                  {benificiary?.result?.program_beneficiaries?.status ===
                    "enrolled_ip_verified" && (
                    <AdminTypo.Secondarybutton
                      onPress={() => setEditAccessModalVisible(true)}
                    >
                      {t("OPEN_FOR_EDIT")}
                    </AdminTypo.Secondarybutton>
                  )}
                </HStack>
              </HStack>
            </HStack>
            <HStack justifyContent="space-between">
              <VStack
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                space={"5"}
                w={"33%"}
                bg="light.100"
                p="6"
                rounded="xl"
              >
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("CONTACT_DETAILS")}
                  </AdminTypo.H5>
                </HStack>

                <VStack>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("SELF")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.mobile}
                  </AdminTypo.H5>

                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("ALTERNATIVE_NUMBER")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.alternative_mobile_number
                      ? data?.alternative_mobile_number
                      : "-"}
                  </AdminTypo.H5>

                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("EMAIL_ID")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {data?.email_id ? data?.email_id : "-"}
                  </AdminTypo.H5>
                  <HStack alignItems="center">
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
                        {data?.aadhar_no}
                      </AdminTypo.H5>
                      <IconByName
                        color="textMaroonColor.400"
                        name="PencilLineIcon"
                        onPress={(e) => {
                          setAdhaarModalVisible(!adhaarModalVisible);
                        }}
                      />
                    </HStack>
                  </HStack>
                </VStack>
              </VStack>
              <VStack
                space={"5"}
                w={"33%"}
                bg="light.100"
                p="6"
                rounded="xl"
                ml="3"
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
              >
                <HStack p="1" mx="1" rounded="xl">
                  <VStack space="20px" w="100%">
                    <VStack space="20px" w="auto" rounded="xl">
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        borderColor="light.400"
                        pb="1"
                        borderBottomWidth="1"
                      >
                        <AdminTypo.H5 color="textGreyColor" bold>
                          {t("FAMILY_DETAILS")}
                        </AdminTypo.H5>
                      </HStack>
                      <VStack>
                        <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                          {t("FATHER_NAME")}:
                        </AdminTypo.H5>
                        <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                          {data?.core_beneficiaries?.father_first_name
                            ? data?.core_beneficiaries?.father_first_name
                            : "-"}
                        </AdminTypo.H5>
                      </VStack>

                      <VStack space="2">
                        <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                          {t("MOTHER_NAME")}:
                        </AdminTypo.H5>
                        <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                          {data?.core_beneficiaries?.mother_first_name
                            ? data?.core_beneficiaries?.mother_first_name
                            : "-"}
                        </AdminTypo.H5>
                      </VStack>
                    </VStack>
                  </VStack>
                </HStack>
              </VStack>

              <VStack
                space={"5"}
                w={"33%"}
                bg="light.100"
                p="6"
                rounded="xl"
                ml="3"
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
              >
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("PERSONAL_DETAILS")}
                  </AdminTypo.H5>
                </HStack>
                <VStack>
                  <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                    {t("SOCIAL_CATEGORY")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                    {data?.extended_users?.social_category
                      ? data?.extended_users?.social_category
                      : "-"}
                  </AdminTypo.H5>
                </VStack>

                <VStack space="2">
                  <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                    {t("MARITAL_STATUS")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
                    {data?.extended_users?.marital_status
                      ? data?.extended_users?.marital_status
                      : "-"}
                  </AdminTypo.H5>
                </VStack>
              </VStack>
            </HStack>

            <HStack justifyContent="space-between" space="4" p="2">
              <VStack
                space={"5"}
                w="50%"
                bg="light.100"
                p="6"
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                rounded="xl"
              >
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("EDUCATION_DETAILS")}
                  </AdminTypo.H5>
                </HStack>
                <VStack space="1">
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("TYPE_OF_LEARNER")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.core_beneficiaries?.type_of_learner ? (
                      <GetEnumValue
                        t={t}
                        enumType={"TYPE_OF_LEARNER"}
                        enumOptionValue={
                          data?.core_beneficiaries?.type_of_learner
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </AdminTypo.H5>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("LAST_STANDARD_OF_EDUCATION")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.core_beneficiaries?.last_standard_of_education
                      ? data?.core_beneficiaries?.last_standard_of_education
                      : "-"}
                  </AdminTypo.H5>

                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("LAST_YEAR_OF_EDUCATION")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.core_beneficiaries?.last_standard_of_education_year
                      ? data?.core_beneficiaries
                          ?.last_standard_of_education_year
                      : "-"}
                  </AdminTypo.H5>

                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("PREVIOUS_SCHOOL_TYPE")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {data?.core_beneficiaries?.previous_school_type ? (
                      <GetEnumValue
                        t={t}
                        enumType={"PREVIOUS_SCHOOL_TYPE"}
                        enumOptionValue={
                          data?.core_beneficiaries?.previous_school_type
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </AdminTypo.H5>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("REASON_FOR_LEAVING")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" bold>
                    {data?.core_beneficiaries?.reason_of_leaving_education ? (
                      <GetEnumValue
                        t={t}
                        enumType={"REASON_OF_LEAVING_EDUCATION"}
                        enumOptionValue={
                          data?.core_beneficiaries?.reason_of_leaving_education
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </AdminTypo.H5>
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("LEARNING_LEVEL_OF_LEARNER")}:
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="1" color="textGreyColor.800" pl="1" bold>
                    {data?.program_beneficiaries?.learning_level ? (
                      <GetEnumValue
                        t={t}
                        enumType={"BENEFICIARY_LEARNING_LEVEL"}
                        enumOptionValue={
                          data?.program_beneficiaries?.learning_level
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </AdminTypo.H5>
                </VStack>
              </VStack>
              <VStack w="100%" space="2">
                <VStack
                  space={"5"}
                  w="50%"
                  bg="light.100"
                  p="6"
                  rounded="xl"
                  borderWidth={"1px"}
                  borderColor={"primary.200"}
                  borderStyle={"solid"}
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
                            {t("CAREER_ASPIRATION_FURTHER_STUDIES")}
                          </AdminTypo.H5>
                        </HStack>
                        <HStack>
                          <AdminTypo.H5
                            flex="0.8"
                            bold
                            color="textGreyColor.550"
                          >
                            {t("REACTIVATE_REASONS_CAREER_ASPIRATIONS")}:
                          </AdminTypo.H5>
                          <AdminTypo.H5 color="textGreyColor.800" bold>
                            {data?.program_beneficiaries
                              ?.learning_motivation ? (
                              <GetOptions
                                array={
                                  data?.program_beneficiaries
                                    ?.learning_motivation
                                }
                                enumApiData={enumOptions}
                                enumType={"LEARNING_MOTIVATION"}
                              />
                            ) : (
                              "-"
                            )}
                          </AdminTypo.H5>
                        </HStack>

                        <VStack space="2">
                          <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                            {t("REMARKS")}:
                          </AdminTypo.H5>
                          <AdminTypo.H5
                            flex="0.7"
                            color="textGreyColor.800"
                            bold
                          >
                            {data?.core_beneficiaries?.career_aspiration_details
                              ? data?.core_beneficiaries
                                  ?.career_aspiration_details
                              : "-"}
                          </AdminTypo.H5>
                        </VStack>
                      </VStack>
                    </VStack>
                  </HStack>
                </VStack>
                <VStack
                  space={"5"}
                  w="50%"
                  bg="light.100"
                  p="6"
                  rounded="xl"
                  borderWidth={"1px"}
                  borderColor={"primary.200"}
                  borderStyle={"solid"}
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
                            {t("ADDRESS_DETAILS")}
                          </AdminTypo.H5>
                        </HStack>
                        <HStack>
                          <AdminTypo.H5
                            flex="0.8"
                            bold
                            color="textGreyColor.550"
                          >
                            {t("ADDRESS")}:
                          </AdminTypo.H5>
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
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </HStack>

            <HStack w={"100%"} space={4}>
              <VStack
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                space={"5"}
                p="5"
                rounded="xl"
                w={"50%"}
              >
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <AdminTypo.H4 color="textGreyColor.800" bold>
                    {t("DOCUMENTATION_DETAILS")}
                  </AdminTypo.H4>
                  {EditButton === true ? (
                    <IconByName
                      name="CloseCircleLineIcon"
                      color="iconColor.200"
                      _icon={{ size: "25" }}
                      onPress={(e) => {
                        setEditButton(false);
                      }}
                    />
                  ) : (
                    <IconByName
                      name="PencilLineIcon"
                      color="iconColor.200"
                      _icon={{ size: "25" }}
                      onPress={(e) => {
                        setEditButton(true);
                      }}
                    />
                  )}
                </HStack>

                <VStack
                  borderWidth={"1px"}
                  borderColor={"primary.200"}
                  borderStyle={"solid"}
                  w="100%"
                  bg="light.100"
                  p="6"
                  rounded="xl"
                >
                  <VStack space={"6"}>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("JAN_AADHAAR_CARD")}:
                      </AdminTypo.H5>

                      {EditButton === true ? (
                        <Select
                          selectedValue={status?.jan_adhar || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.jan_adhar || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, jan_adhar: itemValue })
                          }
                        >
                          {Array.isArray(selectData) &&
                            selectData.map((item) => {
                              return (
                                <Select.Item
                                  key={item}
                                  label={`${t(item.title)}`}
                                  value={item.value}
                                />
                              );
                            })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex={"1"}>
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.jan_adhar || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("AADHAAR_CARD")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          selectedValue={status?.aadhaar || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.aadhaar || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon fontSize="sm" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, aadhaar: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.aadhaar || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("PHOTO")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          isDisabled={EditButton === false}
                          selectedValue={status?.photo || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.photo || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, photo: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.photo || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("MOBILE_NUMBER")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          isDisabled={EditButton === false}
                          selectedValue={status?.mobile || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.mobile || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, mobile: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.mobile || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("MARKSHEET")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          isDisabled={EditButton === false}
                          selectedValue={status?.marksheet || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.marksheet || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, marksheet: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.marksheet || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("BANK_PASSBOOK")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          isDisabled={EditButton === false}
                          selectedValue={status?.bank || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.bank || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, bank: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.bank || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>

                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("BIRTH_CERTIFICATE")}:
                      </AdminTypo.H5>
                      {EditButton === true ? (
                        <Select
                          isDisabled={EditButton === false}
                          selectedValue={status?.birth || ""}
                          accessibilityLabel="Select"
                          placeholder={status?.birth || "Select"}
                          _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          mt={1}
                          onValueChange={(itemValue) =>
                            setStatus({ ...status, birth: itemValue })
                          }
                        >
                          {selectData?.map((item) => {
                            return (
                              <Select.Item
                                key={item}
                                label={`${t(item.title)}`}
                                value={item.value}
                              />
                            );
                          })}
                        </Select>
                      ) : (
                        <AdminTypo.H4 flex="1">
                          <GetEnumValue
                            t={t}
                            enumType={"DOCUMENT_STATUS"}
                            enumOptionValue={status?.birth || ""}
                            enumApiData={enumOptions}
                          />
                        </AdminTypo.H4>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
              <VStack
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                space={"5"}
                p="5"
                rounded="xl"
                w={"50%"}
              >
                <HStack justifyContent={"space-between"}>
                  <AdminTypo.H4 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </AdminTypo.H4>

                  {data?.program_beneficiaries?.status !==
                    "enrolled_ip_verified" && (
                    <IconByName
                      name="PencilLineIcon"
                      color="iconColor.200"
                      _icon={{ size: "25" }}
                      onPress={(e) => {
                        navigate(
                          `/admin/beneficiary/${id}/editEnrollmentDetails`
                        );
                      }}
                    />
                  )}

                  {data?.program_beneficiaries?.status === "enrolled" && (
                    <AdminTypo.StatusButton
                      width={"25%"}
                      status={"success"}
                      onPress={(e) =>
                        navigate(`/admin/learners/enrollmentReceipt/${id}`)
                      }
                    >
                      {t("VERIFY")}
                    </AdminTypo.StatusButton>
                  )}
                </HStack>
                <HStack justifyContent="space-between" space={2}>
                  <VStack
                    space={"5"}
                    w="100%"
                    bg="light.100"
                    p="6"
                    rounded="xl"
                  >
                    <VStack space={"8"}>
                      <HStack alignItems={"Center"}>
                        <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                          {t("ENROLLMENT_STATUS")} :-
                        </AdminTypo.H5>
                        <AdminTypo.H5
                          flex="0.69"
                          color="textGreyColor.800"
                          pl="1"
                          bold
                        >
                          {data?.program_beneficiaries?.enrollment_status
                            ? data?.program_beneficiaries?.enrollment_status
                            : "-"}
                        </AdminTypo.H5>
                      </HStack>
                      <HStack alignItems={"Center"}>
                        <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                          {t("ENROLLMENT_BOARD")} :-
                        </AdminTypo.H5>

                        <AdminTypo.H5
                          flex="0.69"
                          color="textGreyColor.800"
                          pl="1"
                          bold
                        >
                          {data?.program_beneficiaries?.enrolled_for_board
                            ? data?.program_beneficiaries?.enrolled_for_board
                            : "-"}
                        </AdminTypo.H5>
                      </HStack>
                      <HStack alignItems={"Center"}>
                        <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                          {t("ENROLLMENT_NUMBER")} :-
                        </AdminTypo.H5>
                        <AdminTypo.H5
                          flex="0.69"
                          color="textGreyColor.800"
                          bold
                        >
                          {data?.program_beneficiaries?.enrollment_number
                            ? data?.program_beneficiaries?.enrollment_number
                            : "-"}
                        </AdminTypo.H5>
                      </HStack>
                      <HStack alignItems={"Center"}>
                        <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                          {t("ENROLLMENT_RECIEPT")} :-
                        </AdminTypo.H5>
                        <AdminTypo.H5
                          flex="0.69"
                          color="textGreyColor.800"
                          bold
                        >
                          <ImageView
                            source={{
                              document_id:
                                data?.program_beneficiaries?.document?.id,
                            }}
                            text="link"
                          />
                        </AdminTypo.H5>
                      </HStack>
                    </VStack>
                  </VStack>
                </HStack>
                <VStack
                  space={"5"}
                  w="100%"
                  bg="light.100"
                  p="6"
                  mt="6"
                  rounded="xl"
                >
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("SUBJECTS")}
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="0.69" color="textGreyColor.800" bold>
                    {enrollmentSubjects?.map((item) => {
                      return <Text key={item}>{item},</Text>;
                    })}
                  </AdminTypo.H5>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
          <HStack pt="0" p="3" space="6">
            {renderDropoutButton}
            {renderReactivateButton}
            {renderRejectButton}
          </HStack>
        </Box>
      </VStack>
      <Modal
        isOpen={modalVisible}
        alignSelf={"center"}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        size={"xl"}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header textAlign={"Center"}>
            <AdminTypo.H1 color="textGreyColor.500">
              {t("JOURNEY_IN_PROJECT_PRAGATI")}
            </AdminTypo.H1>
          </Modal.Header>
          <Modal.Body>
            <BeneficiaryJourney
              t={t}
              auditYear={auditYear}
              auditMonth={auditMonth}
              auditLogs={auditLogs}
              enumOptions={enumOptions}
              data={data}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
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
                isDisabled={isDisable}
                onPress={updateAadhaar}
              >
                {t("SAVE")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal isOpen={editAccessModalVisible} avoidKeyboard size="xl">
        <Modal.Content>
          <Modal.Header textAlign={"Center"}>
            <AdminTypo.H2 color="textGreyColor.500">
              {t("GIVE_EDIT_ACCESS")}
            </AdminTypo.H2>
          </Modal.Header>
          <Modal.Body>
            <VStack p="4" space="4">
              <AdminTypo.H3>
                {t("PLEASE_CHECK_THE_FIELDS_TO_GIVE_ACCESS")}
              </AdminTypo.H3>

              <VStack space="4">
                <CardComponent
                  _header={{ bg: "light.100" }}
                  _vstack={{
                    bg: "light.100",
                    space: 2,
                    pt: "2",
                  }}
                  title={
                    <SelectAllCheckBox
                      fields={familyFieldsArray.map((e) => e.value)}
                      title={t("FAMILY_DETAILS")}
                      {...{ setCheckedFields, checkedFields }}
                    />
                  }
                >
                  <MultiCheck
                    value={checkedFields || []}
                    onChange={(e) => {
                      setCheckedFields(e);
                    }}
                    schema={{
                      grid: 1,
                    }}
                    options={{
                      enumOptions: familyFieldsArray,
                    }}
                  />
                </CardComponent>
                <CardComponent
                  _header={{ bg: "light.100" }}
                  _vstack={{
                    bg: "light.100",
                    space: 2,
                    pt: "2",
                  }}
                  title={
                    <SelectAllCheckBox
                      fields={personalFieldsArray.map((e) => e.value)}
                      title={t("PERSONAL_DETAILS")}
                      {...{ setCheckedFields, checkedFields }}
                    />
                  }
                >
                  <MultiCheck
                    value={checkedFields || []}
                    onChange={(e) => {
                      setCheckedFields(e);
                    }}
                    schema={{
                      grid: 1,
                    }}
                    options={{
                      enumOptions: personalFieldsArray,
                    }}
                  />
                </CardComponent>

                <CardComponent
                  _header={{ bg: "light.100" }}
                  _vstack={{
                    bg: "light.100",
                    space: 2,
                    pt: "2",
                  }}
                  title={
                    <SelectAllCheckBox
                      fields={addressFieldsArray.map((e) => e.value)}
                      title={t("ADDRESS_DETAILS")}
                      {...{ setCheckedFields, checkedFields }}
                    />
                  }
                >
                  <MultiCheck
                    value={checkedFields || []}
                    onChange={(e) => {}}
                    schema={{
                      grid: 1,
                    }}
                    options={{
                      enumOptions: addressFieldsArray,
                    }}
                  />
                </CardComponent>
                <CardComponent
                  _header={{ bg: "light.100" }}
                  _vstack={{
                    bg: "light.100",
                    space: 2,
                    pt: "2",
                  }}
                  title={
                    <SelectAllCheckBox
                      fields={educationalFieldsArray.map((e) => e.value)}
                      title={t("EDUCATION_DETAILS")}
                      {...{ setCheckedFields, checkedFields }}
                    />
                  }
                >
                  <MultiCheck
                    value={checkedFields || []}
                    onChange={(e) => {
                      setCheckedFields(e);
                    }}
                    schema={{
                      grid: 1,
                    }}
                    options={{
                      enumOptions: educationalFieldsArray,
                    }}
                  />
                </CardComponent>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <HStack justifyContent={"space-between"} width={"100%"}>
              <AdminTypo.Secondarybutton
                onPress={() => setEditAccessModalVisible(false)}
              >
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton onPress={giveAccess}>
                {t("CONFIRM")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Dropout Action  Sheet */}
      <Actionsheet
        isOpen={isOpenDropOut}
        onClose={(e) => setIsOpenDropOut(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenDropOut(false)}
              />
            </VStack>

            <AdminTypo.H1 bold color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </AdminTypo.H1>
            <AdminTypo.H4 color="textGreyColor.450">
              {t("AG_PROFILE_DROPOUT_MESSAGE")}{" "}
            </AdminTypo.H4>
            <AdminTypo.H4 bold color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REASON_MEASSGAE")}{" "}
            </AdminTypo.H4>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg" w="100%">
                <VStack alignItems="center" space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryDropoutReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reasonValue}
                      onChange={(e) => {
                        setReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack>
                <AdminTypo.PrimaryButton
                  isDisabled={isDisable}
                  onPress={() => {
                    dropoutApiCall();
                  }}
                >
                  {t("MARK_AS_DROPOUT")}
                </AdminTypo.PrimaryButton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      {/* REactivate Action  Sheet */}
      <Actionsheet
        isOpen={isOpenReactive}
        onClose={(e) => setIsOpenReactive(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenReactive(false)}
              />
            </VStack>
            <AdminTypo.H1 bold color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </AdminTypo.H1>
            <AdminTypo.H4 color="textGreyColor.450">
              {t("AG_PROFILE_REACTIVAYE_MESSAGE")}
            </AdminTypo.H4>
            <AdminTypo.H4 color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REACTIVATE_REASON_MEASSGAE")}
            </AdminTypo.H4>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg">
                <VStack alignItems="center" bg={"gray.100"} space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryReactivateReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reactivateReasonValue}
                      onChange={(e) => {
                        setReactivateReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>

              <AdminTypo.PrimaryButton
                isDisabled={isDisable}
                onPress={() => {
                  reactivateApiCall();
                }}
              >
                {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
              </AdminTypo.PrimaryButton>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      {/* Reject Action  Sheet */}
      <Actionsheet
        isOpen={isOpenReject}
        onClose={(e) => setIsOpenReject(false)}
      >
        <Actionsheet.Content>
          <VStack alignItems="end" width="100%">
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setIsOpenReject(false)}
            />
          </VStack>

          <AdminTypo.H1 bold color="textGreyColor.450">
            {t("AG_PROFILE_ARE_YOU_SURE")}
          </AdminTypo.H1>

          <AdminTypo.H4 color="textGreyColor.200" pb="4" pl="2">
            {t("PLEASE_MENTION_YOUR_REASON_FOR_REJECTING_THE_CANDIDATE")}
          </AdminTypo.H4>
          <VStack space="5">
            <VStack space="2" bg="gray.100" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <React.Suspense fallback={<HStack>{t("LOADING")}</HStack>}>
                  <CustomRadio
                    options={{
                      enumOptions: benificiaryRejectReasons?.map((e) => ({
                        ...e,
                        label: e?.title,
                        value: e?.value,
                      })),
                    }}
                    schema={{ grid: 2 }}
                    value={reasonValue}
                    onChange={(e) => {
                      setReasonValue(e);
                    }}
                  />
                </React.Suspense>
              </VStack>
            </VStack>

            <AdminTypo.PrimaryButton
              isDisabled={isDisable}
              flex={1}
              onPress={() => {
                RejectApiCall();
              }}
            >
              {t("REJECT")}
            </AdminTypo.PrimaryButton>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Layout>
  );
}

const BeneficiaryJourney = ({
  data,
  enumOptions,
  t,
  auditLogs,
  auditMonth,
  auditYear,
}) => {
  const renderLogs = React.useMemo(() => {
    return auditYear?.map((item) => (
      <React.Fragment key={item}>
        <HStack alignItems={"center"}>
          <Text width={"50px"}>{JSON.parse(item)}</Text>
          <HStack
            height="50px"
            borderColor="Disablecolor.400"
            borderLeftWidth="2px"
            mr="5"
            alignItems="center"
            key={item}
          ></HStack>
        </HStack>
        {auditMonth?.map((month) => {
          return (
            <React.Fragment key={item}>
              <HStack alignItems={"center"}>
                <Text width={"50px"}>{month}</Text>
                <HStack
                  height="25px"
                  borderColor="Disablecolor.400"
                  borderLeftWidth="2px"
                  mr="5"
                  alignItems="center"
                ></HStack>
              </HStack>
              {auditLogs.map((logs, i) => {
                return (
                  <React.Fragment key={item}>
                    <HStack alignItems={"center"}>
                      <Text width={"50px"}>{logs?.date}</Text>
                      <FrontEndTypo.Timeline status={logs?.status?.status}>
                        <FrontEndTypo.H2
                          color="blueText.400"
                          bold
                        ></FrontEndTypo.H2>
                        <GetEnumValue
                          t={t}
                          enumType={"BENEFICIARY_STATUS"}
                          enumOptionValue={logs?.status?.status}
                          enumApiData={enumOptions}
                        />
                        <FrontEndTypo.H4>
                          <Text>By &nbsp;</Text>
                          {logs?.first_name}&nbsp;
                          {logs?.middle_name && `${logs?.middle_name}`}
                          &nbsp;
                          {logs?.last_name && `${logs?.last_name}`}
                        </FrontEndTypo.H4>
                      </FrontEndTypo.Timeline>
                    </HStack>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ));
  }, [auditYear, auditMonth, auditLogs, data, t, enumOptions]);

  return (
    <Stack>
      {/* ... existing JSX ... */}
      <VStack width={"100%"}>{renderLogs}</VStack>
    </Stack>
  );
};

const SelectAllCheckBox = ({
  fields,
  title,
  setCheckedFields,
  checkedFields,
}) => {
  const handleCheckboxChange = React.useCallback(
    (e) => {
      if (!e) {
        const checkbox = checkedFields?.filter(
          (field) => !fields.includes(field)
        );
        setCheckedFields(checkbox);
      } else {
        const checkbox = checkedFields?.filter(
          (field) => !fields.includes(field)
        );
        setCheckedFields([...checkbox, ...fields]);
      }
    },
    [fields, checkedFields, setCheckedFields]
  );

  return <Checkbox onChange={handleCheckboxChange}>{title}</Checkbox>;
};
