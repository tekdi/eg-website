import {
  CardComponent,
  Layout,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { Box } from "native-base";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PcrView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = React.useState({});

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getPCRScores({ id });
    const userData = result?.data?.filter((item) => item.user_id == id);
    setData(userData[0]);
  }, []);

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "loginBtn", "langBtn", "userInfo"],

        name: t("PCR_DETAILS"),
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box p="10">
        <CardComponent
          {...(!data?.endline_learning_level
            ? { onEdit: (e) => navigate(`/beneficiary/${id}/pcrdetails`) }
            : {})}
          title={t("PCR_EDUCATION_LEVEL")}
          item={{
            ...data,
            baseline_learning_level:
              data?.baseline_learning_level?.toUpperCase(),
            endline_learning_level: data?.endline_learning_level?.toUpperCase(),
          }}
          label={[
            "PRIAMRY_LEVEL_EDUCATION",
            "EVALUATION_1",
            "EVALUATION_2",
            "FINAL_LEVEL_EDUCATION",
          ]}
          arr={[
            "baseline_learning_level",
            "rapid_assessment_first_learning_level",
            "rapid_assessment_second_learning_level",
            "endline_learning_level",
          ]}
        />
      </Box>
    </Layout>
  );
}
