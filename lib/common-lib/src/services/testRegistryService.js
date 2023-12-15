import { get, handleResponseException, post } from './RestClient'

let baseUrl = process.env.REACT_APP_API_URL

export const getAssessment = async (do_id, body, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${baseUrl}/events/questionset/hierarchy/${do_id}`,
      body,
      {
        headers
      }
    )
    if (result) {
      return result.data.result.questionSet
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const testTrackingCreate = async (data, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    const result = await post(`${baseUrl}/lms/testTracking`, data, {
      headers
    })

    if (result) {
      return result
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getCertificate = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(`${baseUrl}/lms/${id}/get-certificates`, {
      params,
      headers
    })
    if (result.data) {
      return result.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const postCertificates = async ({ id, ...params } = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await post(`${baseUrl}/lms/certificate/download`, params, {
      headers
    })
    if (result.data) {
      return result.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
