import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  benificiaryRegistoryService,
  getBeneficaryDocumentationStatus,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  getUniqueArray,
  FrontEndTypo,
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
} from "native-base";
import Chip from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function AgAdminProfile({ footerLinks }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [EditButton, setEditButton] = React.useState(false);
  const [selectData, setselectData] = React.useState([]);
  const [status, setStatus] = React.useState({});
  const { id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();
  const [msgshow, setmsgshow] = React.useState(false);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [benificiary, setBeneficiary] = React.useState();
  const [contextId, setcontextId] = React.useState();
  const [auditLogs, setauditLogs] = React.useState([]);
  const [auditMonth, setauditMonth] = React.useState([]);
  const [auditYear, setauditYear] = React.useState([]);
  const [subjectLists, setSubjectLits] = React.useState([]);
  const [numberArray, setNumberArray] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  const GetOptions = ({ array, enumType, enumApiData }) => {
    return (
      <VStack>
        {getUniqueArray(array)?.map((item, i) => (
          <Chip
            textAlign="center"
            key={i}
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

  const getSubjects = async (value) => {
    let { data } = await enumRegistryService.getSubjects({
      board: value,
    });
    setSubjectLits(data);
  };

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setData(result?.result);
    const subjectId = JSON.parse(
      result?.result?.program_beneficiaries?.subjects
    );
    const subjectNames = subjectId.map((id) => {
      const matchingSubject = subjectLists.find(
        (subject) => subject.id === parseInt(id)
      );
      return matchingSubject ? matchingSubject.name : "Subject not found";
    });
    setNumberArray(subjectNames);
  };

  const getAuditData = async () => {
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
  };

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
    getSubjects();
    getAuditData();
    benificiaryDetails();
  }, [contextId, benificiary]);

  React.useEffect(async () => {
    setLoading(true);
    let newData = await benificiaryRegistoryService.getOne(id);
    let docStatus = newData?.result?.program_beneficiaries?.documents_status;
    setcontextId(newData?.result?.program_beneficiaries?.id);
    setBeneficiary(newData);
    setmsgshow(getBeneficaryDocumentationStatus(docStatus));
    if (newData.result?.program_beneficiaries?.documents_status) {
      setStatus(
        JSON.parse(newData.result?.program_beneficiaries?.documents_status)
      );
    }
    let data = await benificiaryRegistoryService.getDocumentStatus();
    setselectData(data);
    const enumData = await enumRegistryService.listOfEnum();
    setEnumOptions(enumData?.data ? enumData?.data : {});
    setLoading(false);
  }, []);

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
          </HStack>
          <HStack p="5" justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.program_beneficiaries?.status} />
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
                  name="Cake2LineIcon"
                  color="textGreyColor.300"
                />
                <AdminTypo.H6 color="textGreyColor.600" bold>
                  {data?.program_beneficiaries?.status ===
                  "enrolled_ip_verified"
                    ? data?.program_beneficiaries?.enrollment_dob
                    : data?.dob ?? "-"}
                </AdminTypo.H6>
              </HStack>

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
            </VStack>
            <HStack flex="0.5" mt={"-5"} justifyContent={"space-between"}>
              {data?.profile_photo_1?.id ? (
                <ImageView
                  source={{
                    document_id: data?.profile_photo_1?.id,
                  }}
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
              <AdminTypo.Secondarybutton
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                {t("VIEW_JOURNEY")}
              </AdminTypo.Secondarybutton>
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
                  <VStack space="20px" w="auto">
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

            <HStack justifyContent="space-between">
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

                <VStack>
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
                </VStack>
              </VStack>

              <VStack
                space={"5"}
                w="50%"
                bg="light.100"
                p="6"
                rounded="xl"
                ml="3"
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
                        <AdminTypo.H5 flex="0.8" bold color="textGreyColor.550">
                          {t("REACTIVATE_REASONS_CAREER_ASPIRATIONS")}:
                        </AdminTypo.H5>
                        <AdminTypo.H5 color="textGreyColor.800" bold>
                          {data?.program_beneficiaries?.learning_motivation ? (
                            <GetOptions
                              array={
                                data?.program_beneficiaries?.learning_motivation
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
                        <AdminTypo.H5 flex="0.7" color="textGreyColor.800" bold>
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
            </HStack>

            <HStack w={"100%"} space={4}>
              <VStack
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                space={"5"}
                p="5"
                mt="4"
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
                            selectData.map((item, i) => {
                              return (
                                <Select.Item
                                  key={i}
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
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                          key={i}
                        >
                          {selectData?.map((item, i) => {
                            return (
                              <Select.Item
                                key={i}
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
                mt="4"
                rounded="xl"
                w={"50%"}
              >
                <HStack justifyContent={"space-between"}>
                  <AdminTypo.H4 color="textGreyColor.800" bold>
                    {t("ENROLLMENT_DETAILS")}
                  </AdminTypo.H4>

                  {data?.program_beneficiaries?.status === "enrolled" ? (
                    <AdminTypo.StatusButton
                      width={"25%"}
                      status={"success"}
                      onPress={(e) =>
                        navigate(`/admin/learners/enrollmentReceipt/${id}`)
                      }
                    >
                      {t("VERIFY")}
                    </AdminTypo.StatusButton>
                  ) : (
                    <React.Fragment />
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
                    <VStack space={"16"}>
                      <HStack alignItems={"Center"}>
                        <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                          {t("TYPE_OF_ENROLLMENT")} :-
                        </AdminTypo.H5>
                        <AdminTypo.H5
                          flex="0.69"
                          color="textGreyColor.800"
                          pl="1"
                          bold
                        >
                          {data?.program_beneficiaries?.type_of_enrollement
                            ? data?.program_beneficiaries?.type_of_enrollement
                            : "-"}
                        </AdminTypo.H5>
                      </HStack>

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
                  key={""}
                >
                  <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                    {t("SUBJECTS")}
                  </AdminTypo.H5>
                  <AdminTypo.H5 flex="0.69" color="textGreyColor.800" bold>
                    {numberArray?.map((item) => {
                      return <Text>{item},</Text>;
                    })}
                  </AdminTypo.H5>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
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
    </Layout>
  );
}

function BeneficiaryJourney({
  data,
  enumOptions,
  t,
  auditLogs,
  auditMonth,
  auditYear,
}) {
  return (
    <Stack>
      <HStack alignItems={"center"} mt={5} ml={5}>
        {data?.profile_photo_1?.id ? (
          <ImageView
            source={{
              document_id: data?.profile_photo_1?.id,
            }}
            width={"80px"}
            height={"80px"}
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "80px" }}
          />
        )}
        <AdminTypo.H2 bold color="textMaroonColor.400" marginLeft={"5px"}>
          {t("STATUS_FLOW_OF")}
          <br />
          <Text key={""}>
            {data?.first_name}
            {data?.middle_name &&
              data?.middle_name !== "null" &&
              ` ${data.middle_name}`}
            {data?.last_name &&
              data?.last_name !== "null" &&
              ` ${data?.last_name}`}
          </Text>
        </AdminTypo.H2>
      </HStack>
      <HStack mt={5} left={"30px"} width={"80%"}>
        <VStack width={"100%"}>
          {auditYear.map((item, i) => {
            return (
              <React.Fragment>
                <HStack alignItems={"center"}>
                  <Text width={"50px"}>{JSON.parse(item)}</Text>
                  <HStack
                    height="50px"
                    borderColor="Disablecolor.400"
                    borderLeftWidth="2px"
                    mr="5"
                    alignItems="center"
                    key={i}
                  ></HStack>
                </HStack>
                {auditMonth.map((month) => {
                  return (
                    <React.Fragment key={i}>
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
                          <React.Fragment>
                            <HStack alignItems={"center"}>
                              <Text width={"50px"}>{logs?.date}</Text>;
                              <FrontEndTypo.Timeline
                                status={logs?.status?.status}
                              >
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
            );
          })}
        </VStack>
      </HStack>
    </Stack>
  );
}
