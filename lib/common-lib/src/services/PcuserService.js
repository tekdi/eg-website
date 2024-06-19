import { post, patch, handleResponseException, get } from './RestClient'

const getToken = () => {
  return localStorage.getItem('token') || ''
}

export const registerPC = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/program-coordinator/register/program_coordinator`,
      params,
      {
        headers: headers
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
export const Pclist = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/program-coordinator`,
      params,
      {
        headers: headers
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

export const pcDetails = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/program-coordinator/${params?.id}`,
      params,
      {
        headers: headers
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
export const PcAvailableFacilitator = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/program-coordinator/availablefacilitator/${params?.id}`,
      params,
      {
        headers: headers
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
export const activitiesList = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/program-coordinator/activities/list`,
      params,
      {
        headers: headers
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
export const AddRemovePrerak = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/program-coordinator/${params?.id}`,
      params,
      {
        headers: headers
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
