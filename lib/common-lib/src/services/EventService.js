import {
  get,
  post,
  patch,
  destroy,
  handleResponseException
} from './RestClient'

export const createNewEvent = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
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

export const getEventList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await get(`${process.env.REACT_APP_API_URL}/events/list`, {
      headers
    })

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

export const getEventListById = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/events/${params?.id}`,
      {
        headers
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

export const updateAttendance = async (data = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/events/attendance/${data?.id}`,
      data,
      {
        headers
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

export const editAttendanceDocumentList = async (data = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/facilitators/${data?.id}`,
      data,
      {
        headers
      }
    )
    if (result?.data) {
      return result
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

export const deleteCurrentEvent = async (
  { id, ...params } = {},
  header = {}
) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await destroy(
      `${process.env.REACT_APP_API_URL}/events/${id}`,
      {},
      {
        headers: headers ? headers : {}
      }
    )

    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getAttendanceList = async (
  { id, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/events/${id}/get-participants`,
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
