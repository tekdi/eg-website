import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function TextBox({ value, onChange, placeholder, maxlength }) {
  const { t } = useTranslation();
  return (
    <div>
      <input
        type="text"
        id="marks"
        placeholder={t(placeholder) || t("ENTER_MARKS")}
        style={{
          border: "1px solid #424242",
          padding: "5px 10px",
          borderRadius: "10px",
          background: "transparent",
          width: "100px",
          height: "40px",
        }}
        maxLength={maxlength || "3"}
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
}

export default TextBox;

TextBox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  maxlength: PropTypes.any,
};
