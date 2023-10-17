import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  CampService,
  CardComponent,
  UserCard,
  MapComponent,
  CheckUncheck,
  enumRegistryService,
  jsonParse,
  ImageView,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

export default function View({ footerLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setDataa] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [propertyFacilities, setPropertyFacilities] = React.useState({});
  const [properties, setProperties] = React.useState([]);
  const [enumOptions, setEnumOptions] = React.useState();
  const [consentData, setConsentData] = React.useState([]);

  const { id } = useParams();

  const getConsentDetailsWithParams = async (campId, facilitatorId) => {
    const requestBody = {
      camp_id: campId,
      facilitator_id: facilitatorId,
    };

    try {
      const response = await CampService.getCampAdminConsent(requestBody);
      console.log("consen data", response?.data);
      setConsentData(response?.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await CampService.getFacilatorAdminCampList({ id });
        const camp = result?.data?.camp;
        console.log("camp_details", camp);
        setDataa(camp);
        setPropertyFacilities(jsonParse(camp?.properties?.property_facilities));
        setProperties(camp?.properties);
        console.log("campProperties", camp?.properties);

        const campId = camp?.id;
        const facilitatorId = camp?.faciltator[0]?.id;
        getConsentDetailsWithParams(campId, facilitatorId);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const data = qData?.data?.CAMP_PROPERTY_FACILITIES;
    setEnumOptions(qData?.data);
    setFacilities(data);
  }, []);

  return (
    <Layout _sidebar={footerLinks}>
      <VStack flex={1} space={"5"} p="3" mb="5">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("ALL_CAMPS")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/admin/campHome`)}
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
          <VStack>
            <HStack py="4">
              <Chip>
                {/* <GetEnumValue
              t={t}
              enumType={"PREVIOUS_SCHOOL_TYPE"}
              enumOptionValue={data?.group?.status}
              enumApiData={enumOptions}
            /> */}
                {data?.group?.status}
              </Chip>
            </HStack>
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
                    {console.log(
                      "facilator image view",
                      facilitator?.profile_photo_1
                    )}
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
          </VStack>

          <Stack marginLeft={20}>
            <MapComponent
              latitude={data?.properties?.lat}
              longitude={data?.properties?.long}
            />
            {/* {consentData.map((item) => (
              <CardComponent
                key={item?.title}
                schema={{ label: t(item?.title) }}
                value={data[item?.value] || ""}
              />
            ))} */}
          </Stack>
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
            label={["Property Type"]}
            item={data?.properties}
            arr={["property_type"]}
          ></CardComponent>
        </HStack>
        <HStack space={4}>
          <CardComponent
            _vstack={{ bg: "light.100", flex: 1 }}
            title={t("LEARNER_DETAILS_FAMILY_CONSENT_LETTERS")}
          >
            {/* {consentData} */}
            {data?.beneficiaries?.length > 0 ? (
              data?.beneficiaries.map((learner, index) => {
                let learnerConsentData = Array.isArray(consentData)
                  ? consentData.find((e) => e.user_id === learner.id)
                  : {};
                // console.log("learnerConsentData", learnerConsentData);

                const consentUrlObject = learnerConsentData?.document || {};
                // alert(JSON.stringify(consentUrlObject));
                return (
                  <UserCard
                    key={learner}
                    title={`${learner?.first_name} ${learner?.last_name}`}
                    subTitle={`${learner?.district} ${learner?.block}${learner?.village}`}
                    image={{ document_id: learner?.profile_photo_1?.id }}
                    rightElement={
                      <HStack>
                        <ImageView
                          source={{ document_id: consentUrlObject?.id || {} }}
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
              })
            ) : (
              <p>No data available</p>
            )}
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
                "Got the kit",
                "Is the kit successful",
                "Suggestions for the kit",
                "The quality of kit",
              ]}
              item={data?.camp}
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
                  value={propertyFacilities[item?.value] || ""}
                />
              ))}
            </CardComponent>
          </CardComponent>
        </HStack>
        <HStack space={10} justifyContent={"center"}>
          <AdminTypo.StatusButton status={"success"}>
            {t("VERIFY")}
          </AdminTypo.StatusButton>
          <AdminTypo.StatusButton status={"info"}>
            {t("CHANGES_NEEDED")}
          </AdminTypo.StatusButton>
        </HStack>
      </VStack>
    </Layout>
  );
}
