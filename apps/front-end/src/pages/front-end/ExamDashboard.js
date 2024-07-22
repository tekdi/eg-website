import React, { useState, useEffect } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  arrList,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import DashboardCard from "component/common_components/DashboardCard";
import { useTranslation } from "react-i18next";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const ExamDashboard = ({ footerLinks, userTokenInfo }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const state_name =
    JSON.parse(localStorage.getItem("program"))?.state_name || "";
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();

  useEffect(async () => {
    if (userTokenInfo) {
      const IpUserInfo = await getIpUserInfo(fa_id);
      let ipUserData = IpUserInfo;
      if (!IpUserInfo) {
        ipUserData = await setIpUserInfo(fa_id);
      }

      setFacilitator(ipUserData);
    }
  }, []);

  return (
    <Layout
      loading={loading}
      _appBar={{
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
      pageTitle={t("DASHBOARD")}
    >
      <VStack bg="white" p="5" space={4} style={{ zIndex: -1 }}>
        <VStack space={"4"} p={"2"}>
          <FrontEndTypo.H1 color="textGreyColor.900">
            {t("HELLO_HOME")}, {facilitator?.first_name}!
          </FrontEndTypo.H1>
          <FrontEndTypo.H3
            _fontWeight={{
              fontWeight: "600",
            }}
            color="textGreyColor.750"
          >
            {t("DASHBOARD")}
          </FrontEndTypo.H3>
        </VStack>
        <DashboardCard
          title={"LEARNER_STATUS_COUNT"}
          titleDetail={"ACCESS_ALL_INFORMATION_OF_YOUR_LEARNERS_STATUS"}
          primaryBtn={"LEARNER_STATUS_OVERVIEW"}
          navigation={"/table"}
        />

        {/* Temp Comment */}
        {state_name === "RAJASTHAN" && (
          <>
            <DashboardCard
              title={"LEARNER_EXAM_ATTENDANCE"}
              titleDetail={"LEARNER_EXAM_ATTENDANCE_DETAILS"}
              primaryBtn={"LEARNER_EXAM_ATTENDANCE_OVERVIEW"}
              navigation={"/examattendancereport"}
            />
            {/* <DashboardCard
              title={"LEARNER_EXAM_RESULTS"}
              titleDetail={"LEARNER_EXAM_ATTENDANCE_DETAILS"}
              primaryBtn={"LEARNER_EXAM_RESULTS_OVERVIEW"}
              navigation={"/examresultreport"}
            /> */}
          </>
        )}
        {/* Temp Comment  End*/}
      </VStack>
    </Layout>
  );
};

export default ExamDashboard;
