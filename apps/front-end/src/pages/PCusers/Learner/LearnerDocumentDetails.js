import {
  PCusers_layout as Layout,
  t,
  FrontEndTypo,
  jsonParse,
} from "@shiksha/common-lib";
import React, { Fragment, useEffect, useState } from "react";
import { VStack, HStack } from "native-base";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const LearnerDocsChecklist = ({ footerLinks }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setBenificiary(
      jsonParse(location?.state?.program_beneficiaries?.documents_status || {}),
    );
    setLoading(false);
  }, []);

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("DOCUMENTS_CHECKLIST"),
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/learners/list-view/${id}`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_DOCUMENT_CHECKLIST"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("DOCUMENTS_CHECKLIST")}
    >
      {Object.keys(benificiary)?.length > 0 ? (
        <VStack width={"90%"} margin={"auto"} mt={3}>
          {Object.entries(benificiary)?.map(([key, value]) => {
            return (
              <HStack
                space={4}
                alignItems={"center"}
                justifyContent={"space-between"}
                mx={4}
                my={4}
              >
                <FrontEndTypo.H2 color="textMaroonColor.400">
                  {t(key.toUpperCase())}:
                </FrontEndTypo.H2>
                <FrontEndTypo.H3>{value}</FrontEndTypo.H3>
              </HStack>
            );
          })}
        </VStack>
      ) : (
        <FrontEndTypo.H3 p={"20px"}>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </Layout>
  );
};

export default LearnerDocsChecklist;
