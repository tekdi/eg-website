import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ImageView,
  AdminTypo,
  benificiaryRegistoryService,
  enumRegistryService,
  jsonParse,
  uploadRegistryService,
  Breadcrumb,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack, Stack, Modal, Alert } from "native-base";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CustomRadio from "component/CustomRadio";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";

const checkboxIcons = [
  { name: "CheckboxCircleLineIcon", activeColor: "success.500" },
  { name: "CloseCircleLineIcon", activeColor: "red.500" },
];

export default function EnrollmentReceiptView({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = React.useState();
  const [subjects, setSubjects] = React.useState();
  const [reason, setReason] = React.useState({});
  const [error, setError] = React.useState({});
  const [receiptUrl, setReceiptUrl] = React.useState();
  const [fileType, setFileType] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(async () => {
    const profileDetails = async () => {
      const { result } = await benificiaryRegistoryService.getOne(id);
      setData(result);
      let { data: newData } = await enumRegistryService.getSubjects({
        board: result?.program_beneficiaries?.enrolled_for_board,
      });

      const newResult = await uploadRegistryService.getOne({
        document_id: result?.program_beneficiaries?.payment_receipt_document_id,
      });
      setReceiptUrl(newResult);
      setFileType(newResult?.key?.split(".").pop());
      const subject = jsonParse(result?.program_beneficiaries.subjects, []);
      setSubjects(newData?.filter((e) => subject.includes(`${e.id}`)));
      setLoading(false);
    };
    await profileDetails();
  }, []);

  const checkValidation = () => {
    let data = {};
    ["learner_enrollment_details", "enrollment_details"]
      .filter((e) => !reason[e])
      .map((e) => (data = { ...data, [e]: t("PLEASE_SELECT") }));
    setError(data);
    return !Object.keys(data).length;
  };

  const submit = async (status) => {
    if (checkValidation()) {
      const data = await benificiaryRegistoryService.verifyEnrollment({
        user_id: id,
        enrollment_verification_status: status,
        enrollment_verification_reason: reason,
      });

      if (data?.success) {
        setOpenModal(false);
        navigate("/admin/learners/enrollmentVerificationList");
      }
    }
  };

  return (
    <Layout _sidebar={footerLinks} loading={loading}>
      <VStack space={"5"} p="6">
        <HStack space={"2"} justifyContent="space-between">
          <Breadcrumb
            drawer={
              <IconByName size="sm" name="ArrowRightSLineIcon" isDisabled />
            }
            data={[
              <AdminTypo.H1 key="1">
                {t("ENROLLMENT_VERIFICATION")}
              </AdminTypo.H1>,
              <AdminTypo.H2 key="2">{`${data?.first_name} ${data?.last_name}`}</AdminTypo.H2>,
              <AdminTypo.H3 key="3">{`${data?.id}`}</AdminTypo.H3>,
              <ChipStatus
                key={"4"}
                is_duplicate={data?.is_duplicate}
                is_deactivated={data?.is_deactivated}
                status={data?.program_beneficiaries?.status}
              />,
            ]}
          />
          {/* <AdminTypo.Secondarybutton>{t("NEXT")}</AdminTypo.Secondarybutton> */}
        </HStack>
        {data?.program_beneficiaries?.enrollment_status !== "enrolled" ? (
          <Alert status="warning" alignItems={"start"} mb="3" mt="4">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <AdminTypo.H1>{t("PAGE_NOT_ACCESSABLE")}</AdminTypo.H1>
            </HStack>
          </Alert>
        ) : data?.program_beneficiaries?.enrollment_status ===
          "not_enrolled" ? (
          <Alert status="warning" alignItems={"start"} mb="3" mt="4">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <AdminTypo.H1>
                {t("FACILITATOR_STATUS_CANCEL_ENROLMENT")}
              </AdminTypo.H1>
            </HStack>
          </Alert>
        ) : data?.is_duplicate === "yes" && data?.is_deactivated === null ? (
          <Alert status="warning" alignItems={"start"} mb="3" mt="4">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <AdminTypo.H1>{t("RESOLVE_DUPLICATION")}</AdminTypo.H1>
            </HStack>
          </Alert>
        ) : (
          <VStack>
            <AdminTypo.H5 color="textGreyColor.800" bold>
              {t("ENROLLMENT_DETAILS_VERIFICATION")}
            </AdminTypo.H5>
            <HStack space="2">
              <VStack flex="2" pb="1" space={2}>
                <HStack flexWrap={"wrap"}>
                  <TextInfo
                    _box={{ pr: "2", alignItems: "center" }}
                    data={data?.program_beneficiaries}
                    arr={[
                      {
                        label: "ENROLLMENT_STATUS",
                        keyArr: "enrollment_status",
                      },
                      {
                        label: "ENROLLMENT_BOARD",
                        keyArr: "enrolled_for_board",
                      },
                    ]}
                  />
                </HStack>
                <ValidationBox error={error?.enrollment_details}>
                  <CustomRadio
                    options={{
                      enumOptions: [{ value: "yes" }, { value: "no" }],
                    }}
                    schema={{
                      grid: 1,
                      icons: checkboxIcons,
                      _box: { flex: "1", gap: "2" },
                      _hstack: { space: "2" },
                      _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
                    }}
                    value={reason?.enrollment_details}
                    onChange={(e) => {
                      setReason({ ...reason, enrollment_details: e });
                    }}
                  />
                  <VStack flex={4}>
                    <TextInfo
                      data={data?.program_beneficiaries}
                      arr={[
                        {
                          label: "NAME",
                          value: (
                            <AdminTypo.H5>
                              {
                                data?.program_beneficiaries
                                  ?.enrollment_first_name
                              }
                              {data?.program_beneficiaries
                                ?.enrollment_last_name &&
                                " " +
                                  data?.program_beneficiaries
                                    ?.enrollment_last_name}
                              {data?.program_beneficiaries
                                ?.enrollment_middle_name &&
                                " " +
                                  data?.program_beneficiaries
                                    ?.enrollment_middle_name}
                            </AdminTypo.H5>
                          ),
                        },
                        {
                          label: "DOB",
                          value: (
                            <AdminTypo.H5>
                              {moment(
                                data?.program_beneficiaries?.enrollment_dob
                              ).format("DD-MM-YYYY")}
                            </AdminTypo.H5>
                          ),
                        },
                        {
                          label: "AADHAAR_NUMBER",
                          keyArr: "enrollment_aadhaar_no",
                        },
                      ]}
                    />
                  </VStack>
                </ValidationBox>
                <ValidationBox error={error?.learner_enrollment_details}>
                  <CustomRadio
                    options={{
                      enumOptions: [{ value: "yes" }, { value: "no" }],
                    }}
                    schema={{
                      grid: 1,
                      icons: checkboxIcons,
                      _box: { flex: "1", gap: "2" },
                      _hstack: { space: "2" },
                      _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
                    }}
                    value={reason?.learner_enrollment_details}
                    onChange={(e) => {
                      setReason({ ...reason, learner_enrollment_details: e });
                    }}
                  />
                  <VStack flex={4}>
                    <TextInfo
                      data={data?.program_beneficiaries}
                      arr={[
                        {
                          label: "ENROLLMENT_NUMBER",
                          keyArr: "enrollment_number",
                        },
                        {
                          label: "DATE",
                          value: (
                            <AdminTypo.H5>
                              {moment(
                                data?.program_beneficiaries?.enrollment_date
                              ).format("DD-MM-YYYY")}
                            </AdminTypo.H5>
                          ),
                        },
                        {
                          label: "SELECTED_SUBJECTS",
                          value: subjects?.map((e) => (
                            <AdminTypo.H5 key={e?.name}>{e?.name}</AdminTypo.H5>
                          )),
                        },
                      ]}
                    />
                  </VStack>
                </ValidationBox>
              </VStack>

              <VStack flex="5">
                {fileType === "pdf" ? (
                  <ImageView
                    frameborder="0"
                    _box={{ flex: 1 }}
                    height="100%"
                    width="100%"
                    urlObject={receiptUrl}
                    alt="aadhaar_front"
                  />
                ) : (
                  fileType && (
                    <TransformWrapper>
                      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <VStack space="3">
                          <HStack
                            space="2"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconByName
                              p="0"
                              color="light.400"
                              _icon={{ size: "30" }}
                              name="AddCircleLineIcon"
                              onPress={(e) => zoomIn()}
                            />
                            <IconByName
                              p="0"
                              color="light.400"
                              _icon={{ size: "30" }}
                              name="IndeterminateCircleLineIcon"
                              onPress={(e) => zoomOut()}
                            />
                            <IconByName
                              p="0"
                              color="light.400"
                              _icon={{ size: "30" }}
                              name="RefreshLineIcon"
                              onPress={(e) => resetTransform()}
                            />
                          </HStack>
                          <VStack
                            justifyContent="center"
                            alignItems="center"
                            borderWidth="1px"
                            borderColor="light.400"
                          >
                            <TransformComponent
                              wrapperStyle={{ width: "100%" }}
                            >
                              <VStack
                                justifyContent="center"
                                alignItems="center"
                                rounded="sm"
                                borderWidth="1px"
                                borderColor="light.100"
                                {...{
                                  width: "100%",
                                  height: "100vh",
                                }}
                              >
                                <ImageView
                                  isImageTag
                                  {...{
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  style={{
                                    filter: "none",
                                    objectFit: "contain",
                                  }}
                                  urlObject={receiptUrl}
                                  alt="aadhaar_front"
                                />
                              </VStack>
                            </TransformComponent>
                          </VStack>
                        </VStack>
                      )}
                    </TransformWrapper>
                  )
                )}
              </VStack>
            </HStack>
            <HStack>
              <AdminTypo.Successbutton
                isDisabled={
                  reason?.enrollment_details === "no" ||
                  reason?.learner_enrollment_details === "no"
                }
                onPress={(e) => submit("verified")}
              >
                {t("FACILITATOR_STATUS_VERIFY")}
              </AdminTypo.Successbutton>
              <AdminTypo.Dangerbutton
                mx={5}
                isDisabled={
                  reason?.enrollment_details === "yes" &&
                  reason?.learner_enrollment_details === "yes"
                }
                onPress={(e) => submit("pending")}
              >
                {t("FACILITATOR_STATUS_CANCEL_ENROLMENT")}
              </AdminTypo.Dangerbutton>
              <AdminTypo.Secondarybutton
                isDisabled={
                  reason?.enrollment_details === "yes" &&
                  reason?.learner_enrollment_details === "yes"
                }
                onPress={(e) => {
                  if (checkValidation()) {
                    setOpenModal(true);
                  }
                }}
              >
                {t("CHANGE_REQUIRED")}
              </AdminTypo.Secondarybutton>
            </HStack>
            <Modal isOpen={openModal} size="xl">
              <Modal.Content>
                <Modal.Header>{t("ARE_YOU_SURE")}</Modal.Header>
                <Modal.Body p="5">
                  <LearnerInfo item={data} reason={reason} />
                </Modal.Body>
                <Modal.Footer justifyContent={"space-between"}>
                  <AdminTypo.PrimaryButton onPress={(e) => setOpenModal(false)}>
                    {t("CANCEL")}
                  </AdminTypo.PrimaryButton>
                  <AdminTypo.Secondarybutton
                    onPress={(e) => submit("change_required")}
                  >
                    {t("CONFIRM")}
                  </AdminTypo.Secondarybutton>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </VStack>
        )}
      </VStack>
    </Layout>
  );
}

const TextInfo = ({ data, _box, arr }) => {
  const { t } = useTranslation();
  return arr.map((e) => (
    <Stack key={e.label} pb="2" {..._box}>
      <AdminTypo.H4 color={"light.400"}>{t(e?.label || "-")}</AdminTypo.H4>
      {e?.value || <AdminTypo.H5>{data?.[e?.keyArr] || "-"}</AdminTypo.H5>}
    </Stack>
  ));
};

const ValidationBox = ({ children, error }) => (
  <VStack>
    <HStack
      space="4"
      justifyContent="center"
      alignItems="center"
      rounded="xl"
      borderWidth="1px"
      borderColor={error ? "red.200" : "light.400"}
      p={"2"}
    >
      {children}
    </HStack>
    {error && <AdminTypo.H5 color="red.500">{error}</AdminTypo.H5>}
  </VStack>
);

const LearnerInfo = ({ item, reason }) => {
  const { t } = useTranslation();
  return (
    <VStack bg="white" p="2" shadow="FooterShadow" rounded="sm" space="1">
      <HStack justifyContent="space-between">
        <HStack alignItems="Center" flex="5">
          {item?.profile_photo_1?.id ? (
            <ImageView
              source={{
                document_id: item?.profile_photo_1?.id,
              }}
              alt="Alternate Text"
              width={"45px"}
              height={"45px"}
            />
          ) : (
            <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              color="gray.300"
              _icon={{ size: "45px" }}
            />
          )}
          <VStack
            pl="2"
            flex="1"
            wordWrap="break-word"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            <AdminTypo.H4 bold color="textGreyColor.800">
              {item?.first_name}
              {item?.middle_name &&
                item?.middle_name !== "null" &&
                ` ${item.middle_name}`}
              {item?.last_name &&
                item?.last_name !== "null" &&
                ` ${item.last_name}`}
            </AdminTypo.H4>
            <AdminTypo.H5 color="textGreyColor.800">
              {item?.mobile}
            </AdminTypo.H5>
          </VStack>
        </HStack>
        <VStack flex="2">
          <ChipStatus
            status={item?.program_beneficiaries?.status}
            is_duplicate={item?.is_duplicate}
            is_deactivated={item?.is_deactivated}
            rounded={"sm"}
          />
        </VStack>
      </HStack>
      {reason?.learner_enrollment_details === "no" &&
      reason?.enrollment_details === "no" ? (
        <AdminTypo.H4 color="blueText.450" underline>
          {t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH")}
        </AdminTypo.H4>
      ) : reason?.learner_enrollment_details === "no" ? (
        <AdminTypo.H4 color="blueText.450" underline>
          {t("CORRECT_ENROLLMENT_DETAILS")}
        </AdminTypo.H4>
      ) : (
        reason?.enrollment_details === "no" && (
          <AdminTypo.H4 color="blueText.450" underline>
            {t("CORRECT_ENROLLMENT_LEARNER_DETAILS")}
          </AdminTypo.H4>
        )
      )}
    </VStack>
  );
};
