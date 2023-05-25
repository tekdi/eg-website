import React from "react";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Image,
  Radio,
  Stack,
  Select as NativeSelect,
  VStack,
} from "native-base";
import { BodySmall, H2, t, FloatingInput } from "@shiksha/common-lib";
import CustomRadio from "./CustomRadio";

export function BaseInputTemplate(props) {
  return <FloatingInput {...props} />;
}

export function AddButton({ icon, iconType, ...btnProps }) {
  return (
    <Button variant={"outline"} {...btnProps} onPress={btnProps?.onClick}>
      <HStack>
        {icon} {t("ADD_MORE")}
      </HStack>
    </Button>
  );
}

export function RemoveButton({ icon, iconType, ...btnProps }) {
  return (
    <Button variant={"outline"} {...btnProps} onPress={btnProps?.onClick}>
      <HStack>
        {icon} {t("REMOVE_EXPERIENCE")}
      </HStack>
    </Button>
  );
}

export const TitleFieldTemplate = ({ id, required, title }) => {
  return (
    <VStack>
      <H2 id={id}>
        {t(title)}
        {required && <mark>*</mark>}
      </H2>
    </VStack>
  );
};

export const DescriptionFieldTemplate = ({ description, id }) => {
  return (
    <VStack pb="3">
      <BodySmall id={id} color="textMaroonColor.400">
        {t(description)}
      </BodySmall>
    </VStack>
  );
};

export const ArrayFieldTemplate = ({ schema, ...props }) => {
  const [isShow, setIsShow] = React.useState("no");
  const { title } = schema;
  console.log(props, schema);
  return (
    <div>
      <RadioBtn
        value={isShow}
        options={{
          enumOptions: [
            { label: t("YES"), value: "yes" },
            { label: t("NO"), value: "no" },
          ],
        }}
        onChange={(e) => {
          setIsShow(e);
          if (e === "yes" && props.items.length === 0) {
            props.onAddClick();
          }
        }}
        schema={{ label: t(title) }}
      />
      {isShow === "yes" && (
        <div>
          {props.items.map((element) => element.children)}
          {props.canAdd && (
            <Button
              variant={"outlinePrimary"}
              colorScheme="green"
              onPress={(e) => {
                console.log(e);
                const isValid = e.target.closest("form.rjsf"); //?.validateForm();
                console.log(isValid, isValid?.validateForm() ? "true" : "das");
                if (isValid && isValid?.validateForm()) {
                  props?.onClick();
                }
              }}
            >
              {t("ADD_EXPERIENCE")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export const FieldTemplate = ({
  id,
  style,
  label,
  help,
  required,
  description,
  errors,
  children,
  schema,
  ...props
}) => {
  const { type } = schema;
  return (
    <VStack style={style} space={id === "root" && label ? "10" : "0"}>
      {label && typeof type === "string" && type !== "string" && (
        <Box>
          {id === "root" && (
            <label htmlFor={id}>
              <HStack space="1" alignItems="center">
                <H2 color="textMaroonColor.400">{t(label)}</H2>
                <H2 color="textMaroonColor.400">{required ? "*" : null}</H2>
              </HStack>
            </label>
          )}
          {description?.props?.description !== "" && description}
        </Box>
      )}
      <Box>
        {children}
        {errors}
        {help}
      </Box>
    </VStack>
  );
};
export const ObjectFieldTemplate = (props) => {
  return (
    <VStack alignItems="center" space="6">
      {props.properties.map((element, index) => (
        <VStack key={`element${index}`} w="100%">
          {element.content}
        </VStack>
      ))}
    </VStack>
  );
};

export const ArrayFieldTitleTemplate = (props) => {
  return <React.Fragment />;
};

export const CustomR = ({
  options,
  value,
  onChange,
  required,
  schema,
  ...props
}) => {
  return (
    <CustomRadio
      schema={schema}
      options={options}
      value={value}
      required={required}
      onChange={(value) => onChange(value)}
    />
  );
};

export const RadioBtn = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions;
  const { label } = schema ? schema : {};
  return (
    <FormControl gap="4">
      {label && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <Radio.Group
        colorScheme="secondaryBlue"
        key={items}
        pb="4"
        value={value}
        accessibilityLabel="Pick your favorite number"
        onChange={(value) => onChange(value)}
      >
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
          alignItems={{
            base: "flex-start",
            md: "center",
          }}
          space={4}
          w="75%"
          gap="4"
        >
          {items?.map((item) => (
            <Radio
              key={item?.value}
              value={item?.value}
              size="lg"
              _text={{ fontSize: 12, fontWeight: 500 }}
            >
              {item?.label}
            </Radio>
          ))}
        </Stack>
      </Radio.Group>
    </FormControl>
  );
};

export const Aadhaar = (props) => {
  return (
    <VStack space="10">
      <Image
        alignSelf="center"
        source={{ uri: "/Aadhaar2.png" }}
        w="248"
        h="140"
      />
      <FloatingInput {...props} />
    </VStack>
  );
};

export const Select = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions;
  const { label } = schema ? schema : {};
  return (
    <FormControl gap="4">
      {label && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <NativeSelect
        value={value}
        onChange={(value) => onChange(value)}
        height="34px"
        color="#555"
        bg="#fff"
        border="1px solid #3f8bf1"
        rounded="10px"
      >
        {items?.map((item) => (
          <NativeSelect.Item
            key={item?.value}
            value={item?.value}
            size="lg"
            _text={{ fontSize: 12, fontWeight: 500 }}
            label={item?.label}
          />
        ))}
      </NativeSelect>
    </FormControl>
  );
};
