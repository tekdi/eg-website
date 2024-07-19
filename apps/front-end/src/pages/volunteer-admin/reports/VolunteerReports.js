import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  VolunteerAdminLayout as Layout,
  getSelectedAcademicYear,
  getSelectedProgramId,
  useWindowSize,
} from "@shiksha/common-lib";
import { report } from "./ReportsJson";
import PropTypes from "prop-types";
import { VStack } from "native-base";

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
