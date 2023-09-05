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
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const { t } = useTranslation();
  const [facilitator, setfacilitator] = React.useState();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id: fa_id });
    setfacilitator(result);
  }, []);

  return (
    <Layout
      _appBar={{ name: t("CAMP_REGISTER") }}
      _footer={{ menues: footerLinks }}
    >
      <NavigationBox IconName={"MapPinLineIcon"} NavName={"CAMP_LOCATION"} />
      <NavigationBox IconName={"FileTextLineIcon"} NavName={"CAMP_LOCATION"} />
      <NavigationBox IconName={"StarLineIcon"} NavName={"CAMP_LOCATION"} />
      <NavigationBox IconName={"StarLineIcon"} NavName={"CAMP_LOCATION"} />
      <NavigationBox IconName={"StarLineIcon"} NavName={"CAMP_LOCATION"} />
    </Layout>
  );
}

const NavigationBox = ({ IconName, NavName }) => {
  const { t } = useTranslation();

  return (
    <HStack w={"90%"} marginTop={2} margin={"auto"}>
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
        w={"90%"}
        paddingX={10}
        paddingY={3}
        ml={2}
      >
        <HStack justifyContent={"space-between"}>
          <HStack alignItems={"center"} justifyContent={"space-evenly"}>
            <IconByName
              isDisabled
              name={IconName}
              //color="amber.400"
              _icon={{ size: "30px" }}
            />
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
      </Box>
    </HStack>
  );
};
