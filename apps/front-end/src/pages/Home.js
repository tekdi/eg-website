import React from "react";
import { Box } from "native-base";
import { capture, Layout } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";

function Home({ footerLinks, appName }) {
  const { t } = useTranslation();

  React.useEffect(() => {
    capture("PAGE");
  }, []);

  return (
    <Layout
      _appBar={{
        languages: [
          { title: "En", code: "En" },
          { title: "Hi", code: "Hi" },
        ],
      }}
      _footer={footerLinks}
    >
      <Box py={6} px={4} mb={5}>
        {t("WELCOME_BACK")}
      </Box>
    </Layout>
  );
}
export default Home;
