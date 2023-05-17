import { get, post, update as coreUpdate } from './RestClient'
import mapInterfaceData from './mapInterfaceData'

// facilitatorRegistryService

const interfaceData = {
  id: 'id',
  first_name: 'first_name',
  last_name: 'last_name',
  mobile: 'mobile',
  email_id: 'email_id',
  gender: 'gender',
  dob: 'dob',
  address: 'address',
  aadhar_token: 'aadhar_token',
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
  qualification: 'qualifications.0.qualification_master_id',
  degree: 'qualifications.1.qualification_master_id',
  sourcing_channel: 'sourcing_channel',
  state: 'state',
  district: 'district',
  block: 'block',
  village: 'village',
  state_id: 'state_id',
  village_Ward_id: 'village_Ward_id',
  vo_experience: 'vo_experience',
  profile_url: 'profile_url',
  documents: 'documents',
  defaultValueSet: {
    vo_experience: []
  },
  reverseValueWithParameter: {
    form_step_number: 'form_step_number',
    program_faciltator_id: 'program_faciltator_id',
    parent_ip: 'parent_ip',
    availability: 'availability',
    status: 'status',
    program_faciltator_id: 'id',
    device_type: 'device_type',
    device_ownership: 'device_ownership'
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

    if (result?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data, interfaceData)
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
}

export const create = async (data, headers = {}) => {
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
    let newData = mapInterfaceData(data, newInterfaceData, true)
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/register`,
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
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
