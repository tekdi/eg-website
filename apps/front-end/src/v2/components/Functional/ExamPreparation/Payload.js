export function finalPayload(id, formData, field) {
  const payload = [
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "WILL_LEARNER_APPEAR_FOR_EXAM",
      observation_fields_id: "",
      response_value: formData?.WILL_LEARNER_APPEAR_FOR_EXAM || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS",
      observation_fields_id: "",
      response_value:
        formData?.WILL_LEARNER_APPEAR_FOR_EXAM === "YES"
          ? ""
          : formData?.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS.split(".")[
              formData?.WILL_LEARNER_APPEAR_FOR_EXAM_NO_REASONS.split(".")
                .length - 1
            ],
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "DID_LEARNER_RECEIVE_ADMIT_CARD",
      observation_fields_id: "",
      response_value: formData?.DID_LEARNER_RECEIVE_ADMIT_CARD
        ? formData?.DID_LEARNER_RECEIVE_ADMIT_CARD.split(".")[
            formData?.DID_LEARNER_RECEIVE_ADMIT_CARD.split(".").length - 1
          ]
        : "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "HAS_LEARNER_PREPARED_PRACTICAL_FILE",
      observation_fields_id: "",
      response_value: formData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE
        ? formData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE.split(".")[
            formData?.HAS_LEARNER_PREPARED_PRACTICAL_FILE.split(".").length - 1
          ]
        : "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      field_name: "LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER",
      observation_fields_id: "",
      response_value: formData?.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER
        ? formData?.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.split(".")[
            formData?.LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.split(".")
              .length - 1
          ]
        : "",
    },
    // {
    //   observation_id: field?.[0]?.observation_id,
    //   context: "users",
    //   context_id: parseInt(id),
    //   field_id: "",
    //   field_name: "LEARNER_RECEIVED_EXAM_TIME_TABLE",
    //   observation_fields_id: "",
    //   response_value: formData?.LEARNER_RECEIVED_EXAM_TIME_TABLE || "",
    // },
  ];

  const updatedPayload = payload
    .map((payloadItem) => {
      const { field_name, ...otherData } = payloadItem;
      const correspondingField = field.find(
        (fieldItem) => fieldItem.fields?.[0].title === field_name
      );
      if (correspondingField) {
        return {
          ...otherData,
          field_id: parseInt(correspondingField.field_id),
          observation_fields_id: parseInt(correspondingField.id),
        };
      } else {
        return otherData;
      }
    })
    .map(({ fields_sequence, ...rest }) => rest);

  return updatedPayload;
}
