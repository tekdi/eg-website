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

const getToken = () => {
  return localStorage.getItem('token') || ''
}

export const getAcademicYear = async ({ ...params } = {}, header = {}) => {
  try {
    const token = getToken()

    let headers = {
      ...header,
      Authorization: `Bearer ${token}`
    }

    const result = await get(
      `${process.env.REACT_APP_API_URL}/users/cohorts/my`,
      {
        headers
      }
    )

    if (result?.data) {
      return result.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
