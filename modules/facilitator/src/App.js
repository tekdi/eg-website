import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { AppShell, initializeI18n } from "@shiksha/common-lib";
initializeI18n(["translation"]);
const Dashboard = () => <h1>LOGIN SUCCESS</h1>;

function App() {
  const routes = [
    {
      path: "*",
      component: Dashboard,
    },
  ];
  const LoginComponent = React.lazy(() => import("auth/Login"));

  return <AppShell routes={routes} AuthComponent={LoginComponent} />;
}

export default App;
