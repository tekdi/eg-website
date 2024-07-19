import ReactGA from 'react-ga4'

const AnalyticsPagesEnum = {
  // ENTITY_TYPE_OF_VIEW
  // CAMP_LIST or CAMP_FORM or CAMP_DETAILS_ADMIN
  BASIC_DETAILS: 'basic_Details',
  BENEFICIARY_LIST: 'beneficiary_list',
  BENEFICIARY_PROFILE: 'beneficiary_profile',
  BENEFICIARY: 'beneficiary',
  BENEFICIARY_AADHAAR_DETAILS: 'beneficiary_aadhaar_details',
  BENEFICIARY_ADDRESS_DETAILS: 'beneficiary_address_details',
  BENEFICIARY_ADDRESS_EDIT: 'beneficiary_address_edit',
  BENEFICIARY_ADDRESS_FORM: 'beneficiary_address_form',
  BENEFICIARY_BASIC_DETAILS: 'beneficiary_basic_details',
  BENEFICIARY_EDUCATION_DETAILS: 'beneficiary_education_details',
  BENEFICIARY_EDUCATION_FORM: 'beneficiary_education_form',
  BENEFICIARY_FUTURE_DETAILS: 'beneficiary_future_details',
  BENEFICIARY_ENROLLMENT_DETAILS: 'beneficiary_enrollment_details',
  BENEFICIARY_ENROLLMENT_FORM: 'beneficiary_enrollment_form',
  BENEFICIARY_FAMILY_DETAILS: 'beneficiary_family_details',
  BENEFICIARY_PERSONAL_DETAILS: 'beneficiary_personal_details',
  BENEFICIARY_JOURNEY: 'beneficiary_journey',
  BENEFICIARY_DOCUMENT_CHECKLIST: 'beneficiary_document_checkList',
  BENEFICIARY_PCR_DETAILS: 'beneficiary_pcr_details',
  BENEFICIARY_CONTACT_DETAILS: 'beneficiary_contact_details',
  BENEFICIARY_PCR_VIEW: 'beneficiary_pcr_view',
  BENEFICIARY_REFERENCE_DETAILS: 'beneficiary_reference_details',
  BENEFICIARY_ONBOADING: 'beneficiary_onboarding',
  CAMP_SESSION_LIST: 'camp_session_list',
  FACILITATOR_ONBOADING: 'facilitator_onboarding',
  CAMP_DASHBOARD: 'camp_dashboard',
  CAMP_REGISTRATION: 'camp_registration',
  CAMP_SELECT_LREARNER: 'camp_select_learners',
  CAMP_SETTINGS: 'camp_settings',
  CAMP_LEARNER_ATTENDANCE: 'camp_learner_attendance',
  CAMP_FACILITATOR_ATTENDANCE: 'camp_facilitator_attendance',
  CAMP_KIT_MATERIAL: 'camp_kit_material',
  CAMP: 'camp',
  CAMP_EXECUTION: 'camp_execution',
  CAMP_OTHERPLANS: 'camp_otherplans',
  CAMP_ACTIVITIES: 'camp_activities',
  CONSENT_FORM: 'camp_learner_consent',
  CERTIFICATE: 'certificate',
  COMMUNITY_REFRENCE: 'community',
  DASHBOARD: 'dashboard',
  EPCP_LIST: 'epcp_list',
  EPCP: 'epcp',
  EXAM_PREPARATION_FORM: 'exam_preparation_form',
  EXAM_PREPARATION: 'exam_preparation',
  FACILITATOR: 'facilitator',
  HOME: 'home',
  PROFILE: 'profile',
  LEARNERS_OVERVIEW: 'learners_overview',
  FACILITATOR_AADHAAR: 'aadhaar_details',
  FACILITATOR_CERTIFICATE: 'facilitator_certificate',
  FACILITATOR_BASIC_DETAILS: 'facilitator_basic_details',
  FACILITATOR_PROFILE: 'facilitator_profile',
  VOLUNTEER_PROFILE: 'volunteer_profile',
  LOGIN: 'login'
}

export default function GATrackPageView({ analyticsPageTitle }) {
  const page_title =
    analyticsPageTitle != undefined
      ? AnalyticsPagesEnum[analyticsPageTitle]
      : `not_set`

  ReactGA.send({
    hitType: 'pageview',
    title: page_title
  })
}
