import {
  get,
  handleResponseException,
  patch,
  post,
  update as coreUpdate,
  destroy
} from './RestClient'
import mapInterfaceData from './mapInterfaceData'
// facilitatorRegistryService

const interfaceData = {
  id: 'id',
  first_name: 'first_name',
  middle_name: 'middle_name',
  last_name: 'last_name',
  mobile: 'mobile',
  email_id: 'email_id',
  gender: 'gender',
  dob: 'dob',
  address: 'address',
  aadhar_token: 'aadhar_token',
  aadhar_no: 'aadhar_no',
  aadhar_verified: 'aadhar_verified',
  aadhaar_verification_mode: 'aadhaar_verification_mode',
  qualifications: 'qualifications',
  experience: 'experience',
  program_faciltators: 'program_faciltators',
  availability: 'program_faciltators.availability',
  status: 'program_faciltators.status',
  form_step_number: 'program_faciltators.form_step_number',
  program_faciltator_id: 'program_faciltators.id',
  parent_ip: 'program_faciltators.organisation_id',
  program_users: 'program_users',
  device_type: 'core_faciltator.device_type',
  device_ownership: 'core_faciltator.device_ownership',
  core_faciltator: 'core_faciltator',
  block_id: 'block_id',
  district_id: 'district_id',
  grampanchayat: 'grampanchayat',
  qualification: 'qualifications.1.qualification_master_id',
  degree: 'qualifications.0.qualification_master_id',
  sourcing_channel: 'core_faciltator.sourcing_channel',
  state: 'state',
  district: 'district',
  block: 'block',
  village: 'village',
  state_id: 'state_id',
  village_Ward_id: 'village_Ward_id',
  vo_experience: 'vo_experience',
  profile_url: 'profile_url',
  documents: 'documents',
  alternative_mobile_number: 'alternative_mobile_number',
  marital_status: 'extended_users.marital_status',
  social_category: 'extended_users.social_category',
  profile_photo_1: 'profile_photo_1',
  profile_photo_2: 'profile_photo_2',
  profile_photo_3: 'profile_photo_3',
  pincode: 'pincode',
  aadhaar_front: 'aadhaar_front',
  aadhaar_back: 'aadhaar_back',
  references: 'references',
  extended_users: 'extended_users',
  username: 'username',
  defaultValueSet: {
    vo_experience: [],
    mobile: 'undefined',
    alternative_mobile_number: 'undefined',
    aadhar_token: 'undefined',
    email_id: 'undefined',
    aadhar_no: 'undefined'
  },
  reverseValueWithParameter: {
    form_step_number: 'form_step_number',
    program_faciltator_id: 'program_faciltator_id',
    parent_ip: 'parent_ip',
    availability: 'availability',
    status: 'status',
    program_faciltator_id: 'id',
    device_type: 'device_type',
    device_ownership: 'device_ownership',
    marital_status: 'marital_status',
    social_category: 'social_category'
  },
  format: {
    mobile: 'number',
    aadhar_token: 'number',
    alternative_mobile_number: 'number',
    qualification: 'string',
    degree: 'string',
    qualification_reference_document_id: 'string'
  }
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const create = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  console.log('params', params)
  // const result = await post(
  //   `https://pragatiapp-api.educategirls.ngo/mw/userauth/volunteer/register/volunteer`,
  //   params,
  //   {
  //     headers: headers
  //   }
  // )
  // if (result.data) {
  //   return result.data
  // } else {
  //   return {}
  // }
}

// //v2 code
// export const create = async (
//   data,
//   parent_ip,
//   program_id,
//   academic_year_id,
//   headers = {}
// ) => {
//   try {
//     let header = {
//       ...headers
//     }
//     let newData = {
//       first_name: data?.first_name,
//       middle_name: data?.middle_name,
//       last_name: data?.last_name,
//       mobile: data?.mobile,
//       state: data?.state,
//       pincode: data?.pincode
//     }
//     const result = await post(
//       `${process.env.REACT_APP_API_URL}/userauth/register/facilitator`,
//       newData,
//       {
//         headers: header
//       }
//     )
//     if (result?.data) {
//       return result.data
//     } else {
//       return false
//     }
//   } catch (e) {
//     return handleResponseException(e)
//   }
// }
