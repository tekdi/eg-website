import ReactGA from 'react-ga4'

const AnalyticsPagesEnum = {
  // ENTITY_TYPE_OF_VIEW
  // CAMP_LIST or CAMP_FORM or CAMP_DETAILS_ADMIN
  BASIC_DETAILS: 'basic_Details',
  BENEFICIARY_LIST: 'beneficiary_list',
  BENEFICIARY_PROFILE: 'beneficiary_profile',
  BENEFICIARY: 'beneficiary',
  CAMP_DASHBOARD: 'camp_dashboard',
  CAMP: 'camp',
  CERTIFICATE: 'certificate',
  COMMUNITY_REFRENCE: 'community',
  DASHBOARD: 'dashboard',
  EPCP_LIST: 'epcp_list',
  EPCP: 'epcp',
  EXAM_PREPARATION: 'exam_preparation',
  FACILITATOR: 'facilitator',
  HOME: 'home',
  PROFILE: 'profile'
}

export default function GATrackPageView({ analyticsPageTitle }) {
  const page_title =
    analyticsPageTitle != undefined
      ? AnalyticsPagesEnum[analyticsPageTitle]
      : `not_set`

  ReactGA.send({
    hitType: 'pageview',
    page: page_title
  })
}
