import React from "react";
import "./App.css";
import {
  initializeI18n,
  AppShell,
  getTokernUserInfo,
  facilitatorRegistryService,
  setLocalUser,
  logout,
  getSelectedAcademicYear,
  getSelectedProgramId,
} from "@shiksha/common-lib";

import guestRoutes from "./routes/guestRoutes";
import routes from "./routes/routes";
import adminRoutes from "./routes/admin";
import PoAdminRoutes from "./routes/PoAdminRoutes";
import { getIndexedDBItem, getUserId } from "v2/utils/Helper/JSHelper";

//TODO: separate out the theme related code from App

initializeI18n(["translation"]);

function App() {
  const [accessRoutes, setAccessRoutes] = React.useState([]);
  const token = localStorage.getItem("token");
  const [userTokenInfo, setUserTokenInfo] = React.useState();

  React.useEffect(async () => {
    if (token) {
      const tokenData = getTokernUserInfo();
      const { hasura } = tokenData?.resource_access || {};
      const fa_id = getUserId();
      let user;
      try {
        const { academic_year_id } = await getSelectedAcademicYear();
        const { program_id } = await getSelectedProgramId();
        const IpUserInfo = await getIndexedDBItem(
          `${fa_id}_${program_id}_${academic_year_id}_Ip_User_Info`
        );
        if (!IpUserInfo) {
          user = await facilitatorRegistryService.getInfo();
        } else {
          user = IpUserInfo;
        }
      } catch (e) {
        user = await facilitatorRegistryService.getInfo();
      }

      if (user?.status == 401) {
        logout();
        window.location.reload();
      }

      setUserTokenInfo({ ...tokenData, authUser: user });
      setLocalUser(user);

      if (hasura?.roles?.includes("facilitator")) {
        setAccessRoutes(routes);
      } else if (hasura?.roles?.includes("program_owner")) {
        setAccessRoutes(PoAdminRoutes);
      } else if (hasura?.roles?.includes("staff")) {
        setAccessRoutes(adminRoutes);
      } else {
        logout();
        window.location.reload();
      }
    }
  }, []);

  return (
    <AppShell
      basename={process.env.PUBLIC_URL}
      routes={accessRoutes}
      guestRoutes={guestRoutes}
      footerLinks={[
        {
          title: "HOME",
          route: "/",
          icon: "Home4LineIcon",
        },
        {
          title: "LEARNERS",
          route: "/beneficiary/list",
          icon: "GraduationCap",
        },
        {
          title: "COMMUNITY",
          route: "/community-references",
          icon: "TeamLineIcon",
        },
        {
          title: "MY_CAMP",
          icon: "CommunityLineIcon",
          route: "/camps",
        },
        {
          title: "DASHBOARD",
          icon: "DashboardLineIcon",
          route: "/table",
        },
      ]}
      userTokenInfo={userTokenInfo}
    />
  );
}
export default App;
