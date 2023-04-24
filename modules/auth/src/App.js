import React from "react";
import "./App.css";
import { AppShell } from "@shiksha/common-lib";
import Login from "./pages/Login";

const Dashboard = () => <h1>LOGIN SUCCESS</h1>;

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
