import React, { Fragment, useCallback, useEffect, useState } from "react";
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
  jsonToQueryString,
  CustomRadio,
  getSelectedProgramId,
  Loading,
  getEnrollmentIds,
} from "@shiksha/common-lib";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { HStack, VStack, Modal, Alert } from "native-base";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import PropTypes from "prop-types";

const checkboxIcons = (value) => {
  const iconsData = [
    {
      name: "CloseCircleLineIcon",
      activeName: "CloseCircleFillIcon",
      activeColor: "#d53546",
      style: {},
      _icon: { size: "25", activeColor: "#d53546", color: "#484848" },
    },
    {
      name: "CheckboxCircleLineIcon",
      activeName: "CheckboxCircleFillIcon",
      activeColor: "#038400",
      style: {},
      _icon: { size: "25", activeColor: "#038400", color: "#484848" },
    },
  ];
  return iconsData.map((e) => {
    if (
      (value === "yes" && e.name === "CheckboxCircleLineIcon") ||
      (value === "no" && e.name === "CloseCircleLineIcon")
    ) {
      return { ...e, name: e?.activeName };
    }
    return e;
  });
};

export default function SYCVerification({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const filter = jsonToQueryString(location?.state);
  const { id } = useParams();
  const [data, setData] = useState();
  const [subjects, setSubjects] = useState();
  const [reason, setReason] = useState({});
  const [error, setError] = useState({});
  const [receiptUrl, setReceiptUrl] = useState();
  const [fileType, setFileType] = useState();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [boardName, setBoardName] = useState({});
  const [localData, setLocalData] = useState({});
  const [paymentDocId, setPaymentDocId] = useState([]);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const handleSetReceiptUrl = async (doc_id) => {
    setIsButtonLoading(true);
    const newResult = await uploadRegistryService.getOne({
      document_id: doc_id,
    });
    setReceiptUrl({ url: newResult, doc_id });
    setFileType(newResult?.key?.split(".").pop());
    setIsButtonLoading(false);
  };
  const profileDetails = useCallback(async () => {
    const { state_name } = await getSelectedProgramId();
    setLocalData(state_name);
    const { result } = await benificiaryRegistoryService.getOne(id);
    const value = result?.program_beneficiaries?.enrolled_for_board;
    setData(result);
    const { subjects } = await enumRegistryService.subjectsList(value);
    const boardName = await enumRegistryService.boardName(value);
    setBoardName(boardName?.name);
    const documentData = getEnrollmentIds(
      result?.program_beneficiaries?.payment_receipt_document_id,
      state_name,
    );
    setPaymentDocId(documentData);
    await handleSetReceiptUrl(documentData?.payment_receipt_document_id);
    const subject = jsonParse(result?.program_beneficiaries.subjects, []);
    setSubjects(subjects?.filter((e) => subject?.includes(`${e.subject_id}`)));
    setLoading(false);
  }, [id]);

  const handleButtonClick = async (doc_id) => {
    await handleSetReceiptUrl(doc_id);
  };

  useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  const checkValidation = useCallback(() => {
    let data = {};
    ["learner_enrollment_details", "enrollment_details"]
      .filter((e) => !reason[e])
      .map((e) => (data = { ...data, [e]: t("PLEASE_SELECT") }));
    setError(data);
    return !Object.keys(data).length;
  }, [reason, t]);

  const submit = useCallback(
    async (status) => {
      if (!checkValidation()) return;

      const lastStandard = parseInt(
        data?.core_beneficiaries?.last_standard_of_education ?? "",
        10,
      );
      const hasWarning = isNaN(lastStandard) || lastStandard < 5;

      if (hasWarning && !openWarningModal) {
        setOpenWarningModal(true);
        return;
      }

      const response = await benificiaryRegistoryService.verifyEnrollment({
        user_id: id,
        enrollment_verification_status: status,
        enrollment_verification_reason: reason,
      });
      if (response?.success) {
        setOpenModal(false);
        navigate({
          pathname:
            data?.program_beneficiaries?.status == "sso_id_enrolled"
              ? "/admin/learners/enrollmentVerificationList/SSOID"
              : "/admin/learners/enrollmentVerificationList",
          search: `?${createSearchParams(filter)}`,
        });
      }
    },
    [
      checkValidation,
      createSearchParams,
      filter,
      id,
      navigate,
      reason,
      openWarningModal,
    ],
  );

  return (
    <Layout _sidebar={footerLinks} loading={loading}>
      <VStack space={"5"} p="6">
        <HStack space={"2"} justifyContent="space-between">
          <Breadcrumb
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              <AdminTypo.H4 key="1" onPress={() => navigate(-1)}>
                {t("SYC_VERIFICATION")}
              </AdminTypo.H4>,
              <AdminTypo.H4 key="2" onPress={() => navigate(-1)}>{`${
                data?.first_name
              } ${data?.last_name ? data?.last_name : " "}`}</AdminTypo.H4>,
              <AdminTypo.H4
                key="3"
                bold
                onPress={() => navigate(-1)}
              >{`${data?.id}`}</AdminTypo.H4>,
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
        <Body data={data}>
          <VStack>
            <HStack
              flexDirection={["column", "column", "row", "row", "row"]}
              style={{ gap: "8px" }}
            >
              <VStack flex={["", "", "3", "3", "2"]} pb="1" space={4}>
                <VStack flex={4}>
                  <HStack
                    alignItems="center"
                    justifyContent={"center"}
                    flexDirection={["row", "row", "column", "column", "row"]}
                    style={{ gap: "8px" }}
                  >
                    {data?.profile_photo_1?.name ? (
                      [data?.profile_photo_1].map(
                        (photo) =>
                          photo?.id && (
                            <ImageView
                              key={photo?.id}
                              w="85px"
                              h="85px"
                              source={{
                                document_id: photo?.id,
                              }}
                            />
                          ),
                      )
                    ) : (
                      <IconByName
                        isDisabled
                        name="AccountCircleLineIcon"
                        color="textGreyColor.300"
                        _icon={{ size: "90px" }}
                      />
                    )}
                  </HStack>
                </VStack>
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    navigate(`/admin/beneficiary/${data?.id}`);
                  }}
                >
                  {t("LEARNER_PROFILE")}
                </AdminTypo.PrimaryButton>
                <ValidationBox
                  error={error?.learner_enrollment_details}
                  data={[
                    {
                      data: {
                        enrolled_for_board: boardName,
                        status: (
                          <ChipStatus
                            key={"4"}
                            is_duplicate={data?.is_duplicate}
                            is_deactivated={data?.is_deactivated}
                            status={data?.program_beneficiaries?.status}
                          />
                        ),
                      },
                      arr: [
                        {
                          label: "STATUS",
                          keyArr: "status",
                        },
                        {
                          label: "ENROLLMENT_BOARD",
                          keyArr: "enrolled_for_board",
                        },
                      ],
                    },
                    {
                      data: data?.program_beneficiaries,
                      arr: [
                        {
                          label: "NAME",
                          value: (
                            <AdminTypo.H5>
                              {[
                                data?.program_beneficiaries
                                  ?.enrollment_first_name,
                                data?.program_beneficiaries
                                  ?.enrollment_middle_name,
                                data?.program_beneficiaries
                                  ?.enrollment_last_name,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </AdminTypo.H5>
                          ),
                        },
                        {
                          label: "DOB",
                          value: (
                            <AdminTypo.H5>
                              {data?.program_beneficiaries?.enrollment_dob
                                ? moment(
                                    data?.program_beneficiaries?.enrollment_dob,
                                  ).format("DD-MM-YYYY")
                                : "-"}
                            </AdminTypo.H5>
                          ),
                        },
                        {
                          label: "MOBILE_NUMBER",
                          keyArr: "enrollment_mobile_no",
                        },
                      ],
                    },
                    {
                      data: data?.program_beneficiaries,
                      arr: [
                        {
                          label: "DATE",
                          value: (
                            <AdminTypo.H5>
                              {data?.program_beneficiaries?.enrollment_date
                                ? moment(
                                    data?.program_beneficiaries
                                      ?.enrollment_date,
                                  ).format("DD-MM-YYYY")
                                : "-"}
                            </AdminTypo.H5>
                          ),
                        },
                      ],
                    },
                    {
                      data: data?.program_beneficiaries,
                      arr: [
                        {
                          label: "SELECTED_SUBJECTS",
                          value: subjects?.map((e) => (
                            <AdminTypo.H5 key={e?.name}>{e?.name}</AdminTypo.H5>
                          )),
                        },
                      ],
                    },
                  ]}
                />
              </VStack>
              <VStack flex={["", "", "5", "5", "5"]}>
                {localData === "BIHAR" && (
                  <HStack m={4} space={2}>
                    <ActiveButton
                      isActive={
                        receiptUrl?.doc_id ===
                        paymentDocId?.payment_receipt_document_id
                      }
                      onPress={() => {
                        handleButtonClick(
                          paymentDocId?.payment_receipt_document_id,
                        );
                      }}
                    >
                      {t("PAYMENT_RECEIPTS")}
                    </ActiveButton>
                    <ActiveButton
                      isActive={
                        receiptUrl?.doc_id === paymentDocId?.application_form
                      }
                      onPress={() => {
                        handleButtonClick(paymentDocId?.application_form);
                      }}
                    >
                      {t("APPLICATION_FORM")}
                    </ActiveButton>
                    <ActiveButton
                      isActive={
                        receiptUrl?.doc_id ===
                        paymentDocId?.application_login_id
                      }
                      onPress={() => {
                        handleButtonClick(paymentDocId?.application_login_id);
                      }}
                    >
                      {t("APPLICATION_LOGIN_ID_SS")}
                    </ActiveButton>
                  </HStack>
                )}
                {isButtonLoading ? (
                  <Loading />
                ) : fileType === "pdf" ? (
                  <ImageView
                    frameborder="0"
                    _box={{ flex: 1 }}
                    height="100%"
                    width="100%"
                    urlObject={receiptUrl?.url}
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
                                  _box={{
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  {...{
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  style={{
                                    filter: "none",
                                    objectFit: "contain",
                                  }}
                                  urlObject={receiptUrl?.url}
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
            <HStack space="4">
              <AdminTypo.Successbutton
                isLoading={isButtonLoading}
                isDisabled={
                  reason?.enrollment_details === "no" ||
                  reason?.learner_enrollment_details === "no"
                }
                onPress={(e) =>
                  submit(
                    data?.program_beneficiaries?.status == "sso_id_enrolled"
                      ? "sso_id_verified"
                      : "verified",
                  )
                }
              >
                {t(
                  data?.program_beneficiaries?.status == "sso_id_enrolled"
                    ? "BENEFICIARY_STATUS_BTNTEXT_SSOID_VERIFY"
                    : "BENEFICIARY_STATUS_BTNTEXT_VERIFY",
                )}
              </AdminTypo.Successbutton>
              <AdminTypo.Secondarybutton
                isLoading={isButtonLoading}
                isDisabled={
                  reason?.enrollment_details === "yes" &&
                  reason?.learner_enrollment_details === "yes"
                }
                onPress={(e) => {
                  if (checkValidation()) {
                    setOpenModal("change_required");
                  }
                }}
              >
                {t("CHANGE_REQUIRED")}
              </AdminTypo.Secondarybutton>
            </HStack>
            <Modal
              isOpen={openWarningModal}
              onClose={() => setOpenWarningModal(false)}
            >
              <Modal.Content>
                <Modal.Header textAlign={"Center"}>
                  <AdminTypo.H2 color="textGreyColor.500">
                    {t("EXPIRY_CONTENT.HEADING")}
                  </AdminTypo.H2>
                </Modal.Header>
                <Modal.Body>
                  <VStack space={4}>
                    {t("EDUCATION_STANDARD_IP_WARNING")}
                  </VStack>
                </Modal.Body>
                <Modal.Footer justifyContent={"space-between"}>
                  <AdminTypo.Secondarybutton onPress={() => submit("rejected")}>
                    {t("REJECT")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.Successbutton
                    onPress={(e) =>
                      submit(
                        data?.program_beneficiaries?.status == "sso_id_enrolled"
                          ? "sso_id_verified"
                          : "verified",
                      )
                    }
                  >
                    {t("PRERAK_PROCEED_BTN")}
                  </AdminTypo.Successbutton>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
            <Modal isOpen={openModal} size="xl">
              <Modal.Content>
                <Modal.Header>{t("ARE_YOU_SURE")}</Modal.Header>
                <Modal.Body p="5">
                  <LearnerInfo item={data} reason={reason} status={openModal} />
                </Modal.Body>
                <Modal.Footer justifyContent={"space-between"}>
                  <AdminTypo.PrimaryButton onPress={(e) => setOpenModal()}>
                    {t("CANCEL")}
                  </AdminTypo.PrimaryButton>
                  <AdminTypo.Secondarybutton
                    isDisabled={isButtonLoading}
                    onPress={(e) => submit(openModal)}
                  >
                    {t("CONFIRM")}
                  </AdminTypo.Secondarybutton>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </VStack>
        </Body>
      </VStack>
    </Layout>
  );
}

const Body = ({ data, children }) => {
  const { t } = useTranslation();
  const { program_beneficiaries, is_duplicate, is_deactivated } = data || {};
  const status = program_beneficiaries?.status;
  const enrollmentStatus = program_beneficiaries?.enrollment_status;

  let alertContent = null;

  switch (true) {
    case !["pragati_syc_reattempt"].includes(status):
      alertContent = t("PAGE_NOT_ACCESSABLE");
      break;
    case enrollmentStatus === "not_enrolled":
      alertContent = t("FACILITATOR_STATUS_CANCEL_ENROLMENT");
      break;
    case is_duplicate === "yes" && is_deactivated === null:
      alertContent = t("RESOLVE_DUPLICATION");
      break;
    default:
      return children;
  }

  return (
    <Alert status="warning" alignItems={"start"} mb="3" mt="4">
      <HStack alignItems="center" space="2" color>
        <Alert.Icon />
        <AdminTypo.H1>{alertContent}</AdminTypo.H1>
      </HStack>
    </Alert>
  );
};

const TextInfo = ({ data, _box, arr }) => {
  const { t } = useTranslation();
  return arr.map((e) => (
    <HStack
      borderBottomWidth={1}
      borderColor={"grayInLight"}
      key={e.label}
      py="2"
      alignItems={"center"}
      {..._box}
    >
      <AdminTypo.H4 flex="1" color={"light.400"} bold>
        {t(e?.label || "-")}
      </AdminTypo.H4>
      {e?.value ? (
        <VStack flex="1">{e?.value} </VStack>
      ) : (
        <VStack>
          <AdminTypo.H5>{data?.[e?.keyArr] || "-"}</AdminTypo.H5>
        </VStack>
      )}
    </HStack>
  ));
};

const ValidationBox = ({ data, error, _vstack }) =>
  data?.map((item) => (
    <VStack key={item?.item} {..._vstack}>
      <VStack
        space="4"
        rounded="xl"
        borderWidth="1px"
        borderColor={error ? "red.200" : "light.400"}
        p={"2"}
      >
        <TextInfo _box={{ space: "2", p: 4 }} {...item} />
        <CheckButton />
      </VStack>
      {error && <AdminTypo.H5 color="red.500">{error}</AdminTypo.H5>}
    </VStack>
  ));

const Message = ({ status, reason }) => {
  const { t } = useTranslation();
  if (
    reason?.learner_enrollment_details === "no" &&
    reason?.enrollment_details === "no"
  ) {
    return (
      <AdminTypo.H4 color="blueText.450" underline>
        {t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH")}
      </AdminTypo.H4>
    );
  } else if (reason?.learner_enrollment_details === "no") {
    return (
      <AdminTypo.H4 color="blueText.450" underline>
        {t("CORRECT_ENROLLMENT_DETAILS")}
      </AdminTypo.H4>
    );
  } else if (reason?.enrollment_details === "no") {
    return (
      <AdminTypo.H4 color="blueText.450" underline>
        {t("CORRECT_ENROLLMENT_LEARNER_DETAILS")}
      </AdminTypo.H4>
    );
  }
  return <Fragment />;
};

const LearnerInfo = ({ item, reason, status }) => {
  const { t } = useTranslation();

  return (
    <VStack space={4}>
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
              status={
                status === "pending"
                  ? "not_enrolled"
                  : item?.program_beneficiaries?.status
              }
              is_duplicate={item?.is_duplicate}
              is_deactivated={item?.is_deactivated}
              rounded={"sm"}
            />
          </VStack>
        </HStack>
        <Message {...{ reason, status }} />
      </VStack>
      {status === "pending" && (
        <Alert status="warning" py="2px" px="2" flexDirection="row" gap="2">
          <Alert.Icon size="3" />
          <AdminTypo.H4>
            {t("FACILITATOR_STATUS_CANCEL_ENROLMENT_MESSAGE")}
          </AdminTypo.H4>
        </Alert>
      )}
    </VStack>
  );
};

const ActiveButton = ({ isActive, children, ...props }) => {
  if (isActive) {
    return (
      <AdminTypo.PrimaryButton {...props}>{children}</AdminTypo.PrimaryButton>
    );
  }
  return (
    <AdminTypo.Secondarybutton {...props}>{children}</AdminTypo.Secondarybutton>
  );
};

SYCVerification.PropTypes = {
  footerLinks: PropTypes.any,
};

const CheckButton = ({ icons, ...props }) => {
  console.log("hello");
  return (
    <CustomRadio
      options={{
        enumOptions: [{ value: "no" }, { value: "yes" }],
      }}
      schema={{
        icons,
        _box: {
          flex: "1",
          gap: "20px",
          alignItems: "center",
          padding: "10px",
          width: "100%",
        },
        _hstack: { space: "4" },
        _subHstack: {
          justifyContent: "space-between",
        },
        _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
      }}
      {...props}
    />
  );
};
