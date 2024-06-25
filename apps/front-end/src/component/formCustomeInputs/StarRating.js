import { H2, IconByName } from "@shiksha/common-lib";
import { FormControl, HStack, Pressable, Text } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const StarRating = ({ value, onChange, required, schema }) => {
  const { ratingLabels, totalStars, readOnly, _hstack, _icon } = schema || {};
  const [rating, setRating] = useState(value);
  const { t } = useTranslation();

  const handleStarClick = (starIndex) => {
    const starvalue = starIndex + 1;
    if (!readOnly) {
      setRating(`${starvalue}`);
      onChange(`${starvalue}`);
    }
  };

  React.useEffect(() => {
    setRating(`${value}`);
  }, [value]);

  return (
    <HStack
      width={"80%"}
      mx={"auto"}
      my={4}
      justifyContent={"space-evenly"}
      {..._hstack}
    >
      {[...Array(totalStars)].map((_, index) => (
        <Pressable
          key={_}
          onPress={() => handleStarClick(index)}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <IconByName
            isDisabled
            name={"StarFillIcon"}
            color={index < rating ? "amber.400" : "iconColor.100"}
            _icon={{ size: "30px" }}
            {..._icon}
          />
          {ratingLabels?.[index] && (
            <Text color={index < rating ? "amber.400" : "iconColor.100"}>
              {t(ratingLabels?.[index])}
            </Text>
          )}
        </Pressable>
      ))}
      {!rating && (
        <FormControl.Label>
          {required && <H2 color="textMaroonColor.400">*</H2>}
        </FormControl.Label>
      )}
    </HStack>
  );
};

export default StarRating;

StarRating.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  schema: PropTypes.any,
};
