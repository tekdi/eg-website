import React, { useEffect, useState } from "react";
import {
  PCusers_layout as Layout,
  t,
  FrontEndTypo,
  jsonParse,
} from "@shiksha/common-lib";
import { VStack, HStack } from "native-base";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const LearnerDocsChecklist = ({ userTokenInfo, footerLinks }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
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
  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${location?.state?.id}`, {
      state: location?.state,
    });
  };
  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("DOCUMENTS_CHECKLIST"),
        lang,
        setLang,
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_DOCUMENT_CHECKLIST"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("DOCUMENTS_CHECKLIST")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      {Object.keys(benificiary)?.length > 0 ? (
        <VStack width={"90%"} margin={"auto"} mt={3}>
          {Object.entries(benificiary)?.map(([key, value]) => {
            return (
              <HStack
                space={4}
                key={key}
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

LearnerDocsChecklist.propTypes = {
  userTokenInfo: PropTypes.object,
  footerLinks: PropTypes.array,
};
