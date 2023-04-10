import React from "react";
import "./App.css";
import { extendTheme } from "native-base";
import { DEFAULT_THEME, AppShell } from "@shiksha/common-lib";
import Login from "./pages/Login";

function App() {
  const theme = extendTheme(DEFAULT_THEME);
  const routes = [
    {
      path: "*",
      component: <h1>LOGIN SUCCESS</h1>,
    },
  ];
  console.log(DEFAULT_THEME, AppShell);
  return <AppShell theme={theme} routes={routes} AuthComponent={Login} />;
}

export default App;
