import React, { lazy } from "react";

//v2 code
//online_facilitator_onboarding
const FacilitatorRegister = lazy(
  () => import("v2/views/Facilitator/FacilitatorRegister/FacilitatorRegister"),
);
const VolunteerRegistration = lazy(
  () => import("pages/front-end/volunteer/VolunteerRegistration"),
);
//end v2 code
const Test = React.lazy(() => import("../component/Test"));
const LoginComponent = React.lazy(() => import("auth/Login"));
const ForgetPasswordComponent = React.lazy(() => import("auth/ForgetPassword"));
export default [
  {
    path: "/login",
    component: LoginComponent,
  },
  {
    path: "/reset-password",
    component: ForgetPasswordComponent,
  },
  {
    path: "*",
    component: LoginComponent,
  },

  //v2 code
  //new facilitator registration
  {
    path: "/facilitator-self-onboarding",
    component: FacilitatorRegister,
  },

  {
    path: "/volunteer-self-onboarding",
    component: VolunteerRegistration,
  },
  //end v2 code
];
