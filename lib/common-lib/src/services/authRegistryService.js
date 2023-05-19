import { get, post, update as coreUpdate } from './RestClient'
import manifest from '../manifest.json'
import mapInterfaceData from './mapInterfaceData'

export const login = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/users/login`,
    params,
    {
      params,
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
    ...header
  }
  // const result = await post(
  //   // `${process.env.REACT_APP_API_URL}/auth/otp-send?mobile=${params.mobile}&reason=${params.reason}`,
  //   `${process.env.REACT_APP_API_URL}/auth/otp-send`,
  //   params,
  //   headers
  // )
  const result = {
    data: {
      success: true,
      message: 'Otp successfully sent to XXXXXX6880',
      data: {
        hash: '1c889f7d8456d15ee6d09c7443f4b426fad39cca8df339f0468057011d25147c.1683689104450'
      }
    }
  }

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
  // const result = await post(
  //   `${process.env.REACT_APP_API_URL}/auth/otp-verify`,
  //   params,
  //   headers
  // )
  const result = {
    data: {
      success: false,
      message: 'OTP verified successfully!',
      data: null
    }
  }
  if (result.data) {
    return result.data
  } else {
    return {}
  }
}
