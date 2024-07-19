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
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useLocation();
  const [learnerData, setLearnertData] = useState(user?.state);
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
    properties: {
      WILL_LEARNER_APPEAR_FOR_EXAM: {
        description: `${t(
          "EXAM_PREPARATION.WILL_LEARNER_APPEAR_FOR_EXAM.TITLE1"
        )} ${learnerData?.first_name} ${
          learnerData?.last_name
            ? `${learnerData?.middle_name || ""} ${learnerData?.last_name}`
            : ""
        } ${t("EXAM_PREPARATION.WILL_LEARNER_APPEAR_FOR_EXAM.TITLE2")}`,
        type: "string",
        direction: "row",
        format: "RadioBtn",
        enum: sortEnums("", 0),
        default: null,
      },
    },
    allOf: [
      {
        // if  WILL_LEARNER_APPEAR_FOR_EXAM is "YES" view all the options
        if: {
          properties: {
            WILL_LEARNER_APPEAR_FOR_EXAM: {
              const: "YES",
            },
          },
        },
        then: {
          properties: {
            HAS_LEARNER_PREPARED_PRACTICAL_FILE: {
              description:
                "EXAM_PREPARATION.HAS_LEARNER_PREPARED_PRACTICAL_FILE.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums(
                "EXAM_PREPARATION.HAS_LEARNER_PREPARED_PRACTICAL_FILE.",
                2
              ),
              default: null,
            },
            LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER: {
              description:
                "EXAM_PREPARATION.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.TITLE",
              type: ["string", "null"],
              direction: "column",
              format: "RadioBtn",
              enum: sortEnums(
                "EXAM_PREPARATION.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.",
                1
              ),
              default: null,
            },
            DID_LEARNER_RECEIVE_ADMIT_CARD: {
              description:
                "EXAM_PREPARATION.DID_LEARNER_RECEIVE_ADMIT_CARD.TITLE",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: sortEnums(
                "EXAM_PREPARATION.DID_LEARNER_RECEIVE_ADMIT_CARD.",
                2
              ),
              default: null,
            },
            // LEARNER_RECEIVED_EXAM_TIME_TABLE: {
            //   label: "EXAM_PREPARATION.LEARNER_RECEIVED_EXAM_TIME_TABLE.TITLE",
            //   type: ["string", "null"],
            //   direction: "row",
            //   format: "RadioBtn",
            //   enum: sortEnums("", 0),
            //   default: null,
            // },
          },
        },
      },
      // if  WILL_LEARNER_APPEAR_FOR_EXAM is "no" hide all the options and view reason
      {
        if: {
          properties: {
            WILL_LEARNER_APPEAR_FOR_EXAM: {
              const: "NO",
            },
          },
        },
        then: {
          properties: {
            WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS: {
              description:
                "EXAM_PREPARATION.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS.TITLE",
              type: "string",
              format: "RadioBtn",
              enum: sortEnums(
                "EXAM_PREPARATION.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS.",
                4
              ),
            },
          },
          required: ["WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS"],
        },
      },

      {
        required: [
          "WILL_LEARNER_APPEAR_FOR_EXAM",
          "DID_LEARNER_RECEIVE_ADMIT_CARD",
          "HAS_LEARNER_PREPARED_PRACTICAL_FILE",
          "LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER",
        ],
      },
    ],
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    if (id === "root_WILL_LEARNER_APPEAR_FOR_EXAM") {
      if (data?.WILL_LEARNER_APPEAR_FOR_EXAM === "YES") {
        setFormData({
          ...newData,
          WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS: "",
        });
      } else if (data?.WILL_LEARNER_APPEAR_FOR_EXAM === "NO") {
        setFormData({
          ...newData,
          DID_LEARNER_RECEIVE_ADMIT_CARD: null,
          HAS_LEARNER_PREPARED_PRACTICAL_FILE: null,
          LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER: null,
          // LEARNER_RECEIVED_EXAM_TIME_TABLE: null,
        });
      }
    } else {
      setFormData(newData);
    }
  };

  const validation = () => {
    let newFormData = formData;
    if (!newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM) {
      const newErrors = {
        WILL_LEARNER_APPEAR_FOR_EXAM: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM === "NO" &&
      !newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS
    ) {
      const newErrors = {
        WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM === "YES" &&
      !newFormData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE
    ) {
      const newErrors = {
        HAS_LEARNER_PREPARED_PRACTICAL_FILE: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM &&
      newFormData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE &&
      !newFormData?.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER
    ) {
      const newErrors = {
        LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else if (
      newFormData?.WILL_LEARNER_APPEAR_FOR_EXAM &&
      newFormData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE &&
      newFormData?.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER &&
      !newFormData?.DID_LEARNER_RECEIVE_ADMIT_CARD
    ) {
      const newErrors = {
        DID_LEARNER_RECEIVE_ADMIT_CARD: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    } else {
      const payload = finalPayload(id, formData, data);
      PostData(payload);
      navigate("/camps/exampreparation");
    }
  };

  const PostData = async (payload) => {
    await ObservationService.postBulkData(payload);
  };

  const onSubmit = async () => {
    validation();
  };

  const getFieldResponseByTitle = (title) => {
    // Find the object in data array where fields title matches the given title
    const field = data?.find((item) => item.fields[0].title === title);
    // If field is found, return its field_responses data, otherwise return null
    return field?.field_responses?.[0]?.response_value || "";
  };

  useEffect(() => {
    setLoading(true);
    let observation = "EXAM_PREPARATION";
    const fetchData = async () => {
      const getData = await ObservationService.getSubmissionData(
        id,
        observation
      );
      setData(getData?.data?.[0]?.observation_fields);
    };
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setFormData({
      ...formData,

      WILL_LEARNER_APPEAR_FOR_EXAM: getFieldResponseByTitle(
        "WILL_LEARNER_APPEAR_FOR_EXAM"
      ),
      WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS: getFieldResponseByTitle(
        "WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS"
      )
        ? `EXAM_PREPARATION.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS.${getFieldResponseByTitle(
            "WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS"
          )}`
        : "",
      DID_LEARNER_RECEIVE_ADMIT_CARD: getFieldResponseByTitle(
        "DID_LEARNER_RECEIVE_ADMIT_CARD"
      )
        ? `EXAM_PREPARATION.DID_LEARNER_RECEIVE_ADMIT_CARD.${getFieldResponseByTitle(
            "DID_LEARNER_RECEIVE_ADMIT_CARD"
          )}`
        : "",
      HAS_LEARNER_PREPARED_PRACTICAL_FILE: getFieldResponseByTitle(
        "HAS_LEARNER_PREPARED_PRACTICAL_FILE"
      )
        ? `EXAM_PREPARATION.HAS_LEARNER_PREPARED_PRACTICAL_FILE.${getFieldResponseByTitle(
            "HAS_LEARNER_PREPARED_PRACTICAL_FILE"
          )}`
        : "",
      LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER: getFieldResponseByTitle(
        "LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER"
      )
        ? `EXAM_PREPARATION.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.${getFieldResponseByTitle(
            "LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER"
          )}`
        : "",

      // LEARNER_RECEIVED_EXAM_TIME_TABLE: getFieldResponseByTitle(
      //   "LEARNER_RECEIVED_EXAM_TIME_TABLE"
      // ),
    });
    setLoading(false);
  }, [data]);

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"EXAM_PREPARATION_FORM"}
      pageTitle={t("CAMP_EXAM_PREPARATION")}
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
