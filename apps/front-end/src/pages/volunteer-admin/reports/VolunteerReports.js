import React, { useState } from "react";
import {
  VolunteerAdminLayout as Layout,
  useWindowSize,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { report } from "./ReportsJson";

export default function AdminReports({ footerLinks }) {
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();

  const name = useParams();
  const id = localStorage.getItem("id");
  const ipId1Data = report?.[`ip-id-${id}`];
  const reportName = `${name?.name}-report`;
  const data = ipId1Data?.[reportName];

  return (
    <Layout
      w={Width}
      h={Height}
      getRefAppBar={(e) => setRefAppBar(e)}
      refAppBar={refAppBar}
      _sidebar={footerLinks}
    >
      <VStack>
        <iframe
          title="reports"
          src={data}
          frameBorder="0"
          width="100%"
          height="900"
        />
      </VStack>
    </Layout>
  );
}

AdminReports.propTypes = {
  footerLinks: PropTypes.any,
};
