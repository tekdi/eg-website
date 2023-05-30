import { IconByName, chunk, t, H2 } from "@shiksha/common-lib";
import {
  Box,
  Pressable,
  Text,
  VStack,
  Stack,
  FormControl,
  HStack,
} from "native-base";
import React from "react";

export default function CustomRadio({
  options,
  value,
  onChange,
  schema,
  required,
}) {
  const { _hstack, icons, _pressable, grid, label } = schema ? schema : {};
  const { enumOptions } = options ? options : {};
  let items = [enumOptions];
  if (grid && enumOptions?.constructor.name === "Array") {
    items = chunk(enumOptions, grid);
  }

  return (
    <FormControl gap="6">
      {label && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <Stack flexDirection={grid ? "column" : ""} {...(_hstack ? _hstack : {})}>
        {items?.map((subItem, subKey) => (
          <Box gap={"2"} key={subKey} flexDirection="row" flexWrap="wrap">
            {subItem?.map((item, key) => (
              <Pressable
                key={key}
                style={{
                  background:
                    value == item?.value
                      ? "linear-gradient(91deg, rgb(8, 75, 130) -31.46%, #fff -31.44%, #084b822e -10.63%, rgb(0 0 0 / 0%) 26.75%, #fff 70.75%, #084b8224 108.28%, #084b8200 127.93%)"
                      : "#FAFAFA",
                }}
                flexDirection="row"
                alignItems="center"
                flex={grid ? "1" : ""}
                p="4"
                rounded={5}
                borderWidth={value == item?.value ? "2" : 1}
                borderColor={
                  value == item?.value ? "secondaryBlue.500" : "gray.400"
                }
                {...(icons?.[key]?.["_pressable"]
                  ? icons?.[key]?.["_pressable"]
                  : _pressable
                  ? _pressable
                  : {})}
                onPress={() => onChange(item?.value)}
                mb="2"
              >
                <VStack alignItems="center" space="3" flex="1">
                  {icons?.[key] && icons?.[key].name && (
                    <IconByName
                      {...icons[key]}
                      isDisabled
                      color={
                        value === item?.value ? "secondaryBlue.500" : "gray.500"
                      }
                      _icon={{
                        ...(icons?.[key]?.["_icon"]
                          ? icons?.[key]?.["_icon"]
                          : {}),
                      }}
                    />
                  )}
                  <Text
                    textAlign="center"
                    {...{
                      color:
                        value === item?.value
                          ? "secondaryBlue.500"
                          : "gray.500",
                    }}
                  >
                    {item?.label}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </Box>
        ))}
      </Stack>
    </FormControl>
  );
}
