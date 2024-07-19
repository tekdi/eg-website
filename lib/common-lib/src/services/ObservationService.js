import {
  get,
  post,
  patch,
  update as coreUpdate,
  handleResponseException
} from './RestClient'

export const getSubmissionData = async (id, header = {}) => {
  const payload = {
    filters: {
      observations: {
        name: {
          _eq: id?.observation
        }
      },
      observation_fields: {
        context: {
          _eq: 'boards'
        },
        context_id: {
          _eq: id?.board_id
        }
      },
      field_responses: {
        context: {
          _eq: 'users'
        },
        context_id: {
          ...(Array.isArray(id?.id) ? { _in: id?.id } : { _eq: id?.id })
        }
      }
    }
  }

  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/observations/list/type/submissons`,
      payload,
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
export const postBulkData = async (payload, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/observations/field-responses/bulk`,
      payload,
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

export const getReport = async (userIds, header = {}) => {
  const payload = {
    filters: {
      observations: {
        name: 'EPCP'
      },
      observation_fields: {
        context: 'boards',
        context_id: 2
      },
      field_responses: {
        context: 'users',
        context_id: userIds
      }
    }
  }
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/observations/report`,
      payload,
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
export const getCampLearnerList = async (header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/camp-info/learners`,
      {},
      {
        headers: headers
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

export const subjectList = async (id, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/observations/exam/result/subjects/${id}`,
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
