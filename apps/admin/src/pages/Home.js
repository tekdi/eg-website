import React from "react";
import { Box } from "native-base";
import { capture, AdminLayout as Layout } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "../App.css";

function Home({ footerLinks, appName }) {
  const { t } = useTranslation();

  React.useEffect(() => {
    capture("PAGE");
  }, []);

  return (
    // <SelfAttedanceSheet
    //   {...{
    //     showModal,
    //     setShowModal,
    //     setAttendance: setSelfAttendance,
    //     appName,
    //   }}
    // >
    <Layout
      _header={{
        title: t("HOME"),
        subHeading: moment().format("hh:mm A"),
        _subHeading: { fontWeight: 500, textTransform: "uppercase" },
      }}
      _appBar={{
        isShowNotificationButton: true,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
    >
      <Box bg="white" roundedBottom={"2xl"} py={6} px={4} mb={5}>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Layout>
    // </SelfAttedanceSheet>
  );
}
export default Home;
