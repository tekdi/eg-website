import React from "react";
import "./App.css";
import {
  initializeI18n,
  AppShell,
  getTokernUserInfo,
} from "@shiksha/common-lib";
import guestRoutes from "./routes/guestRoutes";
import routes from "./routes/routes";
import adminRoutes from "./routes/admin";

//TODO: separate out the theme related code from App
initializeI18n(["translation"]);

function App() {
  const [accessRoutes, setAccessRoutes] = React.useState([]);
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [userTokenInfo, setUserTokenInfo] = React.useState();

  React.useEffect(() => {
    if (token) {
      const tokenData = getTokernUserInfo();
      const { hasura } = tokenData?.resource_access;
      setUserTokenInfo(tokenData);
      if (hasura?.roles?.includes("facilitator")) {
        setAccessRoutes(routes);
      } else {
        setAccessRoutes(adminRoutes);
      }
    }
  }, []);

  return (
    <AppShell
      basename={process.env.PUBLIC_URL}
      routes={accessRoutes}
      guestRoutes={guestRoutes}
      isShowFooterLink={false}
      appName="Teacher App"
      userTokenInfo={userTokenInfo}
    />
  );
}
export default App;
