import React from "react";
import { customizeValidator } from "@rjsf/validator-ajv8";
import {
  AdminTypo,
  CustomOTPBox,
  CustomRadio,
  FloatingInput,
  FrontEndTypo,
  H2,
  H3,
  IconByName,
  MobileNumber,
  MobileNumberReadOnly,
  chunk,
  jsonParse,
  useLocationData,
} from "@shiksha/common-lib";
import {
  Alert,
  Box,
  Button,
  CheckIcon,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Image,
  Select,
  Stack,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import FileUpload from "./formCustomeInputs/FileUpload";
import OfflineFileUpload from "./formCustomeInputs/OfflineFileUpload";
import StarRating from "./formCustomeInputs/StarRating";
import PropTypes from "prop-types";

export function LabelNameWidget() {
  const { t } = useTranslation();
  return (
    <>
      <Heading size="xs" mb={1} color="textGreyColor.750">
        {t("TELL_US_YOUR_NAME")}
      </Heading>
      <Text fontSize={"12px"} color="textGreyColor.750" mb={1}>
        {" "}
        {t("AS_PER_AADHAAR")}
      </Text>
    </>
  );
}
export function selectSubjectWidget() {
  const { t } = useTranslation();
  return (
    <Alert mt={"-30px"} status="info" alignItems={"start"}>
      <HStack alignItems="center" space="2">
        <Alert.Icon />
        <FrontEndTypo.H4>{t("SELECT_SUBJECT_INFO")}</FrontEndTypo.H4>
      </HStack>
    </Alert>
  );
}
export function LabelMobileWidget() {
  const { t } = useTranslation();
  return (
    <>
      <Heading size="xs" mb={1} color="textGreyColor.750">
        {t("HOW_CAN_CONTACT_YOU")}
      </Heading>
      <Text fontSize={"12px"} color="textGreyColor.750" mb={1}>
        {t("PLEASE_MOBILE_NUMBER")}
      </Text>
    </>
  );
}
export function LabelTimeWidget() {
  const { t } = useTranslation();
  return (
    <Heading size="sm" mb={1} color="textMaroonColor.400">
      {t("TIME_SPENT_IN_HOURS")}
    </Heading>
  );
}
export function EnrollmentLabelMobileWidget() {
  let state = jsonParse(localStorage.getItem("program"));
  const { t } = useTranslation();
  return (
    <>
      <FrontEndTypo.H3 color="textGreyColor.750" fontWeight="600">
        {t("ENROLLMENT_MOBILE_NO")}
      </FrontEndTypo.H3>
      <Text color="textGreyColor.750" mb={1}>
        {state?.state_name === "RAJASTHAN"
          ? t("AS_PER_ENROLLMENT_RECEIPT")
          : t("AS_PER_APPLICATION_RECEIPT")}
      </Text>
    </>
  );
}
export function AlreadyOpenLabelWidget() {
  const { t } = useTranslation();
  return (
    <Text color="textGreyColor.750" mb={1}>
      {t("ALREADY_OPEN_LABEL")}
    </Text>
  );
}

export function LabelAddressWidget() {
  const { t } = useTranslation();
  return (
    <>
      <FrontEndTypo.H3
        fontWeight="600"
        lineHeight="21px"
        color="textGreyColor.750"
        mb="6"
      >
        {t("ADDRESS")}
      </FrontEndTypo.H3>
      <FrontEndTypo.H4
        fontWeight="600"
        lineHeight="18px"
        color="textGreyColor.750"
      >
        {t("ADDRESS_DESCRIPTION")}
      </FrontEndTypo.H4>
    </>
  );
}

export function LabelVerifyNameWidget() {
  const { t } = useTranslation();
  return (
    <>
      <Heading size="xs" mb={6} color="textGreyColor.750">
        {t("VERIFY_CONTACT_NUMBER")}
      </Heading>
      <Text
        fontSize={"12px"}
        lineHeight={"14.63px"}
        fontWeight={600}
        color="textGreyColor.750"
        mb={1}
      >
        {t("PLEASE_ENTER_OTP")}
      </Text>
    </>
  );
}

export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

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
      <FrontEndTypo.H3
        id={id}
        fontWeight="600"
        lineHeight="21"
        color="textGreyColor.750"
      >
        {t(description)}
      </FrontEndTypo.H3>
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
        onChange={(e) => {
          setIsShow(e);
          if (e === "yes" && items.length === 0) {
            props.onAddClick();
          } else if (e === "no" && items.length > 0) {
            items?.map((item, index) => item.onDropIndexClick(index)());
          }
        }}
        options={{
          enumOptions: [
            { label: t("YES"), value: "yes" },
            { label: t("NO"), value: "no" },
          ],
        }}
        schema={{ label: t(title) }}
        value={items?.length > 0 ? "yes" : isShow !== "" ? "no" : ""}
        key={items}
      />
      {items?.length > 0 && (
        <VStack space="6">
          {items?.map(
            ({
              onDropIndexClick,
              children,
              readonly,
              hasRemove,
              schema,
              disabled,
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
  const showTitle =
    !schema?.format || !["hidden", "CheckUncheck"].includes(schema?.format);
  const showLabel = label || schema?.label;

  return (
    <VStack
      style={style}
      space={id === "root" && label ? "6" : schema?.label ? "4" : "0"}
    >
      {showTitle && showLabel && (
        <Box>
          <label htmlFor={id}>
            <HStack space="1" alignItems="center">
              {schema?.label ? (
                <FrontEndTypo.H3
                  color="textGreyColor.900"
                  fontWeight="600"
                  lineHeight="30px"
                >
                  {t(schema?.label)}
                </FrontEndTypo.H3>
              ) : (
                <FrontEndTypo.H1
                  color="textGreyColor.900"
                  fontWeight="600"
                  lineHeight="30px"
                >
                  {t(label)}
                </FrontEndTypo.H1>
              )}
              <H3 color="textRed.400">{required ? "*" : null}</H3>
            </HStack>
          </label>
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
  style: PropTypes.any,
  id: PropTypes.any,
  label: PropTypes.any,
  description: PropTypes.any,
  help: PropTypes.any,
  errors: PropTypes.any,
  required: PropTypes.bool,
  children: PropTypes.node,
  schema: PropTypes.any,
};

// rjsf custom ObjectFieldTemplate object field layout Template use in all form
export const ObjectFieldTemplate = ({ properties }) => {
  return (
    <VStack alignItems="center" space="6">
      {properties.map((element) => (
        <div
          style={{ width: "100%" }}
          id={`element_${element.name}`}
          key={`element${element.name}`}
        >
          <VStack w="100%">{element.content}</VStack>
        </div>
      ))}
    </VStack>
  );
};
FieldTemplate.propTypes = {
  properties: PropTypes.array,
};
export const ArrayFieldTitleTemplate = (props) => {
  return <div />;
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
  const { label, format } = schema || {};

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
          // _pressable: { style: { backgroundColor: "#999" } },
          _text: { textAlign: "" },
          _stackIcon: {
            flexDirection: "row",
            alignItems: "flex-start",
          },
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
          ...(schema || {}),
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
      />
    </FormControl>
  );
};

// rjsf custom Aadhaar field
export const Aadhaar = (props) => {
  const { t } = useTranslation();
  return (
    <VStack space="10">
      <FrontEndTypo.H3
        textAlign="center"
        color="textMaroonColor.400"
        ml="90px"
        bold
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
        minH={"56px"}
        key={value + items}
        isDisabled={readOnly}
        selectedValue={value}
        dropdownIcon={
          <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
        }
        borderColor={value ? "floatingLabelColor.500" : "inputBorderColor.500"}
        bg="#FFFFFF"
        borderWidth={value ? "2px" : "1px"}
        borderRadius={"4px"}
        fontSize={"16px"}
        letterSpacing={"0.5px"}
        fontWeight={400}
        lineHeight={"24px"}
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
            _text={{ fontSize: 16, fontWeight: 400 }}
          />
        ))}
      </Select>
    </FormControl>
  );
};

// rjsf custom readOnly field
export const ReadOnly = ({ value, onChange, _stack, required, schema }) => {
  const { title } = schema || {};
  const { t } = useTranslation();
  return (
    <HStack gap="2">
      <FrontEndTypo.H4 bold color="floatingLabelColor.500" {..._stack}>
        {t(title)}
      </FrontEndTypo.H4>
      <Text fontSize="14" fontWeight="400">
        {required && <Text color={"danger.500"}>*</Text>}
        {value && (
          <Text
            marginLeft={"5px"}
            fontWeight="600"
            fontSize={12}
            color={"grayTitleCard"}
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
      <HStack space={2}>
        {[lat, long]?.map((item, index) => {
          return (
            <HStack alignItems={"center"} space={2} key={item}>
              <FrontEndTypo.H4 bold color="floatingLabelColor.500">
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
  const { _hstack, _subHstack, icons, grid, label, format } = schema || {};
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
          <HStack
            space="2"
            key={subKey || ""}
            flexDirection="row"
            flexWrap="wrap"
            {..._subHstack}
          >
            {subItem?.map((item, key) => (
              <label key={item}>
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
                  {/* <input
                    checked={
                      value?.constructor?.name === "Array" &&
                      (value?.includes(item?.value) ||
                        value?.includes(`${item?.value}`))
                    }
                    type="checkbox"
                    value={item?.value}
                    onChange={handleCheck}
                  /> */}
                  <Checkbox
                    accessibilityLabel={t(item?.label || item?.title)}
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
          </HStack>
        ))}
      </Stack>
    </FormControl>
  );
};

// rjsf custom MultiCheckSubject field for specific enrollment subject group
export const MultiCheckSubject = ({
  options,
  value,
  onChange,
  schema,
  required,
  uiSchema,
}) => {
  const { t } = useTranslation();
  const { _subHstack, grid, label, format, enumOptions } = schema || {};
  let items = [enumOptions?.filter((e) => e.subject_type != "language")];
  let langItem = [enumOptions?.filter((e) => e.subject_type == "language")];
  if (grid && enumOptions?.constructor.name === "Array") {
    items = chunk(
      enumOptions?.filter((e) => e.subject_type != "language"),
      grid,
    );
  }
  if (grid && enumOptions?.constructor.name === "Array") {
    langItem = chunk(
      enumOptions?.filter((e) => e.subject_type == "language"),
      grid,
    );
  }
  const handleCheck = (event) => {
    let newValue = [];
    if (value?.constructor?.name === "Array") {
      newValue = value.filter((val, index) => {
        return value.indexOf(val) === index;
      });
    }

    let updatedList = [...newValue];
    if (event.checked) {
      updatedList = [...newValue, `${event.value}`];
    } else {
      updatedList.splice(newValue.indexOf(`${event.value}`), 1);
    }
    onChange(updatedList);
  };
  const Item = ({ items, title }) => {
    return (
      <VStack
        borderWidth={1}
        borderColor={"gray.400"}
        rounded={"sm"}
        p="4"
        space={1}
      >
        <FrontEndTypo.H3 mb="3" color={"textRed.400"}>
          {t(title)}
        </FrontEndTypo.H3>
        {items?.map((subItem, subKey) => (
          <HStack
            space="2"
            key={subKey || ""}
            flexDirection="row"
            flext="1"
            {..._subHstack}
          >
            {subItem?.map((item) => (
              <HStack key={`${item?.subject_id}`} flex="1">
                <label>
                  <HStack alignItems="center" space="3" flex="1">
                    <Checkbox
                      isDisabled={uiSchema?.["ui:readonly"]}
                      onChange={(e) =>
                        handleCheck({ checked: e, value: item?.subject_id })
                      }
                      value={item?.subject_id}
                      size="sm"
                      colorScheme={"eg-blue"}
                      isChecked={
                        value?.constructor?.name === "Array" &&
                        (value?.includes(item?.subject_id) ||
                          value?.includes(`${item?.subject_id}`))
                      }
                    />
                    <FrontEndTypo.H4>
                      {t(item?.label || item?.title || item?.name)}
                    </FrontEndTypo.H4>
                  </HStack>
                </label>
              </HStack>
            ))}
          </HStack>
        ))}
      </VStack>
    );
  };

  return (
    <FormControl gap="6">
      {label && !format && (
        <FormControl.Label>
          <H2 color="textMaroonColor.400">{t(label)}</H2>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}

      <Stack space={4}>
        {langItem?.length > 0 && (
          <Item {...{ items: langItem, title: "GROUP_A" }} />
        )}
        {items?.length > 0 && <Item {...{ items: items, title: "GROUP_B" }} />}
      </Stack>
    </FormControl>
  );
};

MultiCheckSubject.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.any,
  schema: PropTypes.any,
  required: PropTypes.any,
  uiSchema: PropTypes.any,
};

// select between 2 values radio button (yes or no)
const CheckUncheck = ({ required, schema, value, onChange }) => {
  const { label } = schema || {};
  const { t } = useTranslation();

  const checkboxIcons = [
    { name: "CheckboxCircleLineIcon" },
    { name: "CloseCircleLineIcon" },
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
  const [isFocus, setIsFocus] = React.useState(false);
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
  OfflineFileUpload,
  MobileNumber,
  MultiCheck,
  ReadOnly,
  Location,
  StarRating,
  CheckUncheck,
  //v2 widget
  LabelNameWidget,
  selectSubjectWidget,
  LabelMobileWidget,
  EnrollmentLabelMobileWidget,
  LabelTimeWidget,
  AlreadyOpenLabelWidget,
  LabelAddressWidget,
  LabelVerifyNameWidget,
  MobileNumberReadOnly,
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

  const getTranslate = (error) => {
    const schemaItem = schema?.properties?.[error?.property?.replace(".", "")];
    const title = getTitle(schemaItem);
    switch (error.name) {
      case "required":
        return {
          ...error,
          message: `${t(
            schemaItem?.format === "FileUpload"
              ? "REQUIRED_MESSAGE_UPLOAD"
              : "REQUIRED_MESSAGE",
          )} "${t(title)}"`,
        };
      case "minItems":
        return {
          ...error,
          message: t("SELECT_MINIMUM")
            .replace("{0}", error?.params?.limit)
            .replace("{1}", t(title)),
        };
      case "maxItems":
        return {
          ...error,
          message: t("SELECT_MAXIMUM")
            .replace("{0}", error?.params?.limit)
            .replace("{1}", t(title)),
        };
      case "enum": {
        let name = error?.property?.replace(/\.\d+/g, "").replace(".", "");
        const enumSchemaItem = schema?.properties?.[name]; // Rename to enumSchemaItem
        if (enumSchemaItem) {
          error.key_name = name;
        }
        return error;
      }
      case "type":
        return {
          ...error,
          message: "",
        };
      case "minimum":
        return {
          ...error,
          message: t("MINIMUM_VALIDATION_MESSAGE")
            .replace("{0}", error?.params?.limit)
            .replace("{1}", t(title)),
        };
      case "maximum":
        return {
          ...error,
          message: t("MAXIMUM_VALIDATION_MESSAGE")
            .replace("{0}", error?.params?.limit)
            .replace("{1}", t(title)),
        };
      case "format": {
        const { format } = error?.params || {};
        const messageKey =
          {
            email: "PLEASE_ENTER_VALID_EMAIL",
            string: "PLEASE_ENTER_VALID_STRING",
            number: "PLEASE_ENTER_VALID_NUMBER",
          }[format] || "REQUIRED_MESSAGE";
        return {
          ...error,
          message: t(messageKey, title ? t(title) : ""),
        };
      }
      default:
        return error;
    }
  };

  return errors.map((error) => getTranslate(error));
};

// rjsf onerror parmaeter for common
const onError = (errors, dsat) => {
  focusToField(errors);
};

export {
  CheckUncheck,
  CustomOTPBox,
  FileUpload,
  MobileNumber,
  MobileNumberReadOnly,
  OfflineFileUpload,
  StarRating,
  onError,
  templates,
  transformErrors,
  validator,
  widgets,
};
