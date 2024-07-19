import { handleResponseException, patch, post } from './RestClient'

export const login = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    params,
    {
      headers
    }
  )

  if (result?.data?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const sendOtp = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json'
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/auth/otp-send`,
    params,
    headers
  )

  if (result.data) {
    return result.data
  } else {
    return {}
  }
}

export const verifyOtp = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/otp-verify`,
      params,
      headers
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

export const resetPasswordByUserName = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/get-mobile-by-username-send-otp`,
      params
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

export const forgetPassword = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/forgot-password-otp`,
      params,
      headers
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

export const resetPasswordAdmin = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/reset-password-admin`,
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

export const resetPasswordVolunteerAdmin = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/reset-password-volunteer-admin`,
      params,
      { headers }
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

export const aadhaarKyc = async ({ id, ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/auth/aadhaar-kyc/${id}`,
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

export const aadhaarQr = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}py/aadhaar-qr`,
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
