export function finalPayload(id, formData, field) {
  const payload = [
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "HAS_LOGGED_RSOS_APP",
      observation_fields_id: "",
      response_value: formData?.HAS_LOGGED_RSOS_APP || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "HAS_LOGGED_RSOS_APP_NO_REASONS",
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
      field_name: "TOOK_EPCP_EXAM_ON_RSOS_APP",
      observation_fields_id: "",
      response_value: formData?.TOOK_EPCP_EXAM_ON_RSOS_APP || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "TOOK_E_PCP_EXAM_ON_RSOS_APP_NO_REASONS",
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
      field_name: "SELECTED_SUBJECT_BY_LEARNER",
      observation_fields_id: "",
      response_value:
        formData?.TOOK_EPCP_EXAM_ON_RSOS_APP === "YES"
          ? JSON.stringify(formData?.SELECTED_SUBJECT_BY_LEARNER).replace(
              /"/g,
              '\\"'
            )
          : "",
    },
  ];

  const updatedPayload = payload
    .map((payloadItem) => {
      const correspondingField = field.find(
        (fieldItem) => fieldItem.fields?.[0].title === payloadItem.field_name
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
    .map(({ field_name, ...rest }) => rest);

  return updatedPayload;
}
