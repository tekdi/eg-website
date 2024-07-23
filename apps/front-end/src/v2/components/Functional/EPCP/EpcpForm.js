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
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EpcpForm = ({ footerLinks, userTokenInfo: { authUser } }) => {
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [field, setField] = useState(null);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useLocation();
  const [learnerData, setLearnerData] = useState(user?.state);
  const [subjects, setSubjects] = useState();
  const [subjectList, setSubjectList] = useState([]);

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
    title: `${learnerData?.first_name} ${
      learnerData?.last_name
        ? `${learnerData?.middle_name || ""} ${learnerData?.last_name}`
        : ""
    } ${t("EPCP.TITLE")}`,
    properties: {
      HAS_LOGGED_RSOS_APP: {
        title: `${t("EPCP.HAS_LOGGED_RSOS_APP")}`,
        description: `EPCP.HAS_LOGGED_RSOS_APP.TITLE`,
        type: "string",
        direction: "row",
        format: "RadioBtn",
        enum: sortEnums("", 0),
        default: null,
      },
    },
    allOf: [
      {
        // if RSOS_APP is "YES" view all the options
        if: {
          properties: {
            HAS_LOGGED_RSOS_APP: {
              const: "YES",
            },
          },
        },
        then: {
          properties: {
            TOOK_EPCP_EXAM_ON_RSOS_APP: {
              title: `${t("EPCP.TOOK_EPCP_EXAM_ON_RSOS_APP")}`,
              description: "EPCP.TOOK_EPCP_EXAM_ON_RSOS_APP.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums("", 0),
              default: null,
            },
          },
        },
      },
      {
        // if RSOS_APP is "NO" hide all the options and view reason
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
              title: `${t("EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS")}`,
              description: "EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              format: "RadioBtn",
              direction: "column",
              enum: sortEnums("EPCP.HAS_LOGGED_RSOS_APP_NO_REASONS.", 1),
            },
          },
          required: ["HAS_LOGGED_RSOS_APP_NO_REASONS"],
        },
      },
      {
        // if RSOS_APP is "YES" and TOOK_EPCP_EXAM_ON_RSOS_APP is "NO" view test reasons below it
        // if RSOS_APP is "YES" and TOOK_EPCP_EXAM_ON_RSOS_APP is "YES" hide test reasons below it
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
              title: `${t("EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS")}`,
              description: "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.TITLE",
              type: "string",
              direction: "column",
              enum: sortEnums(
                "EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.",
                3
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
            selectSubject: {
              type: "string",
            },
            SELECTED_SUBJECT_BY_LEARNER: {
              minItems: 1,
              maxItems: 7,
              type: "array",
              items: {
                type: ["string", "number"],
                enum: subjects?.id,
                enumNames: subjects?.name,
              },
              uniqueItems: true,
            },
          },
          required: ["SELECTED_SUBJECT_BY_LEARNER"],
        },
      },
      {
        required: ["HAS_LOGGED_RSOS_APP", "TOOK_EPCP_EXAM_ON_RSOS_APP"],
      },
    ],
  };

  const uiSchema = {
    selectSubject: {
      "ui:widget": "selectSubjectWidget",
    },
    SELECTED_SUBJECT_BY_LEARNER: {
      "ui:widget": "checkboxes",
    },
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
          TOOK_EPCP_EXAM_ON_RSOS_APP: null,
          TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: null,
          SELECTED_SUBJECT_BY_LEARNER: null,
        });
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
          SELECTED_SUBJECT_BY_LEARNER: "",
        });
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
      !newFormData?.SELECTED_SUBJECT_BY_LEARNER
    ) {
      const newErrors = {
        SELECTED_SUBJECT_BY_LEARNER: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.HAS_LOGGED_RSOS_APP &&
      newFormData?.TOOK_EPCP_EXAM_ON_RSOS_APP === "YES" &&
      newFormData?.SELECTED_SUBJECT_BY_LEARNER
    ) {
      const filterformData = {
        ...newFormData,
        SELECTED_SUBJECT_BY_LEARNER: subjectList?.map((subject) => ({
          name: subject?.name,
          id: subject?.id,
          selected: newFormData.SELECTED_SUBJECT_BY_LEARNER.includes(
            subject?.id
          )
            ? "yes"
            : "no",
        })),
      };
      const payload = finalPayload(id, filterformData, data);
      PostData(payload);
    } else {
      const payload = finalPayload(id, formData, data);
      PostData(payload);
    }
  };

  const PostData = async (payload) => {
    const data = await ObservationService.postBulkData(payload);
    navigate("/camps/epcplearnerlist/");
  };

  const onSubmit = async () => {
    validation();
  };

  const getFieldResponseByTitle = (title) => {
    // Find the object in data array where fields title matches the given title
    const field = data?.find((item) => item.fields[0].title === title);
    if (title === "SELECTED_SUBJECT_BY_LEARNER") {
      const res = field?.field_responses?.[0]?.response_value || "[]";
      const subjectsArray = JSON.parse(res);
      const selectedIds = subjectsArray
        ?.filter((subject) => subject.selected === "yes")
        ?.map((subject) => subject.id);
      return selectedIds || "";
    } else {
      // If field is found, return its field_responses data, otherwise return null
      return field?.field_responses?.[0]?.response_value || "";
    }
  };

  useEffect(() => {
    let observation = "EPCP";
    const fetchData = async () => {
      const getSubject = await ObservationService.subjectList(id);
      setSubjectList(getSubject?.data?.subjectsArray);
      const filteredSubjects = getSubject?.data?.subjectsArray?.reduce(
        (acc, subject) => {
          acc.id.push(subject.id);
          acc.name.push(subject.name);
          return acc;
        },
        { id: [], name: [] }
      );
      setSubjects(filteredSubjects);
      const obj = {
        id: id,
        board_id: getSubject?.data?.subjectsArray?.[0]?.board_id,
        observation: observation,
      };
      const getData = await ObservationService.getSubmissionData(obj);

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

      TOOK_EPCP_EXAM_ON_RSOS_APP: getFieldResponseByTitle(
        "TOOK_EPCP_EXAM_ON_RSOS_APP"
      ),

      TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS: getFieldResponseByTitle(
        "TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS"
      )
        ? `EPCP.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.${getFieldResponseByTitle(
            "TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS"
          )}`
        : "",

      SELECTED_SUBJECT_BY_LEARNER: getFieldResponseByTitle(
        "SELECTED_SUBJECT_BY_LEARNER"
      ),
    });
    setLoading(false);
  }, [data]);

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser,
      }}
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"EPCP"}
      pageTitle={t("EPCP")}
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
            uiSchema,
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
            mt={"20px"}
          >
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </Box>
    </Layout>
  );
};

export default EpcpForm;
