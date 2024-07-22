import {
  IconByName,
  AdminTypo,
  benificiaryRegistoryService,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  getUniqueArray,
  FrontEndTypo,
  facilitatorRegistryService,
  jsonParse,
  PoAdminLayout,
} from "@shiksha/common-lib";
import { Box, HStack, Modal, Stack, VStack, Text } from "native-base";
import Chip from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  Fragment,
} from "react";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Clipboard from "component/Clipboard";

export default function View({ footerLinks }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState({});
  const { id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [enumOptions, setEnumOptions] = useState({});
  const [contextId, setcontextId] = useState();
  const [auditLogs, setauditLogs] = useState([]);
  const [auditMonth, setauditMonth] = useState([]);
  const [auditYear, setauditYear] = useState([]);
  const [enrollmentSubjects, setEnrollmentSubjects] = useState();
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const [boardName, setBoardName] = useState({});

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

  const getAuditData = useCallback(async () => {
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

  useEffect(async () => {
    let data = {
      edit_page_type: "document_status",
      documents_status: status,
    };
    if (Object.keys(status).length > 0) {
      await benificiaryRegistoryService.getStatusUpdate(id, data);
    }
  }, [status]);

  useEffect(() => {
    if (contextId) {
      getAuditData();
    }
  }, [contextId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setLoading(true);
      let newData = await benificiaryRegistoryService.getOne(id);
      const value = newData?.result?.program_beneficiaries?.enrolled_for_board;
      const boardName = await enumRegistryService.boardName(value);
      setBoardName(boardName?.name);
      setData(newData?.result);
      const subjectId = jsonParse(
        newData?.result?.program_beneficiaries?.subjects
      );
      if (subjectId?.length > 0) {
        let subjectResult = await enumRegistryService.subjectsList(value);
        const subjectNames = subjectId.map((id) => {
          const matchingSubject = subjectResult?.subjects?.find(
            (subject) => subject.subject_id === parseInt(id)
          );
          return matchingSubject ? matchingSubject.name : "Subject not found";
        });
        setEnrollmentSubjects(subjectNames);
      }
      setcontextId(newData?.result?.program_beneficiaries?.id);
      if (newData?.result?.program_beneficiaries?.documents_status) {
        setStatus(
          JSON.parse(newData?.result?.program_beneficiaries?.documents_status)
        );
      }
      const enumData = await enumRegistryService.listOfEnum();
      setEnumOptions(enumData?.data ? enumData?.data : {});
      const obj = {
        edit_req_for_context: "users",
        edit_req_for_context_id: id,
      };
      const resule = await facilitatorRegistryService?.getEditRequestDetails(
        obj
      );
    } catch (error) {
      console.error("Error fetching beneficiary data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <PoAdminLayout _sidebar={footerLinks} loading={loading}>
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
              {["enrolled_ip_verified", "registered_in_camp"].includes(
                data?.program_beneficiaries?.status
              )
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
              <ChipStatus
                is_duplicate={data?.is_duplicate}
                is_deactivated={data?.is_deactivated}
                status={data?.program_beneficiaries?.status}
              />
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
                  <VStack>
                    <AdminTypo.H5 bold flex="0.67" color="textGreyColor.550">
                      {t("AADHAAR_NO")}:
                    </AdminTypo.H5>

                    <AdminTypo.H5
                      justifyContent={"center"}
                      alignItems={"center"}
                      color="textGreyColor.800"
                      bold
                    >
                      {data?.aadhar_no ? data?.aadhar_no : "-"}
                    </AdminTypo.H5>
                  </VStack>
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
                <AdminTypo.H4 color="textGreyColor.800" bold>
                  {t("DOCUMENTATION_DETAILS")}
                </AdminTypo.H4>

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
                      <AdminTypo.H4 flex={"1"}>
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.jan_adhar || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("AADHAAR_CARD")}:
                      </AdminTypo.H5>

                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.aadhaar || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("PHOTO")}:
                      </AdminTypo.H5>
                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.photo || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("MOBILE_NUMBER")}:
                      </AdminTypo.H5>
                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.mobile || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("MARKSHEET")}:
                      </AdminTypo.H5>
                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.marksheet || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>
                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("BANK_PASSBOOK")}:
                      </AdminTypo.H5>
                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.bank || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
                    </HStack>

                    <HStack alignItems="center">
                      <AdminTypo.H5 bold flex="1" color="textGreyColor.550">
                        {t("BIRTH_CERTIFICATE")}:
                      </AdminTypo.H5>
                      <AdminTypo.H4 flex="1">
                        <GetEnumValue
                          t={t}
                          enumType={"DOCUMENT_STATUS"}
                          enumOptionValue={status?.birth || ""}
                          enumApiData={enumOptions}
                        />
                      </AdminTypo.H4>
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
                <AdminTypo.H4 color="textGreyColor.800" bold>
                  {t("ENROLLMENT_DETAILS")}
                </AdminTypo.H4>
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
                            ? boardName
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
    </PoAdminLayout>
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
  const renderLogs = useMemo(() => {
    return auditYear?.map((item) => (
      <Fragment key={item}>
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
            <Fragment key={item}>
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
                  <Fragment key={item}>
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
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </Fragment>
    ));
  }, [auditYear, auditMonth, auditLogs, data, t, enumOptions]);

  return (
    <Stack>
      {/* ... existing JSX ... */}
      <VStack width={"100%"}>{renderLogs}</VStack>
    </Stack>
  );
};
