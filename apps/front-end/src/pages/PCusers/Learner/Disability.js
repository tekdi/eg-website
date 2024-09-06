import { PCusers_layout as Layout, PcuserService } from "@shiksha/common-lib";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BenificiaryDisability from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryDisability";
import PropTypes from "prop-types";

export default function Disability(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      const { result } = await PcuserService.getLearnerDetails({ id });
      const { extended_users } = result || {};
      setItem(extended_users);
      setLoading(false);
    };
    init();
  }, []);

  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${id}`, {
      state: location?.state,
    });
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("BENEFICIARY_DISABILITY_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={props?.userTokenInfo?.authUser}
      analyticsPageTitle={"BENEFICIARY_DISABILITY_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("BENEFICIARY_DISABILITY_DETAILS")}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
    >
      <BenificiaryDisability
        {...props}
        _layout={{
          item,
          onlyChildren: true,
          allowRoles: ["program_coordinator"],
        }}
      />
    </Layout>
  );
}

Disability.propTypes = {
  props: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
