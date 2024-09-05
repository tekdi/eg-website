import { customizeValidator } from "@rjsf/validator-ajv8";
import {
  AdminTypo,
  CustomOTPBox,
  CustomRadio,
  FloatingInput,
  FrontEndTypo,
  H2,
  IconByName,
  MobileNumber,
  chunk,
  useLocationData,
  CheckUncheck,
} from "@shiksha/common-lib";
import {
  Box,
  Button,
  CheckIcon,
  Checkbox,
  FormControl,
  HStack,
  Image,
  Select,
  Stack,
  Text,
  TextArea,
  VStack,
} from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CalenderInput from "./CalenderInput";
import Time from "./Time";
import FileUpload from "./formCustomeInputs/FileUpload";
import StarRating from "./formCustomeInputs/StarRating";

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

AddButton.propTypes = {
  icon: PropTypes.any,
  iconType: PropTypes.any,
  btnProps: PropTypes.any,
};

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

RemoveButton.propTypes = {
  icon: PropTypes.any,
  iconType: PropTypes.any,
  btnProps: PropTypes.any,
};
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
TitleFieldTemplate.propTypes = {
  id: PropTypes.any,
  required: PropTypes.bool,
  title: PropTypes.any,
};
// rjsf custom DescriptionFieldTemplate field layout Template use in all form
export const DescriptionFieldTemplate = ({ description, id }) => {
  const { t } = useTranslation();
  return (
    <VStack pb="3">
      <FrontEndTypo.H3
        id={id}
        fontWeight="600"
        lineHeight="21px"
        color="textGreyColor.750"
      >
        {t(description)}
      </FrontEndTypo.H3>
    </VStack>
  );
};
DescriptionFieldTemplate.propTypes = {
  id: PropTypes.any,
  description: PropTypes.any,
};
// rjsf custom ArrayFieldTemplate Array layout Template use in all form
export const ArrayFieldTemplate = ({ schema, items, formData, ...props }) => {
  const [isShow, setIsShow] = useState("");
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
                      schema?.title,
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
            },
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

