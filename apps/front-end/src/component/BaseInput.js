import React from "react";
import { Box, Button, HStack, Input, VStack } from "native-base";
import { getInputProps } from "@rjsf/utils";
import { BodySmall, H2, t } from "@shiksha/common-lib";

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
      <BodySmall id={id}>{t(description)}</BodySmall>
    </VStack>
  );
};

export const FieldTemplate = ({
  id,
  classNames,
  style,
  label,
  help,
  required,
  description,
  errors,
  children,
}) => {
  return (
    <div className={classNames} style={style}>
      <React.Fragment>
        <label htmlFor={id}>
          <HStack space="1" alignItems="center">
            <H2>{t(label)}</H2>
            <H2>{required ? "*" : null}</H2>
          </HStack>
        </label>
        {description?.props?.description !== "" ? (
          description
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
      {children}
      {errors}
      {help}
    </div>
  );
};
export const ObjectFieldTemplate = (props) => {
  return (
    <div>
      {props.properties.map((element) => (
        <div className="property-wrapper">{element.content}</div>
      ))}
    </div>
  );
};

export const ArrayFieldTitleTemplate = (props) => {
  return <React.Fragment />;
};
