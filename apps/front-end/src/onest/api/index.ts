import axios from 'axios'

export async function get(url: string, headers: any = {}) {
  return await axios.get(url, {
    ...headers,
    headers: { ...headers?.headers, 'Access-Control-Allow-Origin': '*' }
  })
}

export async function post(
  url: string,
  body: any,
  headers: any = {},
  onUploadProgress: any = {}
) {
  return await axios.post(url, body, {
    ...headers,
    headers: { ...headers?.headers, 'Access-Control-Allow-Origin': '*' },
    onUploadProgress
  })
}

export async function update(url: string, body: any, headers: any = {}) {
  return await axios.put(url, body, {
    ...headers,
    headers: { ...headers?.headers, 'Access-Control-Allow-Origin': '*' }
  })
}

export async function distory(url: string, body: any, headers: any = {}) {
  return await axios.delete(url, {
    headers: { ...headers?.headers, 'Access-Control-Allow-Origin': '*' },
    data: body
  })
}

export async function patch(url: string, body: any, headers: any = {}) {
  return await axios.patch(url, body, {
    ...headers,
    headers: { ...headers?.headers, 'Access-Control-Allow-Origin': '*' }
  })
}

export const handleResponseException = (obj: any) => {
  const { response, message } = obj
  return {
    status: response?.status ? response?.status : 404,
    error: response?.data?.message ? response?.data?.message : message,
    ...(response ? response?.data : response)
  }
}
