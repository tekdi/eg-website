import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { extendTheme, NativeBaseProvider } from "native-base";
import { DEFAULT_THEME, AppShell } from "@shiksha/common-lib";

function App() {
  const theme = extendTheme(DEFAULT_THEME);
  const routes = [];
  const LoginComponent = React.lazy(() => import("auth/Login"));

  return (
    <AppShell theme={theme} routes={routes} AuthComponent={LoginComponent} />
  );
}

export default App;
