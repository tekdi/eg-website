import {
  CardComponent,
  GetEnumValue,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { Box } from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PcrView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [enumOptions, setEnumOptions] = useState({});

  useEffect(async () => {
    const result = await benificiaryRegistoryService.getPCRScores({ id });
    const enumData = await enumRegistryService.listOfEnum();
    setEnumOptions(enumData?.data ? enumData?.data : {});
    const userData = Array.isArray(result?.data)
      ? result.data.filter((item) => item.user_id == id)
      : [];
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
      analyticsPageTitle={"BENEFICIARY_PCR_VIEW"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("PCR_DETAILS")}
    >
      <Box p="10">
        <CardComponent
          // {...(!data?.endline_learning_level
          //   ? { onEdit: (e) => navigate(`/beneficiary/${id}/pcrdetails`) }
          //   : {})}
          {...{ onEdit: (e) => navigate(`/beneficiary/${id}/pcrdetails`) }}
          title={t("PCR_EDUCATION_LEVEL")}
          item={{
            ...data,
            baseline_learning_level: data?.baseline_learning_level ? (
              <GetEnumValue
                t={t}
                enumType={"PCR_SCORES_BASELINE_AND_ENDLINE"}
                enumOptionValue={data?.baseline_learning_level}
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),
            // endline_learning_level: data?.endline_learning_level?.toUpperCase(),
            rapid_assessment_first_learning_level:
              data?.rapid_assessment_first_learning_level ? (
                <GetEnumValue
                  t={t}
                  enumType={"PCR_SCORES_RAPID_QUESTION"}
                  enumOptionValue={data?.rapid_assessment_first_learning_level}
                  enumApiData={enumOptions}
                />
              ) : (
                "-"
              ),
          }}
          label={[
            "PRIAMRY_LEVEL_EDUCATION",
            "EVALUATION_1",
            // "EVALUATION_2",
            // "FINAL_LEVEL_EDUCATION",
          ]}
          arr={[
            "baseline_learning_level",
            "rapid_assessment_first_learning_level",
            // "rapid_assessment_second_learning_level",
            // "endline_learning_level",
          ]}
        />
      </Box>
    </Layout>
  );
}
