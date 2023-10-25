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
import { HStack, Stack, VStack, Modal, Alert, Pressable } from "native-base";
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

  const { id } = useParams();

  const getConsentDetailsWithParams = async (campId, facilitatorId) => {
    const requestBody = {
      camp_id: campId,
      facilitator_id: facilitatorId,
    };

    try {
      const response = await campService.getCampAdminConsent(requestBody);
      setConsentData(response?.data);
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
          >
            {data?.id}
          </AdminTypo.H1>
        </HStack>

        <HStack flexWrap="wrap" justifyContent={"space-between"}>
          <VStack flex="1">
            <HStack py="4">
              <CampChipStatus status={data?.group?.status} />
            </HStack>
            <HStack>
              {data?.faciltator?.length > 0 &&
                data?.faciltator.map((facilitator) => {
                  return (
                    <HStack
                      rounded={"md"}
                      p="2"
                      alignItems="center"
                      space="2"
                      key={facilitator?.id}
                    >
                      <ImageView
                        urlObject={facilitator?.profile_photo_1 || {}}
                        size="lg"
                      />
                      <VStack>
                        <AdminTypo.H3 color="textGreyColor.600">
                          {[facilitator?.first_name, facilitator?.last_name]
                            .filter((e) => e)
                            .join(" ")}
                        </AdminTypo.H3>
                        <AdminTypo.H4 color="textGreyColor.600">
                          {facilitator?.mobile}
                        </AdminTypo.H4>

                        <AdminTypo.H5>
                          {[
                            facilitator?.state,
                            facilitator?.district,
                            facilitator?.block,
                            facilitator?.village,
                            facilitator?.grampanchayat,
                          ]
                            .filter((e) => e)
                            .join(", ")}
                        </AdminTypo.H5>
                      </VStack>
                    </HStack>
                  );
                })}
            </HStack>
          </VStack>
          <HStack space={3} flex="3" ml={"70px"}>
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
            <Stack>
              <MapComponent
                latitude={data?.properties?.lat}
                longitude={data?.properties?.long}
              />
            </Stack>
          </HStack>
        </HStack>
        <HStack space={4}>
          <CardComponent
            title={t("CAMP_LOCATION_ADDRESS")}
            _vstack={{ bg: "light.100", space: 2, flex: 1 }}
          >
            {[
              data?.properties?.state,
              data?.properties?.district,
              data?.properties?.block,
              data?.properties?.village,
              data?.properties?.grampanchayat,
            ]
              .filter((e) => e)
              .join(", ")}
          </CardComponent>
          <CardComponent
            isHideProgressBar={true}
            _vstack={{ bg: "light.100", space: 0, flex: 3 }}
            title={t("INACTIVE_GOVERNMENT_PRIVATE_SCHOOL")}
            label={["PROPERTY_TYPE"]}
            item={data?.properties}
            arr={["property_type"]}
          ></CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent
            _vstack={{ bg: "light.100", flex: 1, space: 4 }}
            title={t("LEARNER_DETAILS_FAMILY_CONSENT_LETTERS")}
          >
            {data?.beneficiaries?.length > 0 &&
              data?.beneficiaries.map((learner, index) => {
                let learnerConsentData = Array.isArray(consentData)
                  ? consentData.find((e) => e.user_id === learner.id)
                  : {};

                const consentUrlObject = learnerConsentData?.document || {};
                return (
                  <VStack
                    key={learner}
                    title={
                      <AdminTypo.H6
                        bold
                      >{`${learner?.first_name} ${learner?.last_name}`}</AdminTypo.H6>
                    }
                    subTitle={
                      learner?.district &&
                      learner?.block &&
                      learner?.village ? (
                        <AdminTypo.H6>{`${learner.district} ${learner.block}${learner.village}`}</AdminTypo.H6>
                      ) : (
                        ""
                      )
                    }
                    image={
                      learner?.profile_photo_1?.id
                        ? { document_id: learner?.profile_photo_1?.id }
                        : null
                    }
                    rightElement={
                      <HStack>
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
                          text={
                            <HStack space={"2"}>
                              {t("LINK")}
                              <IconByName
                                name="ExternalLinkLineIcon"
                                isDisabled
                              />
                            </HStack>
                          }
                        />
                      </HStack>
                    }
                  />
                );
              })}
          </CardComponent>

          <CardComponent
            _vstack={{ bg: "light.100", flex: 3 }}
            title={t("PROPERTY_AND_FACILITY_DETAILS")}
          >
            <CardComponent
              isHideProgressBar={true}
              _vstack={{ space: 0, flex: 3 }}
              title={t("KIT_DETAILS")}
              label={[
                "GOT_THE_KIT",
                "IS_THE_KIT_USEFUL",
                "SUGGESTIONS_FOR_THE_KIT",
                "THE_QUALITY_OF_THE_KIT",
              ]}
              item={{
                ...data,
                kit_ratings: (
                  <StarRating
                    value={data.kit_ratings}
                    schema={{ totalStars: 5 }}
                  />
                ),
              }}
              arr={[
                "kit_received",
                "kit_was_sufficient",
                "kit_ratings",
                "kit_feedback",
              ]}
            />

            <CardComponent
              title={t(
                "THE_FOLLOWING_FACILITIES_ARE_AVAILABLE_AT_THE_CAMP_SITE"
              )}
            >
              {facilities.map((item) => (
                <CheckUncheck
                  key={item?.title}
                  schema={{ label: t(item?.title) }}
                  value={propertyFacilities?.[item?.value] || ""}
                />
              ))}
            </CardComponent>
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
                updateCampStatus();
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
