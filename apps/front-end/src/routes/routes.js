import Dashboard from "pages/front-end/Dashboard";
import Profile from "pages/admin/facilitator/Profile";
import FacilitatorView from "pages/admin/facilitator/View";
import AdminHome from "pages/admin/AdminHome";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/profile", component: Profile },
  { path: "/admin", component: AdminHome },
  { path: "/", component: Dashboard },
];