ArrayFieldTemplate.propTypes = {
  schema: PropTypes.any,
  items: PropTypes.any,
  formData: PropTypes.any,
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
  const { t } = useTranslation();
  return (
    <VStack
      style={style}
      space={id === "root" && label ? "6" : schema?.label ? "4" : "0"}
    >
      {(!schema?.format ||
        !["hidden", "CheckUncheck"].includes(schema?.format)) &&
        (label || schema?.label) && (
          <Box>
            {(id === "root" || schema?.label) && (
              <label htmlFor={id}>
                <HStack space="1" alignItems="center">
                  <FrontEndTypo.H1
                    fontSize="20px"
                    color="textGreyColor.900"
                    fontWeight="600"
                  >
                    {t(schema?.label ? schema?.label : label)}
                  </FrontEndTypo.H1>
                  <H2 color="duplicatedColor">{required ? "*" : null}</H2>
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
FieldTemplate.propTypes = {
  id: PropTypes.any,
  style: PropTypes.any,
  label: PropTypes.any,
  help: PropTypes.any,
  required: PropTypes.bool,
  description: PropTypes.any,
  errors: PropTypes.any,
  children: PropTypes.node,
  schema: PropTypes.any,
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
  return null;
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
CustomR.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  schema: PropTypes.any,
};
// rjsf custom RadioBtn field
export const RadioBtn = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions;
  const { label, format, ...otherSchema } = schema || {};

  const { t } = useTranslation();
  return (
    <FormControl gap="4">
      {label && !format && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
      <CustomRadio
        options={{
          enumOptions: items,
        }}
        schema={{
          ...(otherSchema || {}),
          // _pressable: { style: { backgroundColor: "#999" } },
          _stackIcon: { flexDirection: "row" },
          icons: items?.map((e) =>
            e.value == value
              ? {
                  style: {},
                  name: "RadioButtonLineIcon",
                  py: 0,
                  px: 0,
                  mx: 2,
                  borderWidth: 0,
                  activeColor: "#1F1D76",
                }
              : {
                  name: "CheckboxBlankCircleLineIcon",
                  py: 0,
                  px: 0,
                  mx: 2,
                  borderWidth: 0,
                  color: "#333",
                },
          ),
          // _box: { gap: "0", width: "auto" },
          // _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} },
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
      />
    </FormControl>
  );
};

RadioBtn.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  schema: PropTypes.any,
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
export const SelectApp = ({
  options,
  isDisabled,
  value,
  onChange,
  required,
  schema,
}) => {
  const items = options?.enumOptions ? options?.enumOptions : [];
  const { label, title, readOnly, isHideFloatingLabel } = schema || {};
  const { t } = useTranslation();

  return (
    <FormControl gap="4">
      {(label || (!label && title)) && !isHideFloatingLabel && (
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
            top: "0",
            opacity: 1,
            zIndex: 5,
            transition: "all 0.3s ease",
          }}
        >
          <Text
            bg={"white"}
            zIndex={99999999}
            color={"floatingLabelColor.500"}
            fontSize="12"
            fontWeight="400"
          >
            {t(label || title)}
            {required ? <Text color={"danger.500"}>*</Text> : ""}
          </Text>
        </FormControl.Label>
      )}
      <Select
        key={value + items}
        isDisabled={readOnly || isDisabled}
        selectedValue={value}
        accessibilityLabel={t(label || title)}
        placeholder={t(label || title)}
        borderColor={value ? "floatingLabelColor.500" : "inputBorderColor.500"}
        bg="#FFFFFF"
        dropdownIcon={
          <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
        }
        borderWidth={value ? "2px" : "1px"}
        borderRadius={"4px"}
        fontSize={"16px"}
        letterSpacing={"0.5px"}
        fontWeight={400}
        lineHeight={"24px"}
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
SelectApp.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  schema: PropTypes.any,
};

export const select = SelectApp;

// rjsf custom readOnly field
export const ReadOnly = ({ value, required, schema }) => {
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
ReadOnly.propTypes = {
  value: PropTypes.any,
  required: PropTypes.bool,
  schema: PropTypes.any,
};
export const Location = ({ value, onChange, schema }) => {
  const { lat, long } = schema || {};
  const { t } = useTranslation();
  const [latData, longData, error] = useLocationData() || [];

  const updateValue = () => {
    onChange({ [lat]: latData, [long]: longData });
  };

  useEffect(() => {
    if (!(value?.[lat] && value?.[long])) {
      updateValue();
    }
  }, [value]);
  return (
    <HStack alignItems={"center"} space={2}>
      <HStack space={2}>
        {[lat, long]?.map((item, index) => {
          return (
            <HStack alignItems={"center"} space={2} key={item}>
              <FrontEndTypo.H4 bold color="floatingLabelColor.400">
                {index ? t("LONGITUDE") : t("LATITUDE")}:
              </FrontEndTypo.H4>
              <FrontEndTypo.H4 color={"grayTitleCard"}>
                {value?.[item]}
              </FrontEndTypo.H4>
            </HStack>
          );
        })}

        {t(error)}
      </HStack>
      <IconByName name="PencilLineIcon" onPress={updateValue} />
    </HStack>
  );
};
Location.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  schema: PropTypes.any,
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
HFieldTemplate.propTypes = {
  id: PropTypes.any,
  style: PropTypes.any,
  label: PropTypes.any,
  help: PropTypes.any,
  description: PropTypes.any,
  errors: PropTypes.any,
  required: PropTypes.bool,
  schema: PropTypes.any,
  children: PropTypes.node,
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
          <Box
            gap={"2"}
            key={subItem + subKey}
            flexDirection="row"
            flexWrap="wrap"
          >
            {subItem?.map((item, key) => (
              <label key={item + key}>
                <HStack alignItems="center" space="3" flex="1">
                  {icons?.[key] && icons?.[key].name && (
                    <IconByName
                      {...icons[key]}
                      isDisabled
                      color={value === item?.value ? "eg_blue" : "gray.500"}
                      _icon={{
                        ...(icons?.[key]?.["_icon"]
                          ? icons?.[key]?.["_icon"]
                          : {}),
                      }}
                    />
                  )}
                  <Checkbox
                    onChange={(e) =>
                      handleCheck({
                        target: { checked: e, value: item?.value },
                      })
                    }
                    value={item?.value}
                    size="sm"
                    colorScheme={"eg-blue"}
                    isChecked={
                      value?.constructor?.name === "Array" &&
                      (value?.includes(item?.value) ||
                        value?.includes(`${item?.value}`))
                    }
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
MultiCheck.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  schema: PropTypes.any,
  required: PropTypes.bool,
};

// rjsf custom textarea field
const Textarea = ({ schema, value, onChange, required, isInvalid }) => {
  const [isFocus, setIsFocus] = useState(false);
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
            {required ? <Text color={"danger.500"}>*</Text> : ""}
          </Text>
        </FormControl.Label>
      )}
      <TextArea
        totalLines={rows || 3}
        key={title}
        onFocus={(e) => setIsFocus(true)}
        onBlur={(e) => setIsFocus(false)}
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
Textarea.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  schema: PropTypes.any,
  required: PropTypes.bool,
  isInvalid: PropTypes.any,
};
const validator = customizeValidator({
  customFormats: {
    // MobileNumber: /^[6-9]\d{8}9$/,
  },
});

const widgets = {
  RadioBtn,
  CustomR,
  Aadhaar,
  select: SelectApp,
  Textarea,
  CustomOTPBox,
  FileUpload,
  MobileNumber,
  MultiCheck,
  ReadOnly,
  Location,
  StarRating,
  CheckUncheck,
  CalenderInput,
  Time,
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
      `element_${property.replace(".", "")}`,
    );
    if (element) {
      element?.scrollIntoView();
    } else {
      const element1 = document.getElementById(
        `root_${property.replace(".", "")}__error`,
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
            : "REQUIRED_MESSAGE",
        )} "${t(title)}"`;
      case "minItems":
        return t("SELECT_MINIMUM")
          .replace("{0}", error?.params?.limit)
          .replace("{1}", t(title));
      case "maxItems":
        return t("SELECT_MAXIMUM")
          .replace("{0}", error?.params?.limit)
          .replace("{1}", t(title));
      case "enum":
        return t("SELECT_MESSAGE");
      case "format": {
        const { format } = error?.params || {};
        const messageKey =
          {
            email: "PLEASE_ENTER_VALID_EMAIL",
            string: "PLEASE_ENTER_VALID_STRING",
            number: "PLEASE_ENTER_VALID_NUMBER",
          }[format] || "REQUIRED_MESSAGE";
        return t(messageKey, title ? t(title) : "");
      }
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

const validate = (data, key) => {
  let error = {};
  switch (key) {
    case "mobile":
      if (data?.mobile?.toString()?.length !== 10) {
        error = { mobile: t("MINIMUM_LENGTH_IS_10") };
      }
      if (!(data?.mobile > 6000000000 && data?.mobile < 9999999999)) {
        error = { mobile: t("PLEASE_ENTER_VALID_NUMBER") };
      }
      break;
    case "aadhar_no":
      if (
        data?.aadhar_no &&
        !`${data?.aadhar_no}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      ) {
        error = { aadhar_no: t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER") };
      }
      break;
    case "dob":
      const years = moment().diff(data?.dob, "years");
      if (years < 18) {
        error = { dob: t("MINIMUM_AGE_18_YEAR_OLD") };
      }
      break;
    case "grampanchayat":
    case "first_name":
    case "last_name":
    case "middle_name":
      // do some thing
      break;
    case "vo_experience":
    case "experience":
      ["vo_experience", "experience"].forEach((keyex) => {
        data?.[keyex]?.map((item, index) => {
          ["role_title", "organization", "description"].forEach((key) => {
            if (item?.[key]) {
              if (
                !item?.[key]?.match(/^[a-zA-Z ]*$/g) ||
                item?.[key]?.replaceAll(" ", "") === ""
              ) {
                errors[keyex][index]?.[key]?.addError(
                  `${t("REQUIRED_MESSAGE")} ${t(
                    schema?.properties?.[key]?.title,
                  )}`,
                );
              } else if (key === "description" && item?.[key].length > 200) {
                errors[keyex][index]?.[key]?.addError(
                  `${t("MAX_LENGHT_200")} ${t(
                    schema?.properties?.[key]?.title,
                  )}`,
                );
              }
            }
          });
        });
      });
      break;
    default:
      break;
  }
  return error;
};

const customValidate = (data, err) => {
  const arr = Object.keys(err);
  arr.forEach((key) => {
    const isValid = validate(data, key);
    if (isValid?.[key]) {
      if (!errors?.[key]?.__errors.includes(isValid[key]))
        err?.[key]?.addError(isValid[key]);
    }
  });

  return err;
};

export {
  CheckUncheck,
  CustomOTPBox,
  FileUpload,
  MobileNumber,
  StarRating,
  onError,
  templates,
  transformErrors,
  validator,
  widgets,
  customValidate,
};
