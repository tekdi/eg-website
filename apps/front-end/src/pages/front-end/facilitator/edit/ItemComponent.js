import React from "react";
import { useState } from "react";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Center,
  Link,
} from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
} from "@shiksha/common-lib";

export default function ItemComponent({ arr, label, item, onEdit, onDelete }) {
  const { type } = item;
  return (
    <VStack
      px="5"
      py="4"
      mb="3"
      borderRadius="10px"
      borderWidth="1px"
      bg="white"
      borderColor="appliedColor"
    >
      <HStack justifyContent="space-between" alignItems="Center">
        <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
          {type === "vo_experience"
            ? t("VOLUNTEER_EXPERIENCE")
            : t("WORK_EXPERIENCE")}
        </FrontEndTypo.H3>
        <HStack alignItems="center">
          <IconByName
            name="EditBoxLineIcon"
            color="iconColor.100"
            onPress={(e) => onEdit(item)}
          />
          <IconByName
            color="textMaroonColor.400"
            name="DeleteBinLineIcon"
            onPress={(e) => onDelete(item)}
          />
        </HStack>
      </HStack>
      <Box paddingTop="2">
        <Progress value={arrList(item, arr)} size="xs" colorScheme="info" />
      </Box>
      <VStack space="2" paddingTop="5">
        {arr?.map((key, index) => (
          <HStack
            key={key}
            alignItems="Center"
            justifyContent="space-between"
            borderBottomWidth="1px"
            borderBottomColor="appliedColor"
          >
            <FrontEndTypo.H3
              color="textGreyColor.50"
              fontWeight="400"
              flex="0.3"
            >
              {t(label?.[index])}
            </FrontEndTypo.H3>

            <FrontEndTypo.H3
              color="textGreyColor.800"
              fontWeight="400"
              flex="0.4"
            >
              {item?.[key] ? item?.[key] : "-"}
            </FrontEndTypo.H3>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
