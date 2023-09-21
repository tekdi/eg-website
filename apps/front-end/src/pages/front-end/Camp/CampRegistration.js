import {
  FrontEndTypo,
  IconByName,
  Layout,
  campRegistoryService,
} from "@shiksha/common-lib";
import { HStack, Box, Pressable, Text, Image } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampRegistration({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const camp_id = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(async () => {
    setLoading(true);
    const result = await campRegistoryService.getCampDetails(camp_id);
    console.log("result", result);
    setLoading(false);
  }, []);

  const Navdata = [
    {
      Icon: "GraduationCap",
      Name: "ADD_AN_AG_LEARNER",
    },
    {
      Icon: "MapPinLineIcon",
      Name: "CAMP_LOCATION",
    },
    {
      Icon: "CameraLineIcon",
      Name: "CAMP_VENUE_PHOTOS",
    },
    {
      Icon: "StarLineIcon",
      Name: "FACILITIES",
    },
    {
      Icon: "MapPinLineIcon",
      Name: "KIT",
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
      {/* <VStack w={"90%"} marginTop={2} margin={"auto"}>
        <AdminTypo.H3 textAlign={"center"} color={"textMaroonColor.400"}>
          {t("VERIFIED_LEARNERS_IN_THIS_CAMP")}
        </AdminTypo.H3>
        {Example()}
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            textAlign: "center",
            margin: "0 auto",
            width: "auto",
          }}
          to={"/camp/camplist"}
        >
          <Text>{t("VIEW_ALL")} </Text>
          <IconByName
            isDisabled
            name={"ArrowRightSLineIcon"}
            //color="amber.400"
            _icon={{ size: "30px" }}
          />
        </Link>
      </VStack> */}

      {Navdata.map((item) => {
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
