import React, { useEffect, useState } from "react";
import { CardComponent, PCusers_layout as Layout } from "@shiksha/common-lib";
import { VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export default function BenificiaryAddress({ userTokenInfo }) {
  const [benificiary, setBenificiary] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    setBenificiary(location?.state);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${location?.state?.id}`, {
      state: location?.state,
    });
  };

  return (
    <Layout
      _appBar={{ name: t("ADDRESS_DETAILS"), onPressBackButton }}
      analyticsPageTitle={"BENEFICIARY_ADDRESS_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ADDRESS_DETAILS")}
      facilitator={userTokenInfo?.authUser || {}}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
    >
      <VStack space={4} p="4">
        <CardComponent
          isHideProgressBar={true}
          _vstack={{ space: 0 }}
          _hstack={{ borderBottomWidth: 0 }}
          title={t("ADDRESS_DETAILS")}
          label={[
            "ADDRESS",
            "STATE",
            "DISTRICT",
            "BLOCK",
            "VILLAGE",
            "GRAMPANCHAYAT",
            "PINCODE",
          ]}
          arr={[
            "address",
            "state",
            "district",
            "block",
            "village",
            "grampanchayat",
            "pincode",
          ]}
          item={benificiary}
        />
      </VStack>
    </Layout>
  );
}

BenificiaryAddress.propTypes = {
  userTokenInfo: PropTypes.any,
};
