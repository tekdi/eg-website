import {
  get,
  handleResponseException,
  patch,
  post,
  update as coreUpdate,
  distory
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
  aadhaar_front: 'aadhaar_front',
  aadhaar_back: 'aadhaar_back',
  references: 'references',
  extended_users: 'extended_users',
  defaultValueSet: {
    vo_experience: [],
    mobile: 'undefined',
    alternative_mobile_number: 'undefined',
    aadhar_token: 'undefined',
    email_id: 'undefined'
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
    degree: 'string'
  }
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const getAll = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/users/list`,
    params,
    {
      headers
    }
  )
  if (result.data) {
    return {
      ...result.data,
      data: result.data.data.map((e) => mapInterfaceData(e, interfaceData))
    }
  } else {
    return []
  }
}

export const isExist = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/users/is_user_exist`,
    params,
    {
      headers: headers
    }
  )
  if (result.data) {
    return result.data
  } else {
    return {}
  }
}

export const getOne = async (filters = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL + '/users/info/' + filters.id,
      {
        headers
      }
    )

    if (result?.data?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data.data, interfaceData)
      return resultStudent
    } else {
      return {}
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const getOrganization = async (filters = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await get(
    process.env.REACT_APP_API_URL + '/users/organization/' + filters.id,
    {
      headers
    }
  )

  if (result?.data?.data) {
    return result.data.data
  } else {
    return {}
  }
}

export const getInfo = async (filters = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/users/ip_user_info`,
      {
        headers
      }
    )

    if (result?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data, interfaceData)
      return resultStudent
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const register = async (data, headers = {}) => {
  try {
    let header = {
      ...headers,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    let newInterfaceData = interfaceData
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : only
    }
    let { parent_ip, ...newData } = mapInterfaceData(
      data,
      newInterfaceData,
      true
    )
    newData = {
      ...newData,
      role: 'facilitator',
      role_fields: {
        parent_ip: parent_ip
      }
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      newData,
      {
        headers: header
      }
    )
    if (result.data) {
      return result.data?.data
    } else {
      return false
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const experienceDelete = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await distory(
      `${process.env.REACT_APP_API_URL}/facilitators/experience/${id}`,
      {},
      {
        headers
      }
    )

    if (result?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data, interfaceData)
      return resultStudent
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const referenceDelete = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await distory(
      `${process.env.REACT_APP_API_URL}/facilitators/reference/${id}`,
      {},
      {
        headers
      }
    )

    if (result?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data, interfaceData)
      return resultStudent
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const stepUpdate = async (data = {}, headers = {}) => {
  try {
    let newInterfaceData = interfaceData
    if (headers?.removeParameter || headers?.onlyParameter) {
      newInterfaceData = {
        ...interfaceData,
        removeParameter: headers?.removeParameter
          ? headers?.removeParameter
          : [],
        onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : []
      }
    }
    // let newData = mapInterfaceData(data, newInterfaceData, true)
    const result = await coreUpdate(
      `${process.env.REACT_APP_API_URL}/users/update/${data?.id}`,
      data,
      {
        headers: headers?.headers ? headers?.headers : {}
      }
    )
    if (result?.data) {
      return result?.data?.data
    } else {
      return {}
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const update = async (data = {}, headers = {}) => {
  let newInterfaceData = interfaceData
  if (headers?.removeParameter || headers?.onlyParameter) {
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : []
    }
  }
  // let newData = mapInterfaceData(data, newInterfaceData, true)

  const result = await coreUpdate(
    `${process.env.REACT_APP_API_URL}/users/update_facilitator/${data.id}`,
    data,
    {
      headers: headers?.headers ? headers?.headers : {}
    }
  )
  if (result?.data) {
    return result
  } else {
    return {}
  }
}

export const profileStapeUpdate = async (
  { id, arr_id, ...params } = {},
  header = {}
) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    const result = await patch(
      `${process.env.REACT_APP_API_URL}/facilitators/${id}`,
      { ...params, ...(arr_id ? { id: arr_id } : {}) },
      { headers }
    )
    if (result.data) {
      return result.data.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getQualificationAll = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  const result = await get(
    `${process.env.REACT_APP_API_URL}/users/qualification`,
    { params, headers }
  )
  if (result.data) {
    return result.data.data
  } else {
    return []
  }
}

export const filter = async (
  _formData,
  adminpage,
  adminlimit,
  status,
  searchValue,
  params = {},
  header = {}
) => {
  let filterdata = {
    limit: adminlimit,
    page: adminpage,
    qualificationIds: _formData?.QUALIFICATION,
    work_experience: _formData?.WORK_EXPERIENCE,
    // vo_experience: _formData?.WORK_EXPERIENCE,
    status: status,
    district: _formData?.DISTRICT,
    search: searchValue
  }

  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/facilitators`,
    filterdata,
    {
      headers: headers
    }
  )
  if (result?.data) {
    return result?.data
  } else {
    return {}
  }
}

export const getFacilitatorByStatus = async (
  _formData,
  adminpage,
  adminlimit,
  params = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/facilitators`,
      _formData,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const getFacilitatorByStatusInOrientation = async (
  _formData,
  adminpage,
  adminlimit,
  params = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/facilitators/forOrientation`,
      _formData,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const exportFacilitatorsCsv = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'text/csv',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/facilitators/exportCsv`,
      {},
      {
        headers: headers ? headers : {}
      }
    )
    if (result?.data) {
      const downloadUrl = URL.createObjectURL(new Blob([result?.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'Preraks.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      return {}
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}
