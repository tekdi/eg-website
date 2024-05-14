import {
  get,
  post,
  patch,
  destroy,
  handleResponseException
} from './RestClient'

export const getList = async ({ ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/onestusertrack/list`,
      params,
      { headers }
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

export const create = async ({ ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/onestusertrack`,
      params,
      { headers }
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

export const statusTrack = async ({ ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `https://eg-scholarship-dev-api.tekdinext.com/status`,
      params,
      { headers }
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
