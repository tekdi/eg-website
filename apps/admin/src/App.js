import React from "react";
import "./App.css";
import { extendTheme } from "native-base";
import { DEFAULT_THEME, initializeI18n, AppShell } from "@shiksha/common-lib";
import Home from "./pages/Home";

//TODO: separate out the theme related code from App
initializeI18n(["translation", "core", "attendance"]);

function App() {
  const theme = extendTheme(DEFAULT_THEME);
  const routes = [{ path: "*", component: Home }];

  const LoginComponent = React.lazy(() => import("auth/Login"));

  return (
    <AppShell
      theme={theme}
      basename={process.env.PUBLIC_URL}
      routes={routes}
      AuthComponent={LoginComponent}
      isShowFooterLink={true}
      appName="Teacher App"
    />
  );
}
export default App;
