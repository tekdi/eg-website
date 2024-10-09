import React from "react";

import { AppShell, DEFAULT_THEME } from "@shiksha/common-lib";
import { extendTheme } from "native-base";
import Sample from "pages/Sample";
import "./App.css";

function App() {
  const theme = extendTheme(DEFAULT_THEME);
  const routes = [
    {
      path: "/",
      component: Sample,
    },
    {
      path: "*",
      component: Sample,
    },
  ];
  const LoginComponent = React.lazy(() => import("core/Login"));

  return (
    <AppShell theme={theme} routes={routes} AuthComponent={LoginComponent} />
  );
}

export default App;
