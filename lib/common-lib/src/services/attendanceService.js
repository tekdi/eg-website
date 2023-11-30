import { post, handleResponseException } from './RestClient'

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

export const list = async ({ id, ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/attendances/list`,
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
export const createAttendance = async (params  = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/events/add/attendance`,
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
