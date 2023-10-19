import { post, patch, handleResponseException, get } from './RestClient'

const interfaceData = {
  id: 'id',
  group: 'group',
  group_users: 'group_users',
  kit_feedback: 'kit_feedback',
  kit_ratings: 'kit_ratings',
  kit_received: 'kit_received',
  kit_was_sufficient: 'kit_was_sufficient',
  properties: 'properties'
}

export const campList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/list`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
export const campNonRegisteredUser = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/beneficiaries-for-camp`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const campRegister = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getCampDetails = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/${params?.id}`,
      {},
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
      // return mapInterfaceData(result?.data?.data, interfaceData)
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
export const updateCampDetails = async (params = {}, id = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/camp/${params?.id}`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

//cam[p Admin service:-
export const getCampList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/admin/camp-list`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
export const markCampAttendance = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/attendance/add`,
      params,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const CampAttendance = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/camp/attendance/${params?.id}`,
      {
        headers: headers || {}
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
