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
  jsonToQueryString,
  CustomRadio,
} from "@shiksha/common-lib";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { HStack, VStack, Stack, Modal, Alert } from "native-base";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";

const checkboxIcons = [
  { name: "CheckboxCircleLineIcon", activeColor: "success.500" },
  { name: "CloseCircleLineIcon", activeColor: "red.500" },
];

export default function EnrollmentReceiptView({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const filter = jsonToQueryString(location?.state);
  const { id } = useParams();
  const [data, setData] = React.useState();
  const [subjects, setSubjects] = React.useState();
  const [reason, setReason] = React.useState({});
  const [error, setError] = React.useState({});
  const [receiptUrl, setReceiptUrl] = React.useState();
  const [fileType, setFileType] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const profileDetails = React.useCallback(async () => {
    const { result } = await benificiaryRegistoryService.getOne(id);
    setData(result);
    const { data: newData } = await enumRegistryService.getSubjects({
      board: result?.program_beneficiaries?.enrolled_for_board,
    });

    const newResult = await uploadRegistryService.getOne({
      document_id: result?.program_beneficiaries?.payment_receipt_document_id,
    });
    setReceiptUrl(newResult);
    setFileType(newResult?.key?.split(".").pop());
    const subject = jsonParse(result?.program_beneficiaries.subjects, []);
    setSubjects(newData?.filter((e) => subject?.includes(`${e.id}`)));
    setLoading(false);
  }, [id]);

  React.useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  const checkValidation = React.useCallback(() => {
    let data = {};
    ["learner_enrollment_details", "enrollment_details"]
      .filter((e) => !reason[e])
      .map((e) => (data = { ...data, [e]: t("PLEASE_SELECT") }));
    setError(data);
    return !Object.keys(data).length;
  }, [reason, t]);

  const submit = React.useCallback(
    async (status) => {
      setIsButtonLoading(true);
      if (checkValidation()) {
        const data = await benificiaryRegistoryService.verifyEnrollment({
          user_id: id,
          enrollment_verification_status: status,
          enrollment_verification_reason: reason,
        });

        if (data?.success) {
          setOpenModal(false);

          navigate({
            pathname: "/admin/learners/enrollmentVerificationList",
            search: `?${createSearchParams(filter)}`,
          });
        }
      }
    },
    [checkValidation, createSearchParams, filter, id, navigate, reason]
  );

  return (
    <Layout _sidebar={footerLinks} loading={loading}>
      <VStack space={"5"} p="6">
        <HStack space={"2"} justifyContent="space-between">
          <Breadcrumb
            drawer={
              <IconByName
                size="sm"
                name="ArrowRightSLineIcon"
                onPress={(e) =>
                  navigate("/admin/learners/enrollmentVerificationList")
                }
              />
            }
            data={[
              <AdminTypo.H4 key="1">
                {t("ENROLLMENT_VERIFICATION")}
              </AdminTypo.H4>,
              <AdminTypo.H4 key="2">{`${data?.first_name} ${
                data?.last_name ? data?.last_name : " "
              }`}</AdminTypo.H4>,
              <AdminTypo.H4 key="3" bold>{`${data?.id}`}</AdminTypo.H4>,
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
            <AdminTypo.H5 color="textGreyColor.800" bold>
              {t("ENROLLMENT_DETAILS_VERIFICATION")}
            </AdminTypo.H5>

            <HStack space="2">
              <VStack flex="2" pb="1" space={4}>
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
                <AdminTypo.PrimaryButton
                  onPress={() => {
                    navigate(`/admin/beneficiary/${data?.id}`);
                  }}
                >
                  {t("LEARNER_PROFILE")}
                </AdminTypo.PrimaryButton>

                <ValidationBox error={error?.enrollment_details}>
                  <VStack space={4}>
                    <HStack alignItems="center" space="8">
                      {data?.profile_photo_1?.name ||
                      data?.profile_photo_2?.name ||
                      data?.profile_photo_3?.name ? (
                        [
                          data?.profile_photo_1,
                          data?.profile_photo_2,
                          data?.profile_photo_3,
                        ].map(
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
                            )
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

                    <HStack space={4} alignItems="center">
                      <CustomRadio
                        options={{
                          enumOptions: [{ value: "yes" }, { value: "no" }],
                        }}
                        schema={{
                          grid: 1,
                          icons: checkboxIcons,
                          _box: { flex: "1", gap: "2" },
                          _hstack: { space: "6" },
                          _pressable: {
                            p: 0,
                            mb: 0,
                            borderWidth: 0,
                            style: {},
                          },
                        }}
                        value={reason?.enrollment_details}
                        onChange={(e) => {
                          setReason({ ...reason, enrollment_details: e });
                        }}
                      />
                      <VStack flex={4}>
                        <TextInfo
                          _box={{ space: "2" }}
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
                                    ?.enrollment_middle_name &&
                                    " " +
                                      data?.program_beneficiaries
                                        ?.enrollment_middle_name}
                                  {data?.program_beneficiaries
                                    ?.enrollment_last_name &&
                                    " " +
                                      data?.program_beneficiaries
                                        ?.enrollment_last_name}
                                </AdminTypo.H5>
                              ),
                            },
                            {
                              label: "DOB",
                              value: (
                                <AdminTypo.H5>
                                  {data?.program_beneficiaries?.enrollment_dob
                                    ? moment(
                                        data?.program_beneficiaries
                                          ?.enrollment_dob
                                      ).format("DD-MM-YYYY")
                                    : "-"}
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
                    </HStack>
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
                      _hstack: { space: "4" },
                      _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
                    }}
                    value={reason?.learner_enrollment_details}
                    onChange={(e) => {
                      setReason({ ...reason, learner_enrollment_details: e });
                    }}
                  />
                  <VStack flex={4}>
                    <TextInfo
                      _box={{ space: "2" }}
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
                              {data?.program_beneficiaries?.enrollment_date
                                ? moment(
                                    data?.program_beneficiaries?.enrollment_date
                                  ).format("DD-MM-YYYY")
                                : "-"}
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
            <HStack space="4">
              <AdminTypo.Successbutton
                isDisabled={
                  isButtonLoading ||
                  reason?.enrollment_details === "no" ||
                  reason?.learner_enrollment_details === "no"
                }
                onPress={(e) => submit("verified")}
              >
                {t("FACILITATOR_STATUS_VERIFY")}
              </AdminTypo.Successbutton>
              {/* <AdminTypo.Dangerbutton
                mx={5}
                isDisabled={
                  reason?.enrollment_details === "yes" &&
                  reason?.learner_enrollment_details === "yes"
                }
                onPress={(e) => {
                  if (checkValidation()) {
                    setOpenModal("pending");
                  }
                }}
              >
                {t("FACILITATOR_STATUS_CANCEL_ENROLMENT")}
              </AdminTypo.Dangerbutton> */}
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
  if (data?.program_beneficiaries?.status !== "enrolled") {
    return (
      <Alert status="warning" alignItems={"start"} mb="3" mt="4">
        <HStack alignItems="center" space="2" color>
          <Alert.Icon />
          <AdminTypo.H1>{t("PAGE_NOT_ACCESSABLE")}</AdminTypo.H1>
        </HStack>
      </Alert>
    );
  } else if (
    data?.program_beneficiaries?.enrollment_status === "not_enrolled"
  ) {
    return (
      <Alert status="warning" alignItems={"start"} mb="3" mt="4">
        <HStack alignItems="center" space="2" color>
          <Alert.Icon />
          <AdminTypo.H1>
            {t("FACILITATOR_STATUS_CANCEL_ENROLMENT")}
          </AdminTypo.H1>
        </HStack>
      </Alert>
    );
  } else if (data?.is_duplicate === "yes" && data?.is_deactivated === null) {
    return (
      <Alert status="warning" alignItems={"start"} mb="3" mt="4">
        <HStack alignItems="center" space="2" color>
          <Alert.Icon />
          <AdminTypo.H1>{t("RESOLVE_DUPLICATION")}</AdminTypo.H1>
        </HStack>
      </Alert>
    );
  } else {
    return children;
  }
};

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

const Message = ({ status, reason }) => {
  const { t } = useTranslation();
  if (status === "pending") {
    return <React.Fragment />;
  } else if (
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
  return <React.Fragment />;
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
