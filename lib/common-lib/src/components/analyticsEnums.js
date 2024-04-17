import ReactGA from 'react-ga4'

const AnalyticsEnums = {
  HOME: 'Home',
  BENEFICIARY: 'Beneficiary',
  DASHBOARD: 'Dashboard',
  FACILITATOR: 'Facilitator',
  PROFILE: 'Profile',
  BASIC_DETAILS: 'Basic Details',
  CERTIFICATE: 'Certificate',
  BENEFICIARY_LIST: 'Beneficiary List',
  COMMUNITY_REFRENCE: 'Community',
  CAMP_DASHBOARD: 'Camp Dashboard',
  EPCP_LIST: 'EPCP List',
  EXAM_PREPARATION: 'Exam Preparation',
  EPCP: 'EPCP',
  BENEFICIARY_PROFILE: 'Beneficiary Profile',
  CAMP: 'Camp'
}

export default function setPageTitle({ pageTitle, stepTitle }) {
  const page_title = stepTitle
    ? `${AnalyticsEnums[pageTitle]}/${stepTitle}`
    : `${AnalyticsEnums[pageTitle]}`
  ReactGA.send({
    hitType: 'pageview',
    page: page_title
  })
  document.title = page_title
}
