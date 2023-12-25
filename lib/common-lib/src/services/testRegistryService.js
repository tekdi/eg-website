import { get, handleResponseException, post } from './RestClient'

let baseUrl = process.env.REACT_APP_API_URL
const MAX_RETRIES = 3
const RETRY_DELAY = 0

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
  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      let headers = {
        ...header,
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
      const result = await postWithRetry(`${baseUrl}/lms/testTracking`, data, {
        headers
      })
      if (result.status === 200) {
        return 200
      } else {
        // Retry only if the status is not 200
        retries++
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    } catch (e) {
      console.error('API Error:', e)
      retries++
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
    }
  }
  return
}

const postWithRetry = async (url, data, options) => {
  try {
    const response = await post(url, data, options)
    return response
  } catch (error) {
    console.error('Error in postWithRetry:', error)
    throw error
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
