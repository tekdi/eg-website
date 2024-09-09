import React from "react";
import { useTranslation } from "react-i18next";
import { Select, CheckIcon, ChevronDownIcon } from "native-base";
import PropTypes from "prop-types";

function SelectBox({
  value,
  onChange,
  placeholder,
  optionsArr,
  isDisabled,
  _select,
}) {
  const { t } = useTranslation();
  return (
    <Select
      isDisabled={isDisabled}
      placeholder={t(placeholder) || t("SELECT_MARKS")}
      selectedValue={value || ""}
      onValueChange={onChange}
      _selectedItem={{
        bg: "gray.200",
        endIcon: <CheckIcon size="2" />,
      }}
      dropdownIcon={<ChevronDownIcon size="3" />}
      style={{
        boxSizing: "border-box",
      }}
      maxWidth={"120px"}
      px={3}
      {..._select}
    >
      {optionsArr?.map((option, index) => {
        return (
          <Select.Item
            key={index + 1}
            label={t(`RESULT_DESCRIPTIONS.${option?.title}`)}
            value={option.value}
          />
        );
      })}
    </Select>
  );
}

export default SelectBox;

SelectBox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  optionsArr: PropTypes.array,
  _select: PropTypes.object,
};
