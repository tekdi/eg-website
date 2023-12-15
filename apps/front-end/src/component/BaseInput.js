import React from "react";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Image,
  Radio,
  Select,
  Stack,
  Text,
  TextArea,
  VStack,
} from "native-base";
import {
  BodySmall,
  H2,
  FloatingInput,
  MobileNumber,
  IconByName,
  FrontEndTypo,
  CustomOTPBox,
  AdminTypo,
  chunk,
  CustomRadio,
  useLocationData,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import FileUpload from "./formCustomeInputs/FileUpload";
import StarRating from "./formCustomeInputs/StarRating";
import { customizeValidator } from "@rjsf/validator-ajv8";

// rjsf custom BaseInputTemplate for all text field use in all form
export function BaseInputTemplate(props) {
  return <FloatingInput {...props} />;
}

// rjsf custom AddButton for ArrayFieldTemplate use in all form
export function AddButton({ icon, iconType, ...btnProps }) {
  const { t } = useTranslation();
  return (
    <Button variant={"outline"} {...btnProps} onPress={btnProps?.onClick}>
      <HStack>
        {icon} {t("ADD_MORE")}
      </HStack>
    </Button>
  );
}

// rjsf custom RemoveButton for ArrayFieldTemplate use in all form
export function RemoveButton({ icon, iconType, ...btnProps }) {
  const { t } = useTranslation();
  return (
    <Button variant={"outline"} {...btnProps} onPress={btnProps?.onClick}>
      <HStack>
        {icon} {t("REMOVE_EXPERIENCE")}
      </HStack>
    </Button>
  );
}

// rjsf custom TitleFieldTemplate title field layout Template use in all form
export const TitleFieldTemplate = ({ id, required, title }) => {
  const { t } = useTranslation();
  return (
    <VStack>
      <H2 id={id}>
        {t(title)}
        {required && <mark>*</mark>}
      </H2>
    </VStack>
  );
};

// rjsf custom DescriptionFieldTemplate field layout Template use in all form
export const DescriptionFieldTemplate = ({ description, id }) => {
  const { t } = useTranslation();
  return (
    <VStack pb="3">
      <BodySmall id={id} color="textMaroonColor.400">
        {t(description)}
      </BodySmall>
    </VStack>
  );
};

// rjsf custom ArrayFieldTemplate Array layout Template use in all form
export const ArrayFieldTemplate = ({ schema, items, formData, ...props }) => {
  const [isShow, setIsShow] = React.useState("");
  const { title } = schema;
  const { t } = useTranslation();
  let addBtn = "";

  return (
    <Box>
      <RadioBtn
        key={items}
        value={items?.length > 0 ? "yes" : isShow !== "" ? "no" : ""}
        options={{
          enumOptions: [
            { label: t("YES"), value: "yes" },
            { label: t("NO"), value: "no" },
          ],
        }}
        onChange={(e) => {
          setIsShow(e);
          if (e === "yes" && items.length === 0) {
            props.onAddClick();
          } else if (e === "no" && items.length > 0) {
            items?.map((item, index) => item.onDropIndexClick(index)());
          }
        }}
        schema={{ label: t(title) }}
      />
      {items?.length > 0 && (
        <VStack space="6">
          {items?.map(
            ({
              onDropIndexClick,
              children,
              hasRemove,
              disabled,
              readonly,
              Location,
              schema,
              index,
            }) => {
              addBtn = schema?.title;
              return (
                <VStack key={index} space="4">
                  <HStack alignItems="center" justifyContent="space-between">
                    <H2 color="textMaroonColor.400">{`${index + 1}. ${t(
                      schema?.title
                    )}`}</H2>
                    {hasRemove && (
                      <IconByName
                        p="0"
                        color="textMaroonColor.400"
                        name="DeleteBinLineIcon"
                        onPress={(e) => {
                          if (items?.length < 2) {
                            setIsShow("no");
                          }
                          onDropIndexClick(index)();
                        }}
                        isDisabled={disabled || readonly}
                      />
                    )}
                  </HStack>
                  {children}
                </VStack>
              );
            }
          )}
          {props.canAdd && (
            <Button
              variant={"link"}
              colorScheme="info"
              onPress={(e) => {
                props?.onAddClick();
              }}
            >
              <FrontEndTypo.H3 color="blueText.400" underline bold>
                {`${t("ADD")} ${t(addBtn)}`}
              </FrontEndTypo.H3>
            </Button>
          )}
        </VStack>
      )}
    </Box>
  );
};

// rjsf custom FieldTemplate field layout Template use in all form
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
  const { t } = useTranslation();
  return (
    <VStack
      style={style}
      space={id === "root" && label ? "10" : schema?.label ? "4" : "0"}
    >
      {(!schema?.format ||
        !["hidden", "CheckUncheck"].includes(schema?.format)) &&
        (label || schema?.label) && (
          <Box>
            {(id === "root" || schema?.label) && (
              <label htmlFor={id}>
                <HStack space="1" alignItems="center">
                  <H2 color="textMaroonColor.400">
                    {t(schema?.label ? schema?.label : label)}
                  </H2>
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

// rjsf custom ObjectFieldTemplate object field layout Template use in all form
export const ObjectFieldTemplate = (props) => {
  return (
    <VStack alignItems="center" space="6">
      {props.properties.map((element, index) => (
        <div
          key={`element${element.name}`}
          id={`element_${element.name}`}
          style={{ width: "100%" }}
        >
          <VStack w="100%">{element.content}</VStack>
        </div>
      ))}
    </VStack>
  );
};

export const ArrayFieldTitleTemplate = (props) => {
  return <React.Fragment />;
};

// rjsf custom CustomRadioBtn as CustomR field
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
      {...props}
    />
  );
};

// rjsf custom RadioBtn field
export const RadioBtn = ({
  options,
  value,
  onChange,
  required,
  schema,
  directionColumn,
}) => {
  const items = options?.enumOptions;
  const { label, format, readOnly } = schema || {};

  const { t } = useTranslation();
  return (
    <FormControl gap="4">
      {label && !format && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <Radio.Group
        colorScheme="red"
        key={items}
        pb="4"
        value={value}
        accessibilityLabel="Pick your favorite number"
        onChange={(value) => onChange(value)}
      >
        <Stack
          direction={{
            base: "column",
            sm: directionColumn || "row",
          }}
          alignItems={{
            base: "flex-start",
            md: directionColumn ? "flex-start" : "center",
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
              colorScheme="red"
              _text={{ fontSize: 12, fontWeight: 500 }}
              isDisabled={readOnly}
            >
              {t(item?.label)}
            </Radio>
          ))}
        </Stack>
      </Radio.Group>
    </FormControl>
  );
};

// rjsf custom Aadhaar field
export const Aadhaar = (props) => {
  const { t } = useTranslation();
  return (
    <VStack space="10">
      <FrontEndTypo.H3
        ml="90px"
        textAlign="center"
        bold
        color="textMaroonColor.400"
      >
        {t("ENTERED_AADHAR_NOT_EDITABLE")}
      </FrontEndTypo.H3>
      <Image
        alignSelf="center"
        source={{ uri: "/Aadhaar2.png" }}
        w="248"
        h="140"
      />
      <FloatingInput
        {...props}
        schema={{
          ...(props?.schema ? props?.schema : {}),
          regex: /^\d{0,12}$/,
          _input: props?.schema?._input
            ? props?.schema?._input
            : { keyboardType: "numeric" },
        }}
      />
    </VStack>
  );
};

// rjsf custom select field
export const select = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions ? options?.enumOptions : [];
  const { label, title, readOnly } = schema || {};
  const { t } = useTranslation();

  return (
    <FormControl gap="4">
      {(label || (!label && title)) && (
        <FormControl.Label
          rounded="sm"
          position="absolute"
          left="1rem"
          bg="white"
          px="1"
          m="0"
          height={"1px"}
          alignItems="center"
          style={{
            ...(value
              ? {
                  top: "0",
                  opacity: 1,
                  zIndex: 5,
                  transition: "all 0.3s ease",
                }
              : {
                  top: "0.5rem",
                  zIndex: -2,
                  opacity: 0,
                  transition: "all 0.2s ease-in-out",
                }),
          }}
        >
          <Text fontSize="12" fontWeight="400">
            {t(label || title)}
            {required ? (
              <Text color={"danger.500"}>*</Text>
            ) : (
              <Text fontWeight="300" color={"#9E9E9E"}>
                ({t("OPTIONAL")})
              </Text>
            )}
          </Text>
        </FormControl.Label>
      )}
      <Select
        key={value + items}
        isDisabled={readOnly}
        selectedValue={value}
        accessibilityLabel={t(label || title)}
        placeholder={t(label || title)}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        onValueChange={(itemValue) => onChange(itemValue)}
      >
        {items?.map((item) => (
          <Select.Item
            key={item?.value}
            value={item?.value}
            label={t(item?.label)}
            _text={{ fontSize: 12, fontWeight: 500 }}
          />
        ))}
      </Select>
    </FormControl>
  );
};

// rjsf custom readOnly field
export const ReadOnly = ({ value, onChange, required, schema }) => {
  const { title } = schema || {};
  const { t } = useTranslation();
  return (
    <HStack gap="2">
      <FrontEndTypo.H3 bold color="textMaroonColor.400">
        {t(title)}
      </FrontEndTypo.H3>
      <Text fontSize="14" fontWeight="400">
        {required && <Text color={"danger.500"}>*</Text>}
        {value && (
          <Text
            marginLeft={"5px"}
            fontWeight="700"
            fontSize={14}
            color={"#9E9E9E"}
          >
            : {value}
          </Text>
        )}
      </Text>
    </HStack>
  );
};

export const Location = ({ value, onChange, required, schema }) => {
  const { lat, long } = schema || {};
  const { t } = useTranslation();
  const [latData, longData, error] = useLocationData() || [];

  const updateValue = () => {
    onChange({ [lat]: latData, [long]: longData });
  };

  React.useEffect(() => {
    if (!(value?.[lat] && value?.[long])) {
      updateValue();
    }
  }, [value]);
  return (
    <HStack alignItems={"center"} space={2}>
      <VStack space={2}>
        {[lat, long]?.map((item, index) => {
          return (
            <HStack alignItems={"center"} space={2} key={item}>
              <FrontEndTypo.H3 bold color="textMaroonColor.400">
                {index ? t("LONGITUDE") : t("LATITUDE")}
              </FrontEndTypo.H3>
              <Text>:{value?.[item]}</Text>
            </HStack>
          );
        })}

        {t(error)}
      </VStack>
      <Button onPress={updateValue}>{t("UPDATE")}</Button>
    </HStack>
  );
};

// rjsf custom HFieldTemplate title layout Template use in orientation
export const HFieldTemplate = ({
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
  const { t } = useTranslation();
  return (
    <HStack
      style={style}
      space={id === "root" && label ? "10" : schema?.label ? "4" : "0"}
      alignItems="flex-start"
      pl="3"
      direction={["column", "row"]}
    >
      {(label || schema?.label) && typeof type === "string" && (
        <Box flex={["1", "1", "1"]}>
          {(id === "root" || schema?.label) && (
            <label htmlFor={id}>
              <HStack space="2" alignItems="center">
                <IconByName
                  name={schema?.icons}
                  color="textGreyColor.200"
                  isDisabled
                  _icon={{ size: "14px" }}
                />
                <AdminTypo.H6 color="textGreyColor.100">
                  {t(schema?.label ? schema?.label : label)}
                </AdminTypo.H6>
                <AdminTypo.H6 color="textGreyColor.100">
                  {required ? "*" : null}
                </AdminTypo.H6>
              </HStack>
            </label>
          )}
          {description?.props?.description !== "" && description}
        </Box>
      )}
      <Box flex={["1", "3", "4"]}>
        {children}
        {errors}
        {help}
      </Box>
    </HStack>
  );
};

// rjsf custom MultiCheck field
export const MultiCheck = ({
  options,
  value,
  onChange,
  schema,
  required,
  ...props
}) => {
  const { t } = useTranslation();
  const { _hstack, icons, grid, label, format } = schema || {};
  const { enumOptions } = options || {};
  let items = [enumOptions];
  if (grid && enumOptions?.constructor.name === "Array") {
    items = chunk(enumOptions, grid);
  }

  const handleCheck = (event) => {
    let newValue = [];
    if (value?.constructor?.name === "Array") {
      newValue = value.filter((val, index) => {
        return value.indexOf(val) === index;
      });
    }

    let updatedList = [...newValue];
    if (event.target.checked) {
      updatedList = [...newValue, event.target.value];
    } else {
      updatedList.splice(newValue.indexOf(event.target.value), 1);
    }
    onChange(updatedList);
  };

  return (
    <FormControl gap="6">
      {label && !format && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <Stack flexDirection={grid ? "column" : ""} {...(_hstack || {})}>
        {items?.map((subItem, subKey) => (
          <Box gap={"2"} key={subItem} flexDirection="row" flexWrap="wrap">
            {subItem?.map((item, key) => (
              <label key={item}>
                <HStack alignItems="center" space="3" flex="1">
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
                  <input
                    checked={
                      value?.constructor?.name === "Array" &&
                      (value?.includes(item?.value) ||
                        value?.includes(`${item?.value}`))
                    }
                    type="checkbox"
                    value={item?.value}
                    onChange={handleCheck}
                  />
                  {t(item?.label || item?.title)}
                </HStack>
              </label>
            ))}
          </Box>
        ))}
      </Stack>
    </FormControl>
  );
};

// select between 2 values radio button (yes or no)
const CheckUncheck = ({ required, schema, value, onChange }) => {
  const { label } = schema || {};
  const { t } = useTranslation();

  const checkboxIcons = [
    { name: "CheckboxCircleLineIcon", activeColor: "success.500" },
    { name: "CloseCircleLineIcon", activeColor: "red.500" },
  ];
  return (
    <HStack space={2}>
      {required && <Text color={"danger.500"}>*</Text>}
      <CustomRadio
        options={{
          enumOptions: [{ value: "1" }, { value: "0" }],
        }}
        schema={{
          icons: checkboxIcons,
          _box: { gap: "0", width: "auto" },
          _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
      />
      <Text flex="4">{label ? t(label) : ""}</Text>
    </HStack>
  );
};

// rjsf custom textarea field
const Textarea = ({
  schema,
  options,
  value,
  onChange,
  required,
  isInvalid,
}) => {
  const [isFocus, setIsfocus] = React.useState(false);
  const { label, title, help, rows } = schema || {};
  const { t } = useTranslation();
  return (
    <FormControl isInvalid={isInvalid || false}>
      {title && (
        <FormControl.Label
          rounded="sm"
          position="absolute"
          left="1rem"
          bg="white"
          px="1"
          m="0"
          height={"1px"}
          alignItems="center"
          style={{
            ...(isFocus || value
              ? {
                  top: "0",
                  opacity: 1,
                  zIndex: 5,
                  transition: "all 0.3s ease",
                }
              : {
                  top: "0.5rem",
                  zIndex: -2,
                  opacity: 0,
                  transition: "all 0.2s ease-in-out",
                }),
          }}
        >
          <Text fontSize="12" fontWeight="400">
            {t(title)}
            {required ? (
              <Text color={"danger.500"}>*</Text>
            ) : (
              <Text fontWeight="300" color={"#9E9E9E"}>
                ({t("OPTIONAL")})
              </Text>
            )}
          </Text>
        </FormControl.Label>
      )}
      <TextArea
        totalLines={rows || 3}
        key={title}
        onFocus={(e) => setIsfocus(true)}
        onBlur={(e) => setIsfocus(false)}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={t(label || schema?.label)}
      />
      {help && isInvalid ? (
        <FormControl.ErrorMessage>{t(help)}</FormControl.ErrorMessage>
      ) : (
        help && <FormControl.HelperText>{t(help)}</FormControl.HelperText>
      )}
    </FormControl>
  );
};

const validator = customizeValidator({
  customFormats: {
    MobileNumber: /^[6-9]\d{8}9$/,
  },
});

const widgets = {
  RadioBtn,
  CustomR,
  Aadhaar,
  select,
  Textarea,
  CustomOTPBox,
  FileUpload,
  MobileNumber,
  MultiCheck,
  ReadOnly,
  Location,
  StarRating,
  CheckUncheck,
};

const templates = {
  FieldTemplate,
  ArrayFieldTitleTemplate,
  ObjectFieldTemplate,
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  BaseInputTemplate,
  ArrayFieldTemplate,
};

// scroll to input error field
export const scrollToField = ({ property } = {}) => {
  if (property) {
    const element = document.getElementById(
      `element_${property.replace(".", "")}`
    );
    if (element) {
      element?.scrollIntoView();
    } else {
      const element1 = document.getElementById(
        `root_${property.replace(".", "")}__error`
      );
      if (element1) {
        element1?.scrollIntoView();
      }
    }
  }
};

// errors first error focus
export const focusToField = (errors) => {
  const firstError = errors?.[0];
  scrollToField(firstError);
};

// trans form erros in i18 lang translate
const transformErrors = (errors, schema, t) => {
  const getTitle = (schemaItem) => schemaItem?.label || schemaItem?.title || "";

  const getMessage = (error) => {
    const schemaItem = schema?.properties?.[error?.property?.replace(".", "")];
    const title = getTitle(schemaItem);

    switch (error.name) {
      case "required":
        return `${t(
          schemaItem?.format === "FileUpload"
            ? "REQUIRED_MESSAGE_UPLOAD"
            : "REQUIRED_MESSAGE"
        )} "${t(title)}"`;
      case "minItems":
        return t("SELECT_MINIMUM", error?.params?.limit, title);
      case "maxItems":
        return t("SELECT_MAXIMUM", error?.params?.limit, title);
      case "enum":
        return t("SELECT_MESSAGE");
      case "format":
        const { format } = error?.params || {};
        const messageKey =
          {
            email: "PLEASE_ENTER_VALID_EMAIL",
            string: "PLEASE_ENTER_VALID_STRING",
            number: "PLEASE_ENTER_VALID_NUMBER",
          }[format] || "REQUIRED_MESSAGE";
        return t(messageKey, title ? t(title) : "");
      default:
        return error.message;
    }
  };

  return errors.map((error) => ({ ...error, message: getMessage(error) }));
};

// rjsf onerror parmaeter for common
const onError = (errors, dsat) => {
  focusToField(errors);
};

export {
  widgets,
  templates,
  CustomOTPBox,
  FileUpload,
  validator,
  MobileNumber,
  onError,
  transformErrors,
  StarRating,
  CheckUncheck,
};
