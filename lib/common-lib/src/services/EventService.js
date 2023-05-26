import { get, post, update as coreUpdate } from './RestClient'

export const createNewEvent = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/events/create`,
      params,
      { headers }
    )
    if (result.data) {
      return result.data
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
