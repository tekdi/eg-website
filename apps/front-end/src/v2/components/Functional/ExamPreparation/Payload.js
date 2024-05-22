export function finalPayload(id, formData, field) {
  const payload = [
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 1,
      observation_fields_id: "",
      response_value: formData?.WILL_LEARNER_APPEAR_FOR_EXAM || "",
    },
    {
      observation_id: field?.[0]?.observation_id,
      context: "users",
      context_id: parseInt(id),
      field_id: "",
      fields_sequence: 2,
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
      fields_sequence: 5,
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
      fields_sequence: 3,
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
      fields_sequence: 4,
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
    //   fields_sequence: 15,
    //   observation_fields_id: "",
    //   response_value: formData?.LEARNER_RECEIVED_EXAM_TIME_TABLE || "",
    // },
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
