import { Box, FormControl, HStack, Pressable } from "native-base";
import React from "react";

export default function CustomRadio({
  value,
  label,
  items,
  onChange,
  itemElement,
  _box,
}) {
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <HStack space={"2"} flexWrap="wrap">
        {items.map((item, key) => (
          <Pressable {...{ key }} onPress={() => onChange(item)} mb="2">
            {itemElement ? (
              itemElement
            ) : (
              <Box
                px="5"
                py="2"
                rounded={5}
                borderWidth={1}
                borderColor={"gray.400"}
                shadow={value === item ? "2" : "0px"}
                _text={{ color: value === item ? "gray.900" : "gray.300" }}
                {..._box}
              >
                {item}
              </Box>
            )}
          </Pressable>
        ))}
      </HStack>
    </FormControl>
  );
}
