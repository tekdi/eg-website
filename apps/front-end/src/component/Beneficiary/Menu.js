import { FrontEndTypo, IconByName } from "@shiksha/common-lib";
import { Divider, HStack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function Menu({ menus }) {
  const { t } = useTranslation();
  return (
    <VStack
      shadow={"LearnerProfileViewShadow"}
      bg="boxBackgroundColour.100"
      borderColor="garyTitleCardBorder"
      borderRadius="5px"
      borderWidth="1px"
      px="4"
      p="2"
      pb="3"
      divider={
        <Divider orientation="horizontal" bg="btnGray.100" thickness="1" />
      }
    >
      {menus?.map((menu) => (
        <HStack
          key={menu}
          alignItems="center"
          justifyContent="space-between"
          p="2"
          pr="0"
        >
          <FrontEndTypo.H3 color="floatingLabelColor.500" fontWeight={"600"}>
            {t(menu?.title)}
          </FrontEndTypo.H3>

          <IconByName
            name="ArrowRightSLineIcon"
            onPress={menu?.onPress || (() => console.log("not onpress"))}
            color="floatingLabelColor.500"
            _icon={{ size: "20" }}
            {...(menu?._icon || {})}
          />
        </HStack>
      ))}
    </VStack>
  );
}

Menu.PropTypes = {
  menus: PropTypes.array,
};
