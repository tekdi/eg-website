import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Input } from "native-base";

function TextBox({
  value,
  onChange,
  placeholder,
  maxlength,
  isDisabled,
  _style,
}) {
  const { t } = useTranslation();
  return (
    <Input
      isDisabled={isDisabled}
      title={t(placeholder) || t("ENTER_MARKS")}
      type="text"
      id="marks"
      placeholder={t(placeholder) || t("ENTER_MARKS")}
      style={{
        width: "100%",
        height: "52px",
        boxSizing: "border-box",
        ..._style,
      }}
      maxLength={maxlength || "3"}
      value={value || ""}
      onChange={onChange}
    />
  );
}

export default TextBox;

TextBox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  maxlength: PropTypes.any,
  _style: PropTypes.object,
  isDisabled: PropTypes.bool,
};
