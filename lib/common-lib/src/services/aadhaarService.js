import {
  get,
  handleResponseException,
  post,
  update as coreUpdate
} from './RestClient'
import mapInterfaceData from './mapInterfaceData'

// aadhaarService

const interfaceData = {
  id: 'id',
  state: 'state',
  district: 'district',
  block: 'block',
  village: 'village',
  profile_url: 'profile_url',
  documents: 'documents',
  reverseValueWithParameter: {},
  format: {}
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const okyc = async (filters = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/okyc`,
      filters,
      {
        headers
      }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const okyc2 = async (filters = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/okyc2/aadhaar/verify`,
      filters,
      {
        headers
      }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const okyc2Verify = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/auth/okyc2/aadhaar/verify/${id}`,
      {
        params,
        headers
      }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const initiate = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/auth/okyc/${id}/initiate`,
      { params, headers }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const verify = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/okyc/${id}/verify`,
      params,
      {
        headers,
        timeout: 60000
      }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const complete = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/okyc/${id}/complete`,
      params,
      {
        headers,
        timeout: 60000
      }
    )

    if (result?.data?.data) {
      return result.data.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
