import { get, post, patch, update as coreUpdate } from './RestClient'

export const createAg = async (formData, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      formData,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (error) {
    console.log('error', error)
  }
}

export const createBeneficiary = async (formData, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/userauth/register/beneficiary`,
      formData,
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

export const updateAg = async (formData, userId, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/beneficiaries/${userId}`,
      formData,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
    } else {
      return {}
    }
  } catch (error) {
    console.log('error', error)
  }
}
