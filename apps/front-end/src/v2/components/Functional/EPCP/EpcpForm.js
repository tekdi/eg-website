import React, { useState, useRef, useEffect } from "react";
import Form from "@rjsf/core";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "../../Static/FormBaseInput/FormBaseInput.js";

import { useTranslation } from "react-i18next";
import {
  FrontEndTypo,
  Layout,
  ObservationService,
  jsonParse,
} from "@shiksha/common-lib";
import { Box } from "native-base";
import { finalPayload } from "./Payload.js";
import { useNavigate, useParams } from "react-router-dom";

const EpcpForm = ({ footerLinks }) => {
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [field, setField] = useState(null);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();

  const onPressBackButton = () => {
    navigate(-1);
  };

  const sortEnums = (prefix, index) => {
    const Newdata = data?.[index]
      ? jsonParse(data?.[index]?.fields?.[0]?.enum)
      : [];
    const prefixedData = Newdata?.map((item) => prefix + item);

    return prefixedData;
  };

  const schema = {
    type: "object",
    title: `EPCP.TITLE`,
    properties: {
      HAS_LOGGED_RSOS_APP: {
        label: `EPCP.HAS_LOGGED_RSOS_APP.TITLE`,
        type: "string",
        direction: "row",
        format: "RadioBtn",
        enum: sortEnums("", 0),
        default: null,
      },
    },
    allOf: [
      {
        // if  RSOS_APP is "YES" view all the options
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
          },
        },
        then: {
          properties: {
            STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP: {
              label: "EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums("", 0),
              default: null,
            },
            STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: {},
            TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: {
              label: "EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums("", 0),
              default: null,
            },
            TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: {},
            TOOK_EPCP_EXAM_ON_RSOS_APP: {
              label: "EPCP.TOOK_EPCP_EXAM_ON_RSOS_APP.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums("", 0),
              default: null,
            },
            TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: {},
          },
        },
      },
      // if  RSOS_APP is "no" hide all the options and view reason
      {
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "NO",
            },
          },
        },
        then: {
          properties: {
            HAS_LOGGED_RSOS_APP_NO_REASONS: {
              label: "EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              format: "RadioBtn",
              enum: sortEnums("EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS.", 1),
            },
          },
          required: ["HAS_LOGGED_RSOS_APP_NO_REASONS"],
        },
      },
      // if  RSOS_APP is "YES" and STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP is "no" view video reasons below it.
      // if  RSOS_APP is "YES" and STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP is "YES" hide video reasons below it.
      {
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
            STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP: {
              const: "NO",
            },
          },
        },
        then: {
          properties: {
            STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: {
              format: "RadioBtn",
              label:
                "EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.",
                3
              ),
            },
          },
          required: ["HAS_LOGGED_RSOS_APP_NO_REASONS"],
        },
        else: {
          properties: {
            STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: {
              format: "hidden",
              label:
                "EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.",
                3
              ),
            },
          },
        },
      },
      // if  RSOS_APP is "Yes" and TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION is "no" view test reasons below it.
      // if  RSOS_APP is "Yes" and TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION is "yes" hide test reasons below it.
      {
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
            TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: {
              const: "NO",
            },
          },
        },
        then: {
          properties: {
            TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: {
              format: "RadioBtn",
              label:
                "EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.",
                5
              ),
            },
          },
        },
        else: {
          properties: {
            TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: {
              format: "hidden",
              label:
                "EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.",
                5
              ),
            },
          },
        },
      },
      // if  RSOS_APP is "YES" and TOOK_EPCP_EXAM_ON_RSOS_APP is "no" view test reasons below it.
      // if  RSOS_APP is "YES" and TOOK_EPCP_EXAM_ON_RSOS_APP is "YES" hide test reasons below it.
      {
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
            TOOK_EPCP_EXAM_ON_RSOS_APP: {
              const: "NO",
            },
          },
        },
        then: {
          properties: {
            TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: {
              format: "RadioBtn",
              label: "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.",
                7
              ),
            },
          },
        },
        else: {
          properties: {
            TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: {
              format: "hidden",
              label: "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              enum: sortEnums(
                "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.",
                7
              ),
            },
          },
        },
      },
      {
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
            TOOK_EPCP_EXAM_ON_RSOS_APP: {
              const: "YES",
            },
          },
        },
        then: {
          properties: {
            RSOS_DOCUMENT_IMAGE: {
              label: "EPCP.RSOS_DOCUMENT_IMAGE.TITLE",
              document_type: "epcp",
              type: ["string", "number"],
              format: "FileUpload",
            },
          },
          required: ["RSOS_DOCUMENT_IMAGE"],
        },
      },

      {
        required: [
          "HAS_LOGGED_RSOS_APP",
          "TOOK_EPCP_EXAM_ON_RSOS_APP",
          "STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP",
          "TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION",
        ],
      },
    ],
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    if (id === "root_HAS_LOGGED_RSOS_APP") {
      if (data?.HAS_LOGGED_RSOS_APP === "YES") {
        setFormData({
          ...newData,

          HAS_LOGGED_RSOS_APP_NO_REASONS: "",
        });
      } else if (data?.HAS_LOGGED_RSOS_APP === "NO") {
        setFormData({
          ...newData,
          STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP: null,
          TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: null,
          TOOK_EPCP_EXAM_ON_RSOS_APP: null,
          TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: null,
          TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: null,
          STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: null,
          RSOS_DOCUMENT_IMAGE: null,
        });
      }
    } else if (id === "root_STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP") {
      if (
        data?.HAS_LOGGED_RSOS_APP === "YES" &&
        data?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP === "YES"
      ) {
        setFormData({
          ...newData,
          STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: "",
        });
      } else {
        setFormData(newData);
      }
    } else if (id === "root_TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION") {
      if (
        data?.HAS_LOGGED_RSOS_APP === "YES" &&
        data?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION === "YES"
      ) {
        setFormData({
          ...newData,
          TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: "",
        });
      } else {
        setFormData(newData);
      }
    } else if (id === "root_TOOK_EPCP_EXAM_ON_RSOS_APP") {
      if (
        data?.TOOK_EPCP_EXAM_ON_RSOS_APP === "YES" &&
        data?.HAS_LOGGED_RSOS_APP === "YES"
      ) {
        setFormData({
          ...newData,
          TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: "",
        });
      } else if (
        data?.TOOK_EPCP_EXAM_ON_RSOS_APP === "NO" &&
        data?.HAS_LOGGED_RSOS_APP === "YES"
      ) {
        setFormData({
          ...newData,
          RSOS_DOCUMENT_IMAGE: "",
        });
      } else {
        setFormData(newData);
      }
    } else {
      setFormData(newData);
    }
  };

  const validation = () => {
    let newFormData = formData;
    if (!newFormData?.HAS_LOGGED_RSOS_APP) {
      const newErrors = {
        HAS_LOGGED_RSOS_APP: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP === "NO" &&
      !newFormData?.HAS_LOGGED_RSOS_APP_NO_REASONS
    ) {
      const newErrors = {
        HAS_LOGGED_RSOS_APP_NO_REASONS: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP === "YES" &&
      !newFormData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP &&
      !newFormData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION &&
      !newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP
    ) {
      const newErrors = {
        STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
        TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
        TOOK_EPCP_EXAM_ON_RSOS_APP: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP === "NO" &&
      !newFormData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS
    ) {
      const newErrors = {
        STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP &&
      !newFormData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION &&
      !newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP
    ) {
      const newErrors = {
        TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
        TOOK_EPCP_EXAM_ON_RSOS_APP: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION === "NO" &&
      !newFormData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS
    ) {
      const newErrors = {
        TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION &&
      !newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP
    ) {
      const newErrors = {
        TOOK_EPCP_EXAM_ON_RSOS_APP: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP === "NO" &&
      !newFormData?.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS
    ) {
      const newErrors = {
        TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP === "YES" &&
      !newFormData?.RSOS_DOCUMENT_IMAGE
    ) {
      const newErrors = {
        RSOS_DOCUMENT_IMAGE: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else {
      const payload = finalPayload(id, formData, data);
      PostData(payload);
      navigate("/camps/EpcpLearnerList/");
    }
  };

  const PostData = async (payload) => {
    const data = await ObservationService.postBulkData(payload);
  };

  const onSubmit = async () => {
    validation();
  };

  const getFieldResponseByTitle = (title) => {
    // Find the object in data array where fields title matches the given title
    const field = data.find((item) => item.fields[0].title === title);
    // If field is found, return its field_responses data, otherwise return null
    return field?.field_responses?.[0]?.response_value || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      const getData = await ObservationService.getSubmissionData(id);
      setData(getData?.data?.[0]?.observation_fields);
    };
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setFormData({
      ...formData,

      HAS_LOGGED_RSOS_APP: getFieldResponseByTitle("HAS_LOGGED_RSOS_APP"),
      HAS_LOGGED_RSOS_APP_NO_REASONS: getFieldResponseByTitle(
        "HAS_LOGGED_RSOS_APP_NO_REASONS"
      )
        ? `EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS.${getFieldResponseByTitle(
            "HAS_LOGGED_RSOS_APP_NO_REASONS"
          )}`
        : "",
      STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP: getFieldResponseByTitle(
        "STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP"
      ),
      TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION: getFieldResponseByTitle(
        "TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION"
      ),
      TOOK_EPCP_EXAM_ON_RSOS_APP: getFieldResponseByTitle(
        "TOOK_EPCP_EXAM_ON_RSOS_APP"
      ),

      STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS:
        getFieldResponseByTitle(
          "STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS"
        )
          ? `EPCP.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.${getFieldResponseByTitle(
              "STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS"
            )}`
          : "",
      TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS:
        getFieldResponseByTitle(
          "TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS"
        )
          ? `EPCP.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.${getFieldResponseByTitle(
              "TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS"
            )}`
          : "",
      TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: getFieldResponseByTitle(
        "TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS"
      )
        ? `EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.${getFieldResponseByTitle(
            "TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS"
          )}`
        : "",

      RSOS_DOCUMENT_IMAGE: getFieldResponseByTitle("RSOS_DOCUMENT_IMAGE"),
    });
    setLoading(false);
  }, [data]);

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <Box p={4}>
        <Form
          key={schema}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            widgets,
            templates,
            validator,
            schema: schema || {},
            //uiSchema,
            formData,
            onChange,
            onSubmit,
            onError,
            transformErrors: (errors) => transformErrors(errors, schema, t),
          }}
        >
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            type="submit"
            onPress={() => onSubmit()}
          >
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </Box>
    </Layout>
  );
};

export default EpcpForm;
