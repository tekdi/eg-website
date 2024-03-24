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
          _eq: 'EPCP'
        }
      },
      observation_fields: {
        context: {
          _eq: 'boards'
        },
        context_id: {
          _eq: 2
        }
      },
      field_responses: {
        context: {
          _eq: 'users'
        },
        context_id: {
          _eq: id
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

export const getReport = async (header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/observations/report`,
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
    const result = await get(
      `${process.env.REACT_APP_API_URL}/observations/camp-learner-list`,
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
