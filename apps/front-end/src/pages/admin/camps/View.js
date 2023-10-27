import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  campService,
  CardComponent,
  UserCard,
  MapComponent,
  CheckUncheck,
  enumRegistryService,
  jsonParse,
  ImageView,
  BodyMedium,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Stack, VStack, Modal, Alert } from "native-base";
import { useTranslation } from "react-i18next";
import { CampChipStatus } from "component/Chip";
import { StarRating } from "component/BaseInput";

export default function View({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setDataa] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [propertyFacilities, setPropertyFacilities] = React.useState({});
  const [properties, setProperties] = React.useState([]);
  const [enumOptions, setEnumOptions] = React.useState();
  const [consentData, setConsentData] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  const [errorList, setErrorList] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [edit, setEdit] = React.useState(false);

  const { id } = useParams();

  const getConsentDetailsWithParams = async (campId, facilitatorId) => {
    try {
      const campConsent = await campService.getCampAdminConsent({
        camp_id: id,
      });
      setConsentData(campConsent?.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(async () => {
    setLoading(true);
    try {
      const result = await campService.getFacilatorAdminCampList({ id });
      const camp = result?.data?.camp;
      setDataa(camp);
      setEdit(data?.group?.status === "change_required");
      setPropertyFacilities(jsonParse(camp?.properties?.property_facilities));
      setProperties(camp?.properties);
      let properData = camp?.properties;
      setProperties(properData);
      const campId = camp?.id;
      const facilitatorId = camp?.faciltator[0]?.id;
      getConsentDetailsWithParams(campId, facilitatorId);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  }, []);

  const updateCampStatus = async () => {
    const { error, ...result } = await campService.updateCampStatus({
      id,
      facilitator_id: data?.faciltator?.[0]?.id,
      status,
    });

    if (result?.status === 200) {
      navigate("/admin/camps?status=registered&page=1");
    } else {
      setErrorList(result?.message);
      setStatus();
    }
  };

  React.useEffect(async () => {
    setLoading(true);
    const qData = await enumRegistryService.listOfEnum();
    const data = qData?.data?.CAMP_PROPERTY_FACILITIES;
    setEnumOptions(qData?.data);
    setFacilities(data);
    setLoading(false);
  }, []);

  const navTOedit = (item) => {
    const send = () => {
      navigate(`/admin/camps/${id}/${item}`);
    };
    return send;
  };

  return (
    <Layout _sidebar={footerLinks} loading={loading}>
      <VStack flex={1} space={"5"} p="3" mb="5">
        {errorList && (
          <Alert
            status="warning"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              {errorList?.constructor?.name === "String" ? (
                <HStack space={2} alignItems={"center"}>
                  <Alert.Icon />
                  <AdminTypo.H6>{t(errorList)}</AdminTypo.H6>
                </HStack>
              ) : (
                errorList?.constructor?.name === "Array" && (
                  <VStack space={2}>
                    {errorList?.map((item) => (
                      <HStack key={item} space={2} alignItems={"center"}>
                        <Alert.Icon />
                        <AdminTypo.H6 key={item}>{t(item)}</AdminTypo.H6>
                      </HStack>
                    ))}
                  </VStack>
                )
              )}
            </HStack>
          </Alert>
        )}
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("ALL_CAMPS")}
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
            enumOptions
          >
            {data?.id}
          </AdminTypo.H1>
        </HStack>

        <HStack flexWrap="wrap">
          <VStack>
            <HStack py="4">
              <CampChipStatus status={data?.group?.status} />
            </HStack>
            <HStack>
              {data?.faciltator?.length > 0 &&
                data?.faciltator.map((facilitator) => {
                  return (
                    <UserCard
                      key={facilitator}
                      _hstack={{ p: 0, borderWidth: 0, space: 1, flex: 0.8 }}
                      _vstack={{ py: 0 }}
                      _image={{ size: 100 }}
                      title={
                        <VStack>
                          <AdminTypo.H6 color="textGreyColor.600">
                            {[facilitator?.first_name, facilitator?.last_name]
                              .filter((e) => e)
                              .join(" ")}
                          </AdminTypo.H6>
                          <AdminTypo.H4 color="textGreyColor.600">
                            {facilitator?.mobile}
                          </AdminTypo.H4>
                        </VStack>
                      }
                      subTitle={[
                        facilitator?.state,
                        facilitator?.district,
                        facilitator?.block,
                        facilitator?.village,
                        facilitator?.grampanchayat,
                      ]
                        .filter((e) => e)
                        .join(", ")}
                      image={
                        facilitator?.profile_photo_1?.fileUrl
                          ? { urlObject: facilitator?.profile_photo_1 }
                          : null
                      }
                    />
                  );
                })}
            </HStack>
          </VStack>
          {[
            properties?.photo_other,
            properties.photo_building,
            properties?.photo_classroom,
          ].map(
            (item) =>
              item && (
                <HStack key={item}>
                  <ImageView
                    isImageTag={!item}
                    urlObject={item || {}}
                    _button={{ p: 0 }}
                    text={
                      <ImageView
                        isImageTag
                        urlObject={item || {}}
                        width="260px"
                        height="250px"
                        m={"10px"}
                        p={"2"}
                        border="2px solid #eee"
                        borderRadius={"4"}
                        alignItems="left"
                      />
                    }
                  />
                </HStack>
              )
          )}
          <Stack flex="1">
            <MapComponent
              latitude={data?.properties?.lat}
              longitude={data?.properties?.long}
            />
          </Stack>
        </HStack>
        <HStack space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ bg: "light.100", space: 2, flex: 1 }}
            onEdit={edit && navTOedit("edit_camp_location")}
          >
            <VStack space={2} marginTop={"10px"}>
              {[
                data?.properties?.state,
                data?.properties?.district,
                data?.properties?.block,
                data?.properties?.village,
                data?.properties?.grampanchayat,
              ]
                .filter((e) => e)
                .join(", ")}
            </VStack>
          </CardComponent>
          <CardComponent
            isHideProgressBar={true}
            _header={{ bg: "light.100" }}
            _vstack={{ bg: "light.100", space: 2, flex: 3 }}
            title={t("INACTIVE_GOVERNMENT_PRIVATE_SCHOOL")}
            label={["PROPERTY_TYPE"]}
            item={data?.properties}
            arr={["property_type"]}
            onEdit={edit && navTOedit("edit_camp_location")}
          ></CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent
            _vstack={{
              bg: "light.100",
              flex: 2,
              space: 4,
            }}
            _header={{ bg: "light.100" }}
            title={t("LEARNER_DETAILS_FAMILY_CONSENT_LETTERS")}
            onEdit={edit && navTOedit("edit_family_consent")}
          >
            <VStack space={4} pt="4">
              {data?.beneficiaries?.length > 0 &&
                data?.beneficiaries.map((learner, index) => {
                  let learnerConsentData = Array.isArray(consentData)
                    ? consentData.find((e) => e.user_id === learner.id)
                    : {};

                  const consentUrlObject = learnerConsentData?.document || {};
                  return (
                    <CardComponent key={learner} _vstack={{}}>
                      <UserCard
                        _hstack={{ borderWidth: 0, p: 1 }}
                        key={learner}
                        title={
                          <AdminTypo.H6 bold>
                            {`${learner?.first_name} ${learner?.last_name}`}
                          </AdminTypo.H6>
                        }
                        subTitle={
                          <AdminTypo.H6>
                            {[
                              learner?.district,
                              learner?.block,
                              learner?.village,
                            ]
                              .filter((e) => e)
                              .join(" ")}
                          </AdminTypo.H6>
                        }
                        image={
                          learner?.profile_photo_1?.id
                            ? { urlObject: learner?.profile_photo_1 }
                            : null
                        }
                      />
                      <HStack alignItems={"center"}>
                        <ImageView
                          source={{
                            document_id:
                              consentUrlObject?.id !== null
                                ? consentUrlObject?.id
                                : {},
                          }}
                          isImageTag={!consentUrlObject}
                          // urlObject={consentUrlObject?.id || {}}
                          _button={{ p: 0 }}
                          text={<HStack space={"4"}>{t("VIEW")}</HStack>}
                        />

                        <HStack space={"4"}>{t("REASSIGN")}</HStack>
                      </HStack>
                    </CardComponent>
                  );
                })}
            </VStack>
          </CardComponent>

          <CardComponent
            _vstack={{ bg: "light.100", flex: 2 }}
            _header={{ bg: "light.100" }}
            title={t("PROPERTY_AND_FACILITY_DETAILS")}
          >
            <VStack space={4} pt="4">
              <HStack space={3} justifyContent={"space-between"}>
                <CardComponent
                  isHideProgressBar={true}
                  _vstack={{ space: 4, flex: 2 }}
                  _hstack={{ space: 2 }}
                  title={t("KIT_DETAILS")}
                  label={[
                    "GOT_THE_KIT",
                    "IS_THE_KIT_USEFUL",
                    "RATINGS_FOR_KIT",
                    "THE_QUALITY_OF_THE_KIT",
                  ]}
                  item={{
                    ...data,
                    kit_received:
                      data.kit_received === "yes" ? t("YES") : t("NO"),
                    kit_was_sufficient:
                      data.kit_was_sufficient === "yes" ? t("YES") : t("NO"),
                    kit_ratings: (
                      <StarRating
                        value={data.kit_ratings}
                        schema={{
                          totalStars: 5,
                          readOnly: true,
                          _hstack: { my: 0 },
                          _icon: { _icon: { size: "20" } },
                        }}
                      />
                    ),
                  }}
                  arr={[
                    "kit_received",
                    "kit_was_sufficient",
                    "kit_ratings",
                    "kit_feedback",
                  ]}
                  onEdit={edit && navTOedit("edit_kit_details")}
                />
              </HStack>
              <CardComponent
                title={t(
                  "THE_FOLLOWING_FACILITIES_ARE_AVAILABLE_AT_THE_CAMP_SITE"
                )}
                onEdit={edit && navTOedit("edit_property_facilities")}
              >
                <VStack space={1} pt="4">
                  {facilities.map((item) => (
                    <CheckUncheck
                      key={item?.title}
                      schema={{ label: t(item?.title) }}
                      value={propertyFacilities?.[item?.value] || ""}
                    />
                  ))}
                </VStack>
              </CardComponent>
            </VStack>
          </CardComponent>
        </HStack>
        <HStack space={10} justifyContent={"center"}>
          {data?.group?.status !== "camp_ip_verified" && (
            <>
              <AdminTypo.StatusButton
                status="success"
                onPress={() => setStatus("camp_ip_verified")}
              >
                {t("VERIFY")}
              </AdminTypo.StatusButton>
              <AdminTypo.Secondarybutton
                status="info"
                onPress={() => setStatus("change_required")}
              >
                {t("CHANGES_NEEDED")}
              </AdminTypo.Secondarybutton>
            </>
          )}

          {data?.group?.status === "camp_ip_verified" && (
            <AdminTypo.Secondarybutton
              onPress={() => {
                setEdit(true);
              }}
            >
              {t("MODIFY")}
            </AdminTypo.Secondarybutton>
          )}

          <Modal isOpen={status} onClose={() => setStatus()} size="lg">
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>{t("WELCOME_AT_CAMP")}</Modal.Header>
              {status === "camp_ip_verified" ? (
                <Modal.Body>
                  <Alert status="success" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <BodyMedium>{t("VERIFY_MESSAGE")}</BodyMedium>
                    </HStack>
                  </Alert>
                </Modal.Body>
              ) : (
                <Modal.Body>
                  {/* <FrontEndTypo.H2 bold color="textGreyColor.550">
                    {t("CHANGES_REQUIRED")}
                  </FrontEndTypo.H2> */}
                  <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <BodyMedium> {t("CHANGES_REQUIRED")}</BodyMedium>
                    </HStack>
                  </Alert>
                </Modal.Body>
              )}
              <Modal.Footer>
                <HStack justifyContent="space-between" width="100%">
                  <AdminTypo.PrimaryButton
                    onPress={() => {
                      setStatus(false);
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.PrimaryButton>

                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      updateCampStatus();
                    }}
                  >
                    {t("CONFIRM")}
                  </AdminTypo.Secondarybutton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </HStack>
      </VStack>
    </Layout>
  );
}
