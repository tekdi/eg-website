import {
  HStack,
  VStack,
  Box,
  Divider,
  SmallCloseIcon,
  Stack,
  Progress,
  HamburgerIcon,
  ChevronRightIcon,
} from "native-base";
import React from "react";
import { FrontEndTypo, IconByName, t } from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const AgMenuBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <Stack>
      <HamburgerIcon onClick={toggleDrawer} />

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        size="300px"
      >
        <Stack>
          <Box>
            <VStack paddingTop="10px" paddingRight="5">
              <SmallCloseIcon
                size="sm"
                paddingLeft="258px"
                onClick={toggleDrawer}
              />

              <VStack alignItems="Center" display="flex">
                <IconByName
                  name="AccountCircleLineIcon"
                  color="textGreyColor.600"
                  _icon={{ size: "132" }}
                />
                <FrontEndTypo.H1 pt="15px" color="textMaroonColor.400">
                  Rachana Wagh
                </FrontEndTypo.H1>
                <ChipStatus status={"under_review"} />
              </VStack>
            </VStack>
          </Box>

          <Box pt="20px" gap="20px" pl="16px">
            <FrontEndTypo.H2 bold="16px">
              {t("COMPLETE_YOUR_PROFILE")}
            </FrontEndTypo.H2>
            <Box gap="14px">
              <HStack justifyContent="space-between">
                <Progress width="80%" colorScheme="info" value={80} size="sm" />
                <ChevronRightIcon mt="-8px" size="sm" />
              </HStack>
              <FrontEndTypo.H3 mt="-10px" width="268px">
                {t("COMPLETE_THIS_BEFORE_ORIENTATION")}
              </FrontEndTypo.H3>
            </Box>
            <Box gap="18px">
              <HStack alignItems="Center" justifyContent="space-between">
                <HStack alignItems="Center" space="sm">
                  <IconByName name="UserLineIcon" size="20px" />
                  <FrontEndTypo.H2 ml="19px">{t("MY_IP")}</FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon size="sm" />
              </HStack>
              <Divider
                orientation="horizontal"
                background="dividerColor"
                width="268px"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <HStack alignItems="Center" space="sm">
                  <IconByName mt="5px" size="20px" name="Chat4LineIcon" />
                  <FrontEndTypo.H2 ml="19px">{t("FAQS")}</FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon size="sm" />
              </HStack>
              <Divider
                orientation="horizontal"
                background="dividerColor"
                width="268px"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <HStack alignItems="Center" space="sm">
                  <IconByName name="PhoneLineIcon" size="20px" />
                  <FrontEndTypo.H2 ml="19px">
                    {t("CALL_SUPPORT")}
                  </FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon size="sm" />
              </HStack>
              <Divider
                orientation="horizontal"
                background="dividerColor"
                width="268px"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <HStack alignItems="Center" space="sm">
                  <IconByName name="GroupLineIcon" size="20px" />
                  <FrontEndTypo.H2 ml="19px">
                    {t("PRERAK_COMMUNITY")}
                  </FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon size="sm" />
              </HStack>
              <Divider
                orientation="horizontal"
                background="dividerColor"
                width="268px"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <HStack alignItems="Center" space="sm">
                  <IconByName name="Settings4LineIcon" size="20px" />
                  <FrontEndTypo.H2 ml="19px">{t("SETTINGS")}</FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon ml="52%" size="sm" />
              </HStack>
              <Divider
                orientation="horizontal"
                background="dividerColor"
                width="268px"
                thickness="1"
              />
            </Box>
          </Box>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default AgMenuBar;
