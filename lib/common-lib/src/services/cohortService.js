import { post, patch, handleResponseException, get } from './RestClient'

const getToken = () => {
  return localStorage.getItem('token') || ''
}

export const getAcademicYear = async (header = {}) => {
  try {
    const token = getToken()

    let headers = {
      ...header,
      Authorization: `Bearer ${token}`
    }

    const result = await get(
      `${process.env.REACT_APP_API_URL}/users/cohorts/my/academic_year`,
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

export const getProgramYear = async (header = {}) => {
  try {
    const token = getToken()

    let headers = {
      ...header,
      Authorization: `Bearer ${token}`
    }

    const result = await get(
      `${process.env.REACT_APP_API_URL}/users/cohorts/my/program`,
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

export const getPrograms = async (cohortAcademicYearId, header = {}) => {
  try {
    const token = getToken()

    let headers = {
      ...header,
      Authorization: `Bearer ${token}`
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/users/cohorts/my/program_academic_year_id`,
      {
        params: { cohort_academic_year_id: cohortAcademicYearId },
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
