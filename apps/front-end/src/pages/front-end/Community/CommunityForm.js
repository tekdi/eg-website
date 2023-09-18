import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Box, Button, HStack, Modal, VStack } from "native-base";

import { Layout } from "@shiksha/common-lib";

import { useNavigate, useParams } from "react-router-dom";

import {
  RadioBtn,
  CustomR,
} from "../../../../../front-end/src/component/BaseInput.js";
import { useTranslation } from "react-i18next";

export default function CommunityForm({ ip }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onPressBackButton = async () => {
    navigate(`/community/list`);
  };

  const uiSchema = {};

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("COMMUNITY_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        {page && page !== "" && (
          <Form
            key={lang}
            ref={formRef}
            widgets={{ RadioBtn, CustomR }}
            {...{
              validator,
              schema: schema ? schema : {},
              uiSchema,
            }}
          >
            <Button
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {t("SAVE")}
            </Button>
          </Form>
        )}
      </Box>
    </Layout>
  );
}
