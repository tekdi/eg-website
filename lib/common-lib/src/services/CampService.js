import { post, patch, handleResponseException, get } from './RestClient'
export const campList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/list`,
      params,
      {
        headers: headers || {}
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
export const campNonRegisteredUser = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/beneficiaries-for-camp`,
      params,
      {
        headers: headers || {}
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

export const campRegister = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/`,
      params,
      {
        headers: headers || {}
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

export const getCampDetails = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/camp/${params?.id}`,
      {},
      {
        headers: headers || {}
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
export const updateCampDetails = async (params = {}, id = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/camp/${params?.id}`,
      params,
      {
        headers: headers || {}
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

export const getFacilatorAdminCampList = async (
  { id, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  console.log('params', id)
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/camp/admin/camp-details/${id}`,
      {
        headers
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

// export const getFacilatorAdminCampList = async (params = {}, header = {}) => {
//   let headers = {
//     ...header,
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer ' + localStorage.getItem('token')
//   }
//   try {
//     const result = await post(
//       `${process.env.REACT_APP_API_URL}/camp/admin/camp-details/${params?.id}`,
//       {},
//       {
//         headers: headers || {}
//       }
//     )
//     if (result?.data) {
//       return result?.data
//     } else {
//       return {}
//     }
//   } catch (e) {
//     return handleResponseException(e)
//   }
// }
