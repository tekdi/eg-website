import { handleResponseException, post, patch, get } from './RestClient'

export const create = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/userauth/volunteer/register/volunteer`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getData = async (params = {}, header = {}) => {
  try {
    let headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...header
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/volunteer/list`,
      params,
      {
        headers
      }
    )
    if (result.data) {
      return result.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const isUserExist = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/v2/users/is_volunteer_user_exist`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getOne = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/volunteer/${id}`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const update = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/volunteer/${id}`,
      params,
      {
        headers: headers
      }
    )
    if (result.data) {
      return result.data
    } else {
      return result
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const selfUpdate = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/volunteer/self_update`,
      params,
      {
        headers: headers
      }
    )
    if (result.data) {
      return result.data
    } else {
      return result
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getStatesData = async () => {
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/locationmaster/state_lists`
    )
    if (result.data) {
      return result.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
