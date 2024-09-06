import React from "react";
import { useTranslation } from "react-i18next";
import { Select, CheckIcon, ChevronDownIcon } from "native-base";
import PropTypes from "prop-types";

function SelectBox({ value, onChange, placeholder, optionsArr }) {
  const { t } = useTranslation();
  return (
    <div>
      <Select
        id="marks"
        placeholder={t(placeholder) || t("SELECT_MARKS")}
        selectedValue={value || ""}
        onValueChange={onChange}
        _selectedItem={{
          bg: "gray.200",
          endIcon: <CheckIcon size="2" />,
        }}
        dropdownIcon={<ChevronDownIcon size="3" />}
        // style={{
        //   border: "1px solid #424242",
        //   padding: "5px 10px",
        //   borderRadius: "10px",
        //   background: "transparent",
        //   width: "120px",
        // }}
        borderColor={"#424242"}
        background={"transparent"}
        borderWidth={"1px"}
        borderRadius={"10px"}
        maxWidth={"120px"}
        px={3}
      >
        {optionsArr?.map((option, index) => {
          return (
            <Select.Item
              key={index + 1}
              label={t(option?.title || option?.label)}
              value={option.value}
            />
          );
        })}
      </Select>
    </div>
  );
}

export default SelectBox;

SelectBox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  optionsArr: PropTypes.array,
};
