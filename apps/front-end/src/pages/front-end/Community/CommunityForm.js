import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Box, Button } from "native-base";
import { Layout } from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  RadioBtn,
  CustomR,
} from "../../../../../front-end/src/component/BaseInput.js";
import { useTranslation } from "react-i18next";

export default function CommunityForm({ ip }) {
  const [schema, setSchema] = React.useState({});
  const formRef = React.useRef();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onPressBackButton = async () => {
    navigate(`/community/list`);
  };

  const uiSchema = {};

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties.properties;
      const newSteps = Object.keys(properties);
      setSchema(properties[newSteps[0]]);
    }
  }, []);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("COMMUNITY_DETAILS"),
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        <Form
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
      </Box>
    </Layout>
  );
}
