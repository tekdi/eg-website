import React from "react";
import "./App.css";
import { initializeI18n, AppShell } from "@shiksha/common-lib";
import guestRoutes from "./routes/guestRoutes";
import routes from "./routes/routes";

//TODO: separate out the theme related code from App
initializeI18n(["translation"]);

function App() {
  return (
    <AppShell
      basename={process.env.PUBLIC_URL}
      routes={routes}
      guestRoutes={guestRoutes}
      isShowFooterLink={false}
      appName="Teacher App"
    />
  );
}
export default App;
