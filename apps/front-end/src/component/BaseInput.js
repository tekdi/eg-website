import React from "react";
import { Button, HStack, Input } from "native-base";
import { getInputProps } from "@rjsf/utils";
import { t } from "@shiksha/common-lib";

export function BaseInputTemplate(props) {
  const {
    schema,
    id,
    options,
    label,
    value,
    type,
    placeholder,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    rawErrors,
    hideError,
    uiSchema,
    registry,
    formContext,
    ...rest
  } = props;
  const onTextChange = ({ target: { value: val } }) => {
    // Use the options.emptyValue if it is specified and newVal is also an empty string
    onChange(val === "" ? options.emptyValue || "" : val);
  };
  const onTextBlur = ({ target: { value: val } }) => onBlur(id, val);
  const onTextFocus = ({ target: { value: val } }) => onFocus(id, val);

  const inputProps = { ...rest, ...getInputProps(schema, type, options) };
  const hasError = rawErrors?.length > 0 && !hideError;

  return (
    <Input
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      error={hasError}
      errors={hasError ? rawErrors : undefined}
      onChange={onChangeOverride || onTextChange}
      onBlur={onTextBlur}
      onFocus={onTextFocus}
      {...inputProps}
    />
  );
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
        {icon} {t("REMOVE")}
      </HStack>
    </Button>
  );
}
