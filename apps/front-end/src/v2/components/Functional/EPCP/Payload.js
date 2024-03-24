export function finalPayload(id, formData, field) {
  const payload = [
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 1,
      observation_fields_id: "",
      response_value: formData?.HAS_LOGGED_RSOS_APP || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 2,
      observation_fields_id: "",
      response_value:
        formData?.HAS_LOGGED_RSOS_APP === "YES"
          ? ""
          : formData?.HAS_LOGGED_RSOS_APP_NO_REASONS.split(".")[
              formData?.HAS_LOGGED_RSOS_APP_NO_REASONS.split(".").length - 1
            ] || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 3,
      observation_fields_id: "",
      response_value: formData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 4,
      observation_fields_id: "",
      response_value:
        formData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS
          ? formData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.split(
              "."
            )[
              formData?.STUDY_THROUGH_VIDEOS_EBOOKS_ON_RSOS_APP_NO_REASONS.split(
                "."
              ).length - 1
            ]
          : "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 5,
      observation_fields_id: "",
      response_value: formData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 6,
      observation_fields_id: "",
      response_value:
        formData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS
          ? formData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.split(
              "."
            )[
              formData?.TAKING_PRACTICE_TESTS_ON_RSOS_APPLICATION_NO_REASONS.split(
                "."
              ).length - 1
            ]
          : "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 7,
      observation_fields_id: "",
      response_value: formData?.TOOK_EPCP_EXAM_ON_RSOS_APP || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 8,
      observation_fields_id: "",
      response_value: formData?.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS
        ? formData?.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.split(".")[
            formData?.TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS.split(".").length -
              1
          ]
        : "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 9,
      observation_fields_id: "",
      response_value: formData?.RSOS_DOCUMENT_IMAGE || "",
    },
  ];

  const updatedPayload = payload
    .map((payloadItem) => {
      const correspondingField = field.find(
        (fieldItem) => fieldItem.fields_sequence === payloadItem.fields_sequence
      );

      if (correspondingField) {
        return {
          ...payloadItem,
          field_id: correspondingField.field_id,
          observation_fields_id: correspondingField.id,
        };
      } else {
        return payloadItem;
      }
    })
    .map(({ fields_sequence, ...rest }) => rest);

  return updatedPayload;
}
