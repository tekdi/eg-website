import React, { useState } from "react";
import { Layout, FrontEndTypo } from "@shiksha/common-lib";
import { VStack } from "native-base";
import DashboardCard from "component/common_components/DashboardCard";
import { useTranslation } from "react-i18next";

const ExamDashboard = ({ footerLinks }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
      <VStack bg="primary.50" p="5" space={4} style={{ zIndex: -1 }}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("DASHBOARD")}
        </FrontEndTypo.H2>
        <DashboardCard
          title={"LEARNER_STATUS_COUNT"}
          titleDetail={"ACCESS_ALL_INFORMATION_OF_YOUR_LEARNERS_STATUS"}
          primaryBtn={"LEARNER_STATUS_OVERVIEW"}
          navigation={"/table"}
        />
        {/* Temp Comment */}
        <DashboardCard
          title={"LEARNER_EXAM_ATTENDANCE"}
          titleDetail={"LEARNER_EXAM_ATTENDANCE_DETAILS"}
          primaryBtn={"LEARNER_EXAM_ATTENDANCE_OVERVIEW"}
          navigation={"/examattendancereport"}
        />
        <DashboardCard
          title={"LEARNER_EXAM_RESULTS"}
          titleDetail={"LEARNER_EXAM_ATTENDANCE_DETAILS"}
          primaryBtn={"LEARNER_EXAM_RESULTS_OVERVIEW"}
          navigation={"/examresultreport"}
        />
        {/* Temp Comment  End*/}
      </VStack>
    </Layout>
  );
};

export default ExamDashboard;
