import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { AppShell, initializeI18n } from "@shiksha/common-lib";
import Assessment from "pages/Assessment";
initializeI18n(["translation"]);
const Dashboard = () => <h1>LOGIN SUCCESS</h1>;

function App() {
  const routes = [
    {
      path: "/:context/:context_id/:do_id",
      component: Assessment,
    },
  ];
  const LoginComponent = React.lazy(() => import("auth/Login"));

  return <AppShell routes={routes} AuthComponent={LoginComponent} />;
}

export default App;
