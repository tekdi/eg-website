import {
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  ConsentService,
  arrList,
  BodyMedium,
} from "@shiksha/common-lib";
import {
  HStack,
  Pressable,
  Image,
  Avatar,
  Alert,
  VStack,
  Progress,
  Box,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const getColor = (obj, arr) => {
  const result = arrList(obj, arr);
  let color = "gray.300";
  if (result === 100) {
    color = "green.300";
  } else if (result > 20) {
    color = "amber.300";
  }
  return color;
};

export default function CampRegistration({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const camp_id = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [campLocation, setCampLocation] = useState();
  const [campVenue, setCampVenue] = useState();
  const [campStatus, setCampStatus] = useState();
  const [facilities, setFacilities] = useState();
  const [kit, setKit] = useState();
  const [kitarr, setKitarr] = useState([]);
  const [consent, setConsent] = useState("amber.300");
  const [campDetails, setCampDetails] = useState();
  const [isDisable, setIsDisable] = useState(false);

  const navdata = [
    {
      Icon: "MapPinLineIcon",
      Name: "CAMP_LOCATION",
      step: "edit_camp_location",
      color: getColor(campLocation, [
        "lat",
        "long",
        "property_type",
        "state",
        "district",
        "block",
        "village",
        "grampanchayat",
      ]),
    },
    {
      Icon: "CameraLineIcon",
      Name: "CAMP_VENUE_PHOTOS",
      step: "edit_photo_details",
      color: getColor(campVenue, [
        "property_photo_building",
        "property_photo_classroom",
      ]),
    },
    {
      Icon: "StarLineIcon",
      Name: "FACILITIES",
      step: "edit_property_facilities",

      color: getColor(facilities, ["property_facilities"]),
    },
    {
      Icon: "MapPinLineIcon",
      Name: "KIT",
      step: "edit_kit_details",
      color: getColor(kit, kitarr),
    },
    {
      Icon: "CheckboxLineIcon",
      Name: "FAMILY_CONSENT",
      step: "edit_family_consent",
      color: consent,
    },
  ];

  useEffect(async () => {
    setLoading(true);
    const result = await campService.getCampDetails(camp_id);
    setCampDetails(result?.data);
    const campStatusNew = result?.data?.group?.status;
    setCampStatus(campStatusNew);
    const campConsent = await ConsentService.getConsent({
      camp_id: camp_id?.id,
    });
    const userLength = result?.data?.group_users?.length;
    const campConsentLength = campConsent?.data?.length;
    if (userLength <= campConsentLength) {
      setConsent("green.300");
    }
    const data = result?.data?.properties;
    setCampLocation({
      lat: data?.lat,
      long: data?.long,
      property_type: data?.property_type,
      state: data?.state,
      district: data?.district,
      block: data?.block,
      village: data?.village,
      grampanchayat: data?.grampanchayat,
    });
    setCampVenue({
      property_photo_building: data?.property_photo_building,
      property_photo_classroom: data?.property_photo_classroom,
      property_photo_other: data?.property_photo_other,
    });
    setFacilities({ property_facilities: data?.property_facilities });
    setKit({
      kit_feedback: result?.data?.kit_feedback,
      kit_ratings: result?.data?.kit_ratings,
      kit_was_sufficient: result?.data?.kit_was_sufficient,
      kit_received: result?.data?.kit_received,
    });
    setKitarr([
      "kit_received",
      "kit_was_sufficient",
      "kit_ratings",
      "kit_feedback",
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      ["registered", "inactive", "camp_ip_verified"].includes(campStatus) ||
      !["CAMP_VENUE_PHOTOS", "CAMP_LOCATION", "FACILITIES", "KIT"].every(
        (name) =>
          navdata.some(
            (item) => item.Name === name && item.color === "green.300"
          )
      )
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [campStatus, navdata]);

  const onPressBackButton = async () => {
    navigate("/camps");
  };

  const disableEdit = (extra = []) =>
    ["camp_ip_verified", ...extra].includes(campStatus) ? false : true;

  const SubmitCampRegistration = async () => {
    setIsDisable(true);
    const obj = {
      id: camp_id?.id,
      status: "registered",
      edit_page_type: "edit_camp_status",
    };
    const data = await campService.updateCampDetails(obj);
    if (data) {
      navigate("/camps");
    }
  };

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("CAMP_REGISTER"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
      analyticsPageTitle={"CAMP_REGISTRATION"}
      pageTitle={t("CAMP")}
      stepTitle={`${
        campDetails?.type === "main" ? t("MAIN_CAMPS") : t("PCR_CAMPS")
      }/${t("PROFILE")}`}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H1>{`${
          campDetails?.type === "main" ? t("MAIN_CAMPS") : t("PCR_CAMPS")
        } ${t("PROFILE")}`}</FrontEndTypo.H1>
        <VStack>
          <FrontEndTypo.H3 bold color={"textGreyColor.750"}>{`${t("CAMP_ID")}:${
            campDetails?.id
          }`}</FrontEndTypo.H3>
        </VStack>
        <VStack>
          <Progress
            value={arrList(
              {
                ...campDetails,
                location: [
                  campDetails?.properties?.district,
                  campDetails?.properties?.block,
                  campDetails?.properties?.grampanchayat,
                  campDetails?.properties?.village,
                  campDetails?.properties?.property_type,
                ],
                camp_photo: [
                  campDetails?.properties?.property_photo_building,
                  campDetails?.properties?.property_photo_classroom,
                  campDetails?.properties?.property_photo_other,
                ],
                facilities: [campDetails?.properties?.property_facilities],
              },
              ["location", "camp_photo", "facilities", "kit_received"]
            )}
            size="sm"
            colorScheme="warning"
          />
        </VStack>
        <VStack
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          shadow="AlertShadow"
          // space={2}
        >
          <Pressable
            bg="boxBackgroundColour.100"
            // shadow="AlertShadow"
            borderBottomColor={"garyTitleCardBorder"}
            borderBottomStyle={"solid"}
            borderBottomWidth={"2px"}
            onPress={async () => {
              disableEdit() &&
                navigate(`/camps/${camp_id?.id}/edit_camp_selected_learners`);
            }}
          >
            <HStack w={"100%"} py={3} px={2} justifyContent={"space-between"}>
              <HStack alignItems={"center"}>
                <FrontEndTypo.H3 color="floatingLabelColor.500" bold ml={5}>
                  {t("UPDATE_LEARNER")}
                </FrontEndTypo.H3>
              </HStack>
              {disableEdit() && (
                <IconByName
                  isDisabled
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "30px" }}
                  color="textBlack.500"
                />
              )}
            </HStack>
          </Pressable>

          {navdata.map((item) => {
            return (
              <NavigationBox
                key={item}
                camp_id={camp_id}
                // IconName={item?.Icon}
                NavName={item?.Name}
                step={item?.step}
                color={item?.color}
                disableEdit={disableEdit(["inactive"])}
              />
            );
          })}
          {campDetails?.kit_received === "yes" && (
            <Pressable
              bg="boxBackgroundColour.100"
              // shadow="AlertShadow"
              borderRadius="10px"
              onPress={async () => {
                navigate(`/camps/${camp_id?.id}/kit_material_details`);
              }}
            >
              <HStack w={"100%"} py={3} px={2} justifyContent={"space-between"}>
                <HStack alignItems={"center"}>
                  <FrontEndTypo.H3 bold color="floatingLabelColor.500" ml={5}>
                    {["registered", "inactive", "verified"].includes(campStatus)
                      ? t("UPDATE_CAMP_KIT_DETAILS")
                      : t("CAMP_KIT_MATERIAL_DETAILS")}
                  </FrontEndTypo.H3>
                </HStack>

                <IconByName
                  isDisabled
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "30px" }}
                  color="textBlack.500"
                />
              </HStack>
            </Pressable>
          )}
        </VStack>
        {campStatus === "registered" && (
          <Alert
            status="warning"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CAMP_APPROVAL_MSG")}</BodyMedium>
            </HStack>
          </Alert>
        )}
        <HStack my={3} mx={"auto"} w={"90%"}>
          <FrontEndTypo.Secondarybutton
            isDisabled={isDisable}
            width={"100%"}
            onPress={() => {
              SubmitCampRegistration();
            }}
          >
            {t("SUBMIT_FOR_REGISTRATION")}
          </FrontEndTypo.Secondarybutton>
        </HStack>
      </VStack>
    </Layout>
  );
}

const NavigationBox = ({
  IconName,
  NavName,
  camp_id,
  color,
  step,
  disableEdit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navToForm = (step) => {
    if (disableEdit) {
      navigate(`/camps/${camp_id?.id}/${step}`);
    }
  };

  return (
    <Pressable
      onPress={async () => {
        navToForm(step);
      }}
      bg="boxBackgroundColour.100"
      shadow="AlertShadow"
      borderLeftWidth={10}
      borderLeftColor={color}
      borderRadius="10px"
      borderBottomColor={"garyTitleCardBorder"}
      borderBottomStyle={"solid"}
      borderBottomWidth={"2px"}
    >
      <HStack w={"100%"} py={3} justifyContent={"space-between"}>
        <HStack alignItems={"center"}>
          <FrontEndTypo.H3 color="floatingLabelColor.500" bold ml={5}>
            {t(NavName)}
            {!["FAMILY_CONSENT"].includes(NavName) && (
              <FrontEndTypo.H3 color={"textMaroonColor.400"}>*</FrontEndTypo.H3>
            )}
          </FrontEndTypo.H3>
        </HStack>
        {disableEdit && (
          <IconByName
            isDisabled
            name="ArrowRightSLineIcon"
            //color="amber.400"
            _icon={{ size: "30px" }}
            color="textBlack.500"
          />
        )}
      </HStack>
    </Pressable>
  );
};
