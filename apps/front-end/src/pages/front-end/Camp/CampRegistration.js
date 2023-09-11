import {
  AdminTypo,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  arrList,
  benificiaryRegistoryService,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Select,
  Pressable,
  Text,
  Progress,
  Center,
  Image,
  Avatar,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Example = () => {
  return (
    <Center my={3}>
      <Avatar.Group
        _avatar={{
          size: "lg",
        }}
        max={3}
      >
        <Avatar
          bg="green.500"
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          AJ
        </Avatar>
        <Avatar
          bg="cyan.500"
          source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TE
        </Avatar>
        <Avatar
          bg="indigo.500"
          source={{
            uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          JB
        </Avatar>
        <Avatar
          bg="amber.500"
          source={{
            uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TS
        </Avatar>
        <Avatar
          bg="green.500"
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          AJ
        </Avatar>
        <Avatar
          bg="cyan.500"
          source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TE
        </Avatar>
        <Avatar
          bg="indigo.500"
          source={{
            uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          JB
        </Avatar>
        <Avatar
          bg="amber.500"
          source={{
            uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TS
        </Avatar>
      </Avatar.Group>
    </Center>
  );
};

export default function CampRegistration({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const { t } = useTranslation();
  const [facilitator, setfacilitator] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id: fa_id });
    setfacilitator(result);
  }, []);

  const Navdata = [
    {
      Icon: "MapPinLineIcon",
      Name: "CAMP_LOCATION",
    },
    {
      Icon: "FileTextLineIcon",
      Name: "PROPERTY_DETAILS",
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
      Name: "PARENTS_AND_LEARNERS_CONSENT",
    },
    {
      Icon: "CameraLineIcon",
      Name: "PHOTOS",
    },
    {
      Icon: "FileTextLineIcon",
      Name: "PERMISSION_DOCUMENTS",
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
      <VStack w={"90%"} marginTop={2} margin={"auto"}>
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
      </VStack>

      {Navdata.map((item) => {
        return (
          <NavigationBox
            key={item}
            IconName={item?.Icon}
            NavName={item?.Name}
          />
        );
      })}
    </Layout>
  );
}

const NavigationBox = ({ IconName, NavName }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navToForm = (NavName) => {
    const name = NavName.toLowerCase();
    console.log("navName", name);
    navigate(`/camp/campRegistration/edit/${name}`);
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
