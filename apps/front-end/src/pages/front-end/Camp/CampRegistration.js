import {
  FrontEndTypo,
  IconByName,
  Layout,
  campRegistoryService,
  arrList,
} from "@shiksha/common-lib";
import { HStack, Box, Pressable, Text, Image } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const getColor = (obj, arr) => {
  const result = arrList(obj, arr);
  let color = "gray.300";
  if (result === 100) {
    color = "green.300";
  } else if (result > 33) {
    color = "warning.300";
  }
  return color;
};

export default function CampRegistration({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const camp_id = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);
  const [campLocation, setCampLocation] = React.useState();
  const [campVenue, setCampVenue] = React.useState();

  React.useEffect(async () => {
    setLoading(true);
    const result = await campRegistoryService.getCampDetails(camp_id);
    console.log("result", result?.data?.properties);
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

    setLoading(false);
  }, []);

  const Navdata = [
    {
      Icon: "MapPinLineIcon",
      Name: "CAMP_LOCATION",
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
      Icon: "StarLineIcon",
      Name: "FACILITIES",
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
      Icon: "MapPinLineIcon",
      Name: "KIT",
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
      Icon: "CheckboxLineIcon",
      Name: "FAMILY_CONSENT",
    },
  ];

  const onPressBackButton = async () => {
    navigate("/camp");
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
    >
      <HStack w={"90%"} marginTop={3} marginBottom={2} margin={"auto"}>
        <Box
          bg="boxBackgroundColour.100"
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          shadow="AlertShadow"
          w={"95%"}
          paddingX={5}
          paddingY={3}
          ml={5}
        >
          <Pressable
            onPress={async () => {
              navigate(
                `/camp/campRegistration/${camp_id?.id}/edit/camp_selected_learners`
              );
            }}
          >
            <HStack justifyContent={"space-between"}>
              <HStack alignItems={"center"}>
                <IconByName
                  isDisabled
                  name={"GraduationCap"}
                  _icon={{ size: "30px" }}
                />

                <Text ml={5}>
                  {t("UPDATE_LEARNER")}
                  <Text color={"textMaroonColor.400"}>*</Text>
                </Text>
              </HStack>
              <IconByName
                isDisabled
                name="ArrowRightSLineIcon"
                _icon={{ size: "30px" }}
              />
            </HStack>
          </Pressable>
        </Box>
      </HStack>
      {Navdata.map((item) => {
        console.log("item", item);
        return (
          <NavigationBox
            key={item}
            camp_id={camp_id}
            IconName={item?.Icon}
            NavName={item?.Name}
          />
        );
      })}
      <HStack my={3} mx={"auto"} w={"90%"}>
        <FrontEndTypo.Primarybutton isDisabled width={"100%"}>
          {t("SUBMIT_FOR_REGISTRATION")}
        </FrontEndTypo.Primarybutton>
      </HStack>
    </Layout>
  );
}

const NavigationBox = ({ IconName, NavName, camp_id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navToForm = (NavName) => {
    const name = NavName.toLowerCase();
    navigate(`/camp/campRegistration/${camp_id?.id}/edit/${name}`);
  };

  return (
    <HStack w={"90%"} marginTop={3} marginBottom={2} margin={"auto"}>
      <HStack
        background={"amber.300"}
        borderTopLeftRadius={"20px"}
        borderBottomLeftRadius={"20px"}
        w={"10px"}
      ></HStack>
      <Box
        bg="boxBackgroundColour.100"
        borderColor="btnGray.100"
        borderRadius="10px"
        borderWidth="1px"
        shadow="AlertShadow"
        w={"95%"}
        paddingX={5}
        paddingY={3}
        ml={2}
      >
        <Pressable
          onPress={async () => {
            navToForm(NavName);
          }}
        >
          <HStack justifyContent={"space-between"}>
            <HStack alignItems={"center"}>
              {NavName === "KIT" ? (
                <Image
                  source={{
                    uri: "/boxline.svg",
                  }}
                  alt=""
                  size={"28px"}
                  resizeMode="contain"
                />
              ) : (
                <IconByName
                  isDisabled
                  name={IconName}
                  //color="amber.400"
                  _icon={{ size: "30px" }}
                />
              )}

              <Text ml={5}>
                {t(NavName)}
                <Text color={"textMaroonColor.400"}>*</Text>
              </Text>
            </HStack>
            <IconByName
              isDisabled
              name="ArrowRightSLineIcon"
              //color="amber.400"
              _icon={{ size: "30px" }}
            />
          </HStack>
        </Pressable>
      </Box>
    </HStack>
  );
};
