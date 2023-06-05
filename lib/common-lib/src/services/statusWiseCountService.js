import { get } from './RestClient'
export const getStatusWiseCount = async (filters = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/beneficiaries/getStatuswiseCount`,
      {
        headers
      }
    )

    if (result?.data?.data) {
      return result?.data?.data
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
