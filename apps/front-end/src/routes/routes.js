import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";

export default [
  { path: "/form", component: Home },
  { path: "/dashboard", component: Dashboard },
  { path: "/*", component: Dashboard },
];
