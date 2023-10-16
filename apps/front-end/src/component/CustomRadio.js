import { IconByName, chunk, H2, SubMenu } from "@shiksha/common-lib";
import { Box, Pressable, Text, VStack, Stack, FormControl } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CustomRadio({
  options,
  value,
  onChange,
  schema,
  required,
  ...props
}) {
  const { t } = useTranslation();
  const { _hstack, icons, _stackIcon, _pressable, grid, label, _box, format } =
    schema || {};
  const { enumOptions } = options || {};
  let items = [enumOptions];
  if (grid && enumOptions?.constructor.name === "Array") {
    items = chunk(enumOptions, grid);
  }

  return (
    <FormControl gap="6" {..._box}>
      {label && !format && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <Stack flexDirection={grid ? "column" : ""} {...(_hstack || {})}>
        {items?.map((subItem, subKey) => (
          <Box gap="2" key={subKey || ""} flexDirection="row" flexWrap="wrap">
            {subItem?.map((item, key) => {
              const isSelected = value === item?.value;

              const pressableStyle = {
                background: isSelected
                  ? "linear-gradient(91deg, rgb(8, 75, 130) -31.46%, #fff -31.44%, #084b822e -10.63%, rgb(0 0 0 / 0%) 26.75%, #fff 70.75%, #084b8224 108.28%, #084b8200 127.93%)"
                  : "#FAFAFA",
              };

              const pressableBorderWidth = isSelected ? "2" : "1";
              const pressableBorderColor = isSelected
                ? "secondaryBlue.500"
                : "gray.400";

              return (
                <Pressable
                  key={key || ""}
                  style={pressableStyle}
                  flexDirection="row"
                  alignItems="center"
                  flex={grid ? "1" : ""}
                  p="4"
                  rounded={5}
                  borderWidth={pressableBorderWidth}
                  borderColor={pressableBorderColor}
                  mb="2"
                  {...(icons?.[key]?.["_pressable"] || _pressable || {})}
                  onPress={() => onChange(item?.value)}
                >
                  <VStack
                    alignItems="center"
                    space="3"
                    flex="1"
                    {..._stackIcon}
                  >
                    {icons?.[subKey + key]?.name && (
                      <IconByName
                        {...icons[subKey + key]}
                        isDisabled
                        color={
                          isSelected
                            ? icons?.[subKey + key]?.activeColor ||
                              "secondaryBlue.500"
                            : icons?.[subKey + key]?.color || "gray.500"
                        }
                        _icon={{
                          ...(icons?.[subKey + key]?.["_icon"]
                            ? icons?.[subKey + key]?.["_icon"]
                            : {}),
                        }}
                      />
                    )}
                    {item?.label && (
                      <Text
                        textAlign="center"
                        color={isSelected ? "secondaryBlue.500" : "gray.500"}
                      >
                        {t(item?.label)}
                      </Text>
                    )}
                  </VStack>
                </Pressable>
              );
            })}
          </Box>
        ))}
      </Stack>
    </FormControl>
  );
}
