export const LABEL_NAMES = [
  {
    title: "PROFILE_PHOTO",
    path: "/beneficiary/:id/upload/upload_no",
    keys: {
      profile_photo_1: "PROFILE_PHOTO_1",
      profile_photo_2: "PROFILE_PHOTO_2",
      profile_photo_3: "PROFILE_PHOTO_3",
    },
  },
  {
    title: "BASIC_DETAILS",
    path: "/beneficiary/edit/:id/basic-info",
    keys: {
      first_name: "FIRST_NAME",
      dob: "DATE_OF_BIRTH",
    },
  },
  {
    title: "CONTACT_DETAILS",
    path: "/beneficiary/edit/:id/contact-info",
    keys: {
      mobile: "MOBILE_NUMBER",
      mark_as_whatsapp_number: "MARK_AS_WHATSAPP_REGISTER",
      device_type: "TYPE_OF_MOBILE_PHONE",
      device_ownership: "DEVICE_OWNERSHIP",
    },
  },
  {
    title: "FAMILY_DETAILS",
    path: "/beneficiary/edit/:id/family-details",
    keys: {
      father_first_name: "FATHER_FIRST_NAME",
      mother_first_name: "MOTHER_FIRST_NAME",
    },
  },
  {
    title: "PERSONAL_DETAILS",
    path: "/beneficiary/edit/:id/personal-details",
    keys: {
      marital_status: "MARITAL_STATUS",
      social_category: "SOCIAL_CATEGORY",
    },
  },
  {
    title: "BENEFICIARY_DISABILITY_DETAILS",
    path: "/beneficiary/edit/:id/disability-details",
    keys: {
      has_disability: "BENEFICIARY_HAS_DISABILITY",
    },
  },
  {
    title: "REFERENCE_DETAILS",
    path: "/beneficiary/edit/:id/reference-details",
    keys: {
      "references details": "REFERENCE_DETAILS",
    },
  },

  {
    title: "ADDRESS_DETAILS",
    path: "/beneficiary/edit/:id/address",
    keys: {
      lat: "LATITUDE",
      long: "LONGITUDE",
      district: "DISTRICT",
      block: "BLOCK",
      village: "VILLAGE_WARD",
      grampanchayat: "GRAMPANCHAYAT",
    },
  },
  {
    title: "LEARNER_ASPIRATION",
    path: "/beneficiary/edit/:id/future-education",
    keys: {
      type_of_support_needed: "TYPE_OF_SUPPORT_NEEDED",
      parent_support: "WILL_YOUR_PARENTS_SUPPORT_YOUR_STUDIES",
      career_aspiration: "CAREER_ASPIRATION",
      education_10th_exam_year: "REGISTERED_IN_TENTH_DATE",
    },
  },
  {
    title: "EDUCATION_DETAILS",
    path: "/beneficiary/edit/:id/education",
    keys: {
      type_of_learner: "TYPE_OF_LEARNER",
      last_standard_of_education: "LAST_STANDARD_OF_EDUCATION",
      last_standard_of_education_year: "LAST_YEAR_OF_EDUCATION",
      reason_of_leaving_education: "REASON_OF_LEAVING_EDUCATION",
      previous_school_type: "PREVIOUS_SCHOOL_TYPE",
      learning_level: "WHAT_IS_THE_LEARNING_LEVEL_OF_THE_LEARNER",
    },
  },
];
