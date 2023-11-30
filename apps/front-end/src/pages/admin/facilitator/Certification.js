import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  benificiaryRegistoryService,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  FrontEndTypo,
  tableCustomStyles,
  facilitatorRegistryService,
  jsonParse,
} from "@shiksha/common-lib";
import { Box, HStack, Stack, VStack, Text } from "native-base";
import Chip from "component/Chip";

import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { ChipStatus } from "component/BeneficiaryStatus";
import DataTable from "react-data-table-component";
import Clipboard from "component/Clipboard";
import { useTranslation } from "react-i18next";

export default function Certification({ footerLinks }) {
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
  const [checkedFields, setCheckedFields] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const { t } = useTranslation();
  const [certificateData, setCertificateData] = React.useState();
  const [downloadCertificate, setDownCertificate] = React.useState();

  const certificateDownload = async (id) => {
    const result = await enumRegistryService.postCertificates(id);
    setDownCertificate(result?.data);
  };
  const columns = (t) => [
    {
      name: t("SR_NO"),
      selector: (row, index) => index + 1,
    },
    {
      name: t("PURPOSE"),
      selector: (row) => row?.context,
      attr: "name",
      wrap: true,
    },
    {
      name: t("SCORE"),
      selector: (row) => row?.score,
      attr: "name",
      wrap: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row?.status,
    //   attr: "name",
    //   wrap: true,
    // },
    {
      name: t("STATUS"),
      selector: (row) => (
        <AdminTypo.Secondarybutton my="3" onPress={() => certificateDownload()}>
          {t("DOWNLOAD")}
        </AdminTypo.Secondarybutton>
      ),
    },
  ];
  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setData(result?.result);
    setAadhaarValue(result?.result?.aadhar_no);
    const subjectId = jsonParse(
      result?.result?.program_beneficiaries?.subjects
    );
    if (subjectId?.length > 0) {
      let subjectResult = await enumRegistryService.getSubjects({
        board: result?.result?.program_beneficiaries?.enrolled_for_board,
      });
      const subjectNames = subjectId.map((id) => {
        const matchingSubject = subjectResult?.data?.find(
          (subject) => subject.id === parseInt(id)
        );
        return matchingSubject ? matchingSubject.name : "Subject not found";
      });
      setEnrollmentSubjects(subjectNames);
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
    benificiaryDetails();
  }, [contextId, benificiary]);

  React.useEffect(async () => {
    setLoading(true);
    let newData = await benificiaryRegistoryService.getOne(id);
    setcontextId(newData?.result?.program_beneficiaries?.id);
    setBeneficiary(newData);
    if (newData.result?.program_beneficiaries?.documents_status) {
      setStatus(
        JSON.parse(newData.result?.program_beneficiaries?.documents_status)
      );
    }
    let data = await benificiaryRegistoryService.getDocumentStatus();
    // setselectData(data);
    const enumData = await enumRegistryService.listOfEnum();
    setEnumOptions(enumData?.data ? enumData?.data : {});
    setBenificiaryDropoutReasons(
      enumData?.data?.BENEFICIARY_REASONS_FOR_DROPOUT_REASONS
    );
    setBenificiaryReactivateReasons(enumData?.data?.REACTIVATE_REASONS);
    setBenificiaryRejectReasons(
      enumData?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER
    );
    const obj = { edit_req_for_context: "users", edit_req_for_context_id: id };
    const resule = await facilitatorRegistryService?.getEditRequestDetails(obj);
    if (resule?.data?.[0]) {
      setGetRequestData(resule?.data?.[0]);
      const data = JSON.parse(resule?.data?.[0]?.fields);
      setCheckedFields(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.getCertificate(id);
    let test_id = result?.data?.[0].test_id;
    let user_id = result?.data?.[0].user_id;
    console.log("test_id", test_id);
    console.log("user id", user_id);
    setCertificateData(result?.data);
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
        </Box>

        <Box>
          <VStack space={"5"} p="5">
            <HStack justifyContent={"space-between"}>
              <AdminTypo.H4 bold color="textGreyColor.800">
                CERTIFICATION
              </AdminTypo.H4>
              <HStack></HStack>
            </HStack>

            <HStack w={"100%"} space={4}>
              <VStack
                borderWidth={"1px"}
                borderColor={"primary.200"}
                borderStyle={"solid"}
                space={"5"}
                p="5"
                rounded="xl"
                bg="light.100"
                w={"100%"}
              >
                <DataTable
                  customStyles={tableCustomStyles}
                  columns={[...columns(t)]}
                  data={certificateData}
                  selectableRows
                  persistTableHead
                  progressPending={loading}
                  pagination
                  paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
                  paginationServer
                  onChangeRowsPerPage={(e) => {
                    setFilter({ ...filter, limit: e });
                  }}
                  onChangePage={(e) => {
                    setFilter({ ...filter, page: e });
                  }}
                />
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
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
          <Text>
            {data?.program_beneficiaries?.enrollment_first_name}
            {data?.program_beneficiaries?.enrollment_middle_name &&
              data?.program_beneficiaries?.enrollment_middle_name !== "null" &&
              ` ${data?.program_beneficiaries?.enrollment_middle_name}`}
            {data?.program_beneficiaries?.enrollment_last_name &&
              data?.program_beneficiaries?.enrollment_last_name !== "null" &&
              ` ${data?.program_beneficiaries?.enrollment_last_name}`}
          </Text>
        </AdminTypo.H2>
      </HStack>
      <HStack mt={5} left={"30px"} width={"80%"}>
        <VStack width={"100%"}>
          {auditYear.map((item, i) => {
            return (
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
                {auditMonth.map((month) => {
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
