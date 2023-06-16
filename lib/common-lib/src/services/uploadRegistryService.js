import {
  get,
  post,
  update as coreUpdate,
  handleResponseException
} from './RestClient'

export const getOne = async (
  { id, document_id, ...params } = {},
  header = {}
) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}${
        document_id
          ? '/uploadFile/getDocumentById/' + document_id
          : '/uploadFile/' + id + '/get-file'
      }`,
      {
        headers
      }
    )

    if (result?.data?.data) {
      return result?.data?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const uploadFile = async (params = {}, header = {}) => {
  try {
    let headers = {
      'Content-Type': 'multipart/form-data',
      ...header
    }

    const result = await post(
      `${process.env.REACT_APP_API_URL}/uploadFile/${params?.get(
        'user_id'
      )}/upload-file`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const uploadPicture = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/uploadFile/attendance`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}
