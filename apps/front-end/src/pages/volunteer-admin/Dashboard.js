import React from "react";
import { VolunteerAdminLayout } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Dashboard = ({ title, titleDetail, primaryBtn, navigation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return <VolunteerAdminLayout />;
};

export default Dashboard;
