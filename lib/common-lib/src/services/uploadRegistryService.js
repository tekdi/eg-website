import { get, post, update as coreUpdate } from './RestClient'

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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const uploadFile = async (params = {}, header = {}) => {
  console.log('params', params)
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}
