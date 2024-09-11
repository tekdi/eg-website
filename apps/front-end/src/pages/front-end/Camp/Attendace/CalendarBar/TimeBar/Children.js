// Lib
import * as React from "react";
import { H2, Caption } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { VStack } from "native-base";
import moment from "moment";
import { FormatDate } from "../FormatDate";
import PropTypes from "prop-types";

const getTitle = (page) => {
  switch (true) {
    case page === 0:
      return "TODAY";
    case page === 1:
      return "TOMORROW";
    case page === -1:
      return "YESTERDAY";
    default:
      return moment().format("dddd");
  }
};

export const Children = ({ type, date, page }) => {
  const { t } = useTranslation();
  switch (true) {
    case type === "monthInDays":
      return (
        <VStack>
          <FormatDate date={date} type="Month" />
        </VStack>
      );
    case type === "week":
      return (
        <VStack alignItems="center">
          <H2>
            <FormatDate date={date} type="Week" />
          </H2>
          <Caption>{t("THIS_WEEK")}</Caption>
        </VStack>
      );
    default:
      return (
        <VStack>
          <H2>{t(getTitle(page))}</H2>
          <Caption>
            <FormatDate date={date} />
          </Caption>
        </VStack>
      );
  }
};

Children.propTypes = {
  type: PropTypes.any,
  date: PropTypes.any,
  page: PropTypes.any,
};
