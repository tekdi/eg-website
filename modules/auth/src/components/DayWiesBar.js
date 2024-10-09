import moment from "moment";
import { Box, HStack, Text, useToast, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { calendar } from "services/utils";
import { IconByName } from "@shiksha/common-lib";
import PropTypes from "prop-types";

const FormatDate = ({ date, type }) => {
  if (type === "Week") {
    return (
      moment(date[0]).format("D MMM") +
      " - " +
      moment(date[date.length - 1]).format("D MMM")
    );
  } else if (type === "Today") {
    return moment(date).format("D MMM, ddd, HH:MM");
  } else if (type === "Tomorrow") {
    return moment(date).format("D MMM, ddd");
  } else if (type === "Yesterday") {
    return moment(date).format("D MMM, ddd");
  } else {
    return moment(date).format("D MMMM, Y");
  }
};

export function DayWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
}) {
  const todayDate = new Date();
  const [date, setDate] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    setDate(new Date(todayDate.setDate(todayDate.getDate() + page)));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "primary.500" : "coolGray.500");
    }
  }, [page]);

  let text;

  if (page === 0) {
    text = t("TODAY");
  } else if (page === 1) {
    text = t("TOMORROW");
  } else if (page === -1) {
    text = t("YESTERDAY");
  } else {
    text = moment(date).format("dddd");
  }

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
      }}
    >
      <VStack>
        <Text fontWeight={600} fontSize="16px">
          {text}
        </Text>
        <Text fontWeight={300} fontSize="10px">
          <FormatDate date={date} />
        </Text>
      </VStack>
    </Display>
  );
}

DayWiesBar.propTypes = {
  activeColor: PropTypes.string,
  setActiveColor: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
  _box: PropTypes.object,
};

export function WeekWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
}) {
  const [weekDays, setWeekDays] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setWeekDays(calendar(page, null, "week"));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "primary.500" : "coolGray.500");
    }
  }, [page]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
        nextDisabled,
        previousDisabled,
        rightErrorText,
        leftErrorText,
      }}
    >
      <VStack>
        <FormatDate date={weekDays} type="Week" />
        <Text fontSize="10" fontWeight="300">
          {t("THIS_WEEK")}
        </Text>
      </VStack>
    </Display>
  );
}

WeekWiesBar.propTypes = {
  activeColor: PropTypes.string,
  setActiveColor: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
  _box: PropTypes.object,
  nextDisabled: PropTypes.any,
  previousDisabled: PropTypes.any,
  rightErrorText: PropTypes.any,
  leftErrorText: PropTypes.any,
};

const Display = ({
  children,
  activeColor,
  page,
  setPage,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
  _box,
}) => {
  const toast = useToast();
  const primaryColorValue =
    (typeof previousDisabled === "undefined" || previousDisabled === false) &&
    activeColor
      ? activeColor
      : "primary.500";
  let colorValue = "gray.400";

  if (typeof nextDisabled === "undefined" || nextDisabled === false) {
    colorValue = activeColor || "primary.500";
  }
  return (
    <Box bg="white" p="1" {..._box}>
      <HStack justifyContent="space-between" alignItems="center" space={4}>
        <HStack space="4" alignItems="center">
          <IconByName
            size="sm"
            color={primaryColorValue}
            name="ArrowLeftSLineIcon"
            onPress={(e) => {
              if (leftErrorText) {
                toast.show(leftErrorText);
              } else if (
                typeof previousDisabled === "undefined" ||
                previousDisabled === false
              ) {
                setPage(page - 1);
              }
            }}
          />
        </HStack>
        <HStack space="4" alignItems="center">
          <Text fontSize="md" bold>
            {children}
          </Text>
        </HStack>
        <HStack space="2">
          <IconByName
            size="sm"
            color={colorValue}
            name="ArrowRightSLineIcon"
            onPress={(e) => {
              if (rightErrorText) {
                toast.show(rightErrorText);
              } else if (
                typeof nextDisabled === "undefined" ||
                nextDisabled === false
              ) {
                setPage(page + 1);
              }
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

Display.propTypes = {
  children: PropTypes.any,
  activeColor: PropTypes.any,
  page: PropTypes.any,
  setPage: PropTypes.func,
  nextDisabled: PropTypes.any,
  previousDisabled: PropTypes.any,
  rightErrorText: PropTypes.any,
  leftErrorText: PropTypes.any,
  _box: PropTypes.any,
};
