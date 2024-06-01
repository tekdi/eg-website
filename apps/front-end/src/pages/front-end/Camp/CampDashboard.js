import { Layout, getSelectedProgramId } from "@shiksha/common-lib";
import { VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import List from "./CampList/CampList";
import EpcpCard from "./CampList/EpcpCard";
import ExamPreparationCard from "./CampList/ExamPreparationCard";
import { useEffect, useState } from "react";

export default function CampDashboard({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const [stateName, setStateName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const { state_name } = (await getSelectedProgramId()) || {};
      setStateName(state_name);
    };
    fetchData();
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("MY_CAMP"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_DASHBOARD"}
      pageTitle={t("CAMP_DASHBOARD")}
      // stepTitle={t("ATTENDANCE")}
    >
      <List userTokenInfo={userTokenInfo} />
      <VStack p="4" space="5">
        {stateName === "RAJASTHAN" && (
          <>
            <EpcpCard />
            {/* Temp Comment */}
            {/* <ExamPreparationCard /> */}
            {/* Temp Comment  End*/}
          </>
        )}
      </VStack>
    </Layout>
  );
}

CampDashboard.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
