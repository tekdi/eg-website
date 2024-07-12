import { jsonParse } from "@shiksha/common-lib";

export const payload = async ({ formData, org_id, acadamic, program }) => {
  let programSelected = jsonParse(localStorage.getItem("program"));
  const removeEmpty = (obj) => {
    return Object.entries(obj)
      .filter(([_, v]) => v != null && v !== undefined)
      .reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]:
            v && typeof v === "object" && !Array.isArray(v)
              ? removeEmpty(v)
              : v,
        }),
        {}
      );
  };

  const payload = {
    role_fields: {
      facilitator_id: formData?.role_fields?.facilitator_id,
      program_id: parseInt(program?.program_id),
      academic_year_id: acadamic?.academic_year_id,
      org_id: org_id,
    },
    role: "beneficiary",
    first_name: formData?.first_name,
    middle_name: formData?.middle_name || null,
    last_name: formData?.last_name || null,
    career_aspiration: formData?.career_aspiration,
    dob: formData?.dob,
    mobile: formData?.mobile,
    alternative_mobile_number: formData?.alternative_mobile_number || null,
    email_id: formData?.email_id || null,
    state: programSelected?.state_name,
    district: formData?.district,
    block: formData?.block,
    village: formData?.village,
    grampanchayat: formData?.grampanchayat,
    pincode: formData?.pincode || null,
    lat: formData?.lat,
    long: formData?.long,
    address: formData?.address || null,

    core_beneficiaries: {
      mark_as_whatsapp_number: formData?.mark_as_whatsapp_number,
      device_type: formData?.device_type,
      device_ownership: formData?.device_ownership,
      career_aspiration_details: formData?.career_aspiration_details || null,
      career_aspiration: formData?.career_aspiration,
      previous_school_type: formData?.previous_school_type,
      last_standard_of_education: formData?.last_standard_of_education,
      reason_of_leaving_education: formData?.reason_of_leaving_education,
      last_standard_of_education_year:
        formData?.last_standard_of_education_year,
      type_of_learner: formData?.type_of_learner,
      father_first_name: formData?.father_first_name,
      father_last_name: formData?.father_last_name || null,
      mother_first_name: formData?.mother_first_name,
      mother_last_name: formData?.mother_last_name || null,
      father_middle_name: formData?.father_middle_name || null,
      mother_middle_name: formData?.mother_middle_name || null,
      parent_support: formData?.parent_support,
      education_10th_date: formData?.education_10th_date || null,
      education_10th_exam_year: formData?.education_10th_exam_year || null,
    },

    program_beneficiaries: {
      learning_motivation: formData?.learning_motivation,
      type_of_support_needed: formData?.type_of_support_needed,
      learning_level: formData?.learning_level,
    },
    extended_users: {
      marital_status: formData?.marital_status,
      social_category: formData?.social_category,
    },
  };

  // const mainPayload = removeEmpty(payload); // uncomment and return it if do not want to send null undefined data.

  return payload;
};
