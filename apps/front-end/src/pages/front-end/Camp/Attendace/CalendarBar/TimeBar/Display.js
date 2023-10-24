// Lib
import * as React from "react";
import { Box, HStack, useToast } from "native-base";
import { IconByName, overrideColorTheme } from "@shiksha/common-lib";

const colors = overrideColorTheme();

// Display Helper
export const Display = ({
  children,
  activeColor,
  page,
  setPage,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
  _box,
}) => {
  const toast = useToast();
  return (
    <Box bg="white" p="1" {..._box}>
      <HStack justifyContent="space-between" alignItems="center" space={4}>
        <HStack space="4" alignItems="center">
          {
            // @ts-ignore
            <IconByName
              _icon={{ size: "24" }}
              p="0"
              color={
                typeof previousDisabled === "undefined" ||
                previousDisabled === false
                  ? activeColor || colors.primary
                  : // @ts-ignore
                    colors.grayInLight
              }
              name="ArrowLeftSLineIcon"
              onPress={(e) => {
                if (leftErrorText) {
                  toast.show(leftErrorText);
                } else if (
                  typeof previousDisabled === "undefined" ||
                  previousDisabled === false
                ) {
                  setPage(page - 1);
                }
              }}
            />
          }
        </HStack>
        <HStack space="4" alignItems="center">
          {children}
        </HStack>
        <HStack space="2">
          {
            // @ts-ignore
            <IconByName
              _icon={{ size: "24" }}
              p="0"
              color={
                typeof nextDisabled === "undefined" || nextDisabled === false
                  ? activeColor || colors.gray
                  : colors.grayIndark
              }
              name="ArrowRightSLineIcon"
              onPress={(e) => {
                if (rightErrorText) {
                  toast.show(rightErrorText);
                } else if (
                  typeof nextDisabled === "undefined" ||
                  nextDisabled === false
                ) {
                  setPage(page + 1);
                }
              }}
            />
          }
        </HStack>
      </HStack>
    </Box>
  );
};
