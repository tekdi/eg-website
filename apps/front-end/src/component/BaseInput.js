import React from "react";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Image,
  Pressable,
  Radio,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
} from "native-base";
import {
  BodySmall,
  H2,
  FloatingInput,
  IconByName,
  FrontEndTypo,
  CustomOTPBox,
  getBase64,
  uploadRegistryService,
} from "@shiksha/common-lib";
import CustomRadio from "./CustomRadio";
import { useTranslation } from "react-i18next";

export function BaseInputTemplate(props) {
  return <FloatingInput {...props} />;
}

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
      {(label || schema?.label) && typeof type === "string" && (
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
export const ObjectFieldTemplate = (props) => {
  const { t } = useTranslation();
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
  const { label, format } = schema ? schema : {};
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
            sm: "row",
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

export const select = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions ? options?.enumOptions : [];
  const { label, title } = schema ? schema : {};
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
            {t(label ? label : title)}
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
        selectedValue={value}
        accessibilityLabel={t(label ? label : title)}
        placeholder={t(label ? label : title)}
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

export { CustomOTPBox };
export const readOnly = ({ options, value, onChange, required, schema }) => {
  const items = options?.enumOptions ? options?.enumOptions : [];
  const { label } = schema ? schema : {};
  const { t } = useTranslation();
  return (
    <FormControl gap="4">
      {label && (
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
          <Text fontSize="14" fontWeight="400">
            {t(label)}
            {required && <Text color={"danger.500"}>*</Text>}
            {value && (
              <Text
                marginLeft={"5px"}
                fontWeight="700"
                fontSize={14}
                color={"#9E9E9E"}
              >
                {value}
              </Text>
            )}
          </Text>
        </FormControl.Label>
      )}
    </FormControl>
  );
};

export const FileUpload = ({ options, value, onChange, required, schema }) => {
  const { label, title } = schema ? schema : {};
  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState({});
  const { t } = useTranslation();

  const uploadProfile = async (file) => {
    setLoading(true);
    const form_data = new FormData();
    const item = {
      file,
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadFile(form_data);
    setLoading(false);
    onChange(result.fileUrl);
    setFile(result.fileUrl);
  };

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
      uploadProfile(file);
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  return (
    <VStack space={2}>
      <VStack
        justifyContent="center"
        borderWidth="1"
        borderStyle="dotted"
        borderColor="textGreyColor.50"
        alignItems="center"
        minH="200px"
      >
        {value ? (
          <Image
            source={{
              uri: value,
            }}
            alt={`Alternate ${t(label)}`}
            width={"190px"}
            height={"190px"}
          />
        ) : loading ? (
          <Spinner
            color={"primary.500"}
            accessibilityLabel="Loading posts"
            size="lg"
          />
        ) : (
          <Box>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <Pressable
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
              alignItems="center"
              gap="5"
            >
              <IconByName name="Upload2FillIcon" isDisabled />
              {t(label ? label : title)}
            </Pressable>
          </Box>
        )}
      </VStack>
      {errors?.fileSize && <H2 color="red.400">{errors?.fileSize}</H2>}
    </VStack>
  );
};
