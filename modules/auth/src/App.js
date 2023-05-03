import React from "react";
import "./App.css";
import { AppShell, initializeI18n } from "@shiksha/common-lib";
import Login from "./pages/Login";

const Dashboard = () => <h1>LOGIN SUCCESS</h1>;
initializeI18n(["translation"]);

function App() {
  const routes = [
    {
      path: "*",
      component: Dashboard,
    },
  ];

  return <AppShell routes={routes} AuthComponent={Login} />;
}

export default App;
