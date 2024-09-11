import React, { useCallback, useEffect, useState } from "react";
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
  CustomRadio,
  Loading,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
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
      px: "0",
      py: "0",
      _icon: { size: "25", activeColor: "#d53546", color: "#484848" },
    },
    {
      name: "CheckboxCircleLineIcon",
      activeName: "CheckboxCircleFillIcon",
      activeColor: "#038400",
      px: "0",
      py: "0",
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
    const { result } = await benificiaryRegistoryService.getOne(id);
    const value = result?.program_beneficiaries?.enrolled_for_board;
    setData(result);
    const { subjects } = await enumRegistryService.subjectsList(value);
    const boardName = await enumRegistryService.boardName(value);
    setBoardName(boardName?.name);
    await handleSetReceiptUrl(
      result?.program_beneficiaries?.exam_fee_document_id,
    );
    const subject = jsonParse(result?.program_beneficiaries.syc_subjects, []);
    setSubjects(subjects?.filter((e) => subject?.includes(`${e.subject_id}`)));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  const checkValidation = useCallback(() => {
    let data = {};
    ["exam_fee_date", "syc_subjects"]
      .filter((e) => !reason[e])
      .map((e) => (data = { ...data, [e]: t("PLEASE_SELECT") }));
    setError(data);
    return !Object.keys(data).length;
  }, [reason, t]);

  const submit = useCallback(
    async (status) => {
      if (!checkValidation()) return;
      const response = await benificiaryRegistoryService.verifySYC({
        user_id: id,
        psyc_status: status,
        syc_reason: Object.keys(reason).filter((key) => reason[key] === "no"),
      });
      if (response?.success) {
        setOpenModal(false);
        navigate("/admin/learners/enrollmentVerificationList/SYC");
      }
    },
    [checkValidation, setOpenModal, id, navigate, reason],
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
                          value: (
                            <AdminTypo.H5>{data?.mobile || "-"}</AdminTypo.H5>
                          ),
                        },
                      ],
                    },
                    {
                      _validation: {
                        error: error?.exam_fee_date,
                        icons: checkboxIcons(reason?.exam_fee_date),
                        value: reason?.exam_fee_date,
                        onChange: (e) => {
                          setReason({ ...reason, exam_fee_date: e });
                        },
                      },
                      data: data?.program_beneficiaries,
                      arr: [
                        {
                          label: "DATE",
                          value: (
                            <AdminTypo.H5>
                              {data?.program_beneficiaries?.exam_fee_date
                                ? moment(
                                    data?.program_beneficiaries?.exam_fee_date,
                                  ).format("DD-MM-YYYY")
                                : "-"}
                            </AdminTypo.H5>
                          ),
                        },
                      ],
                    },
                    {
                      _validation: {
                        error: error?.syc_subjects,
                        icons: checkboxIcons(reason?.syc_subjects),
                        value: reason?.syc_subjects,
                        onChange: (e) => {
                          setReason({ ...reason, syc_subjects: e });
                        },
                      },
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
                  reason?.exam_fee_date === "no" ||
                  reason?.syc_subjects === "no"
                }
                onPress={(e) => submit("psyc_verified")}
              >
                {t("VERIFY")}
              </AdminTypo.Successbutton>
              <AdminTypo.Secondarybutton
                isLoading={isButtonLoading}
                isDisabled={
                  reason?.exam_fee_date === "yes" &&
                  reason?.syc_subjects === "yes"
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
            <Modal isOpen={openModal} size="xl">
              <Modal.Content>
                <Modal.Header>{t("CONFIRM")}</Modal.Header>
                <Modal.Body p="5">
                  <AdminTypo.H1>{t("ARE_YOU_SURE")}</AdminTypo.H1>
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

const TextInfo = ({ data, _box, _vstack, arr }) => {
  const { t } = useTranslation();
  return (
    <VStack
      space={4}
      divider={
        <div
          style={{
            borderBottomWidth: "1px",
            borderBottomColor: "lightGray",
            borderBottomStyle: "solid",
          }}
        />
      }
      {..._vstack}
    >
      {arr.map((e) => (
        <HStack
          key={e.label}
          py="2"
          alignItems="center"
          flex={1}
          space="2"
          {..._box}
          maxWidth="100%" // Ensure HStack does not exceed the container width
        >
          <AdminTypo.H4
            flex={1}
            color="light.400"
            fontWeight="bold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t(e?.label || "-")}
          </AdminTypo.H4>
          {e?.value ? (
            <VStack flex={1} space="2" width="100%">
              {e.value}
            </VStack>
          ) : (
            <VStack flex="1" width="100%" space="2">
              <AdminTypo.H5>{data?.[e?.keyArr] || "-"}</AdminTypo.H5>
            </VStack>
          )}
        </HStack>
      ))}
    </VStack>
  );
};

const ValidationBox = ({ data, _vstack }) => (
  <VStack space={4} {..._vstack}>
    {data?.map((item) => (
      <VStack key={item?.item}>
        <VStack
          space="4"
          rounded="xl"
          borderWidth="1px"
          borderColor={item?._validation?.error ? "red.200" : "light.400"}
          p={"2"}
          divider={
            <div
              style={{
                borderBottomWidth: "1px",
                borderBottomColor: "lightGray",
                borderBottomStyle: "solid",
              }}
            />
          }
        >
          <TextInfo {...item} />
          {item?._validation && <CheckButton {...item?._validation} />}
        </VStack>
        {item?._validation?.error && (
          <AdminTypo.H5 color="red.500">
            {item?._validation?.error}
          </AdminTypo.H5>
        )}
      </VStack>
    ))}
  </VStack>
);

SYCVerification.PropTypes = {
  footerLinks: PropTypes.any,
};

const CheckButton = ({ icons, ...props }) => {
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
        _icon: { borderWidth: "0", style: {} },
      }}
      {...props}
    />
  );
};

CheckButton.PropTypes = {
  icons: PropTypes.array,
  props: PropTypes.any,
};
