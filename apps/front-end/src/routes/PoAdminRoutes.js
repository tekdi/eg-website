import NotFound from "pages/NotFound";
import PoAdminHome from "pages/admin/PoAdmin/PoAdminHome";
import PoDuplicateView from "pages/admin/PoAdmin/PoDuplicateView";

export default [
  { path: "/", component: PoAdminHome },
  { path: "/poadmin", component: PoAdminHome },
  { path: "*", component: NotFound },
  {
    path: "/poadmin/learners/duplicates/:aadhaarNo",
    component: PoDuplicateView,
  },
];
