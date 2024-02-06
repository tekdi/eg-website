// PageFooter.jsx
import React, { useEffect, useState } from "react";
import { Box, Text, HStack, Center, VStack, useTheme } from "native-base";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getWindowSize } from "../../../utils/Helper/JSHelper";
import { IconByName } from "@shiksha/common-lib";

const PageFooter = ({ activeIndex, onTabPress }) => {
  const { t } = useTranslation();
  const [width] = getWindowSize();
  const { colors } = useTheme();

  const menus = [
    {
      title: "Home",
      route: "/footerTest",
      icon: "Home4LineIcon",
    },
    { title: "Learners", route: "/footerTestRoute1", icon: "GraduationCap" },
    {
      title: "Community",
      route: "/community-references",
      icon: "TeamLineIcon",
    },
    { title: "My Camps", route: "/camps", icon: "CommunityLineIcon" },
    { title: "Dashboards", route: "/table", icon: "DashboardLineIcon" },
  ];

  return (
    <Box width={width} flex={1} safeAreaTop position="fixed" bottom="0">
      <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
        {menus.map((item, index) => (
          <Link
            key={index}
            style={{ flex: 1, textDecoration: "none" }}
            to={item.route}
            onClick={() => onTabPress(index)}
          >
            <Center>
              <VStack alignItems="center">
                <Box
                  w="100%"
                  borderTopColor={
                    activeIndex === index ? "footer.boxBorder" : "white"
                  }
                  borderTopWidth={4}
                  roundedBottom="4px"
                />
                <VStack py="3" alignItems="center">
                  <IconByName
                    name={item?.icon}
                    isDisabled
                    _icon={{
                      size: "25px",
                      color:
                        activeIndex === index
                          ? colors?.["footer"]?.["boxBorder"]
                          : colors?.["textGreyColor"]?.["100"],
                    }}
                  />
                  <Text
                    fontSize="12"
                    color={
                      activeIndex === index
                        ? "footer.boxBorder"
                        : "textGreyColor.100"
                    }
                  >
                    {t(item.title)}
                  </Text>
                </VStack>
              </VStack>
            </Center>
          </Link>
        ))}
      </HStack>
    </Box>
  );
};

export default PageFooter;
