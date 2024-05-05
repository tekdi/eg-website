import { Layout } from "@shiksha/common-lib";
import React from "react";

export default function App({ children, ...props }) {
  return <Layout {...props}>{children}</Layout>;
}
