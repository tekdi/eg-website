import { get, post, patch, update as coreUpdate } from './RestClient'

export const createAg = async (formData, header = {}) => {
  console.log('_formData', formData)
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

export const updateAg = async (formData, userId, header = {}) => {
  console.log('_formData', formData)
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
