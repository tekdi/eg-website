import axios from 'axios'
import {getSelectedOrgId,
  getSelectedAcademicYear,
  getSelectedProgramId
} from '../components/helper'

const getHeaders = async () => {
  let commonHeader: any = await addCommonHeader()
  const keys = Object.keys(commonHeader)
 let data = {};
 keys.forEach(key => {
  if(commonHeader?.[key]) {
  if(key === "org_id") {
   data = {...data,'x-ip-org-id': commonHeader?.[key]}
  } else if(key === "program_id") {
      data = {...data,'x-program-id': commonHeader?.[key]}     
  } else if(key === "academic_year_id") {
    data = {...data,'x-academic-year-id': commonHeader?.[key]}     
  }}
});
  return data
}

export async function get(url: string, headers: any = {}) {
  let commonHeader: any = await getHeaders()
  return await axios.get(url, {
    ...headers,
    headers: {
      ...headers?.headers,
     ...commonHeader
    }
  })
}

export async function post(
  url: string,
  body: any,
  headers: any = {},
  onUploadProgress: any = {}
) {
  let commonHeader: any = await getHeaders()
  return await axios.post(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      ...commonHeader
    },
    onUploadProgress
  })
}

export async function update(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await getHeaders()
  return await axios.put(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      ...commonHeader
    }
  })
}

export async function destroy(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await getHeaders()
  return await axios.delete(url, {
    headers: {
      ...headers?.headers,
      ...commonHeader
    },
    data: body
  })
}

export async function patch(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await getHeaders()
  return await axios.patch(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      ...commonHeader
    }
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

const addCommonHeader = async () => {
  let commonHeader = {}
  let academic_year_id = null
  let program_id = null
  let org_id = null
  try {
    let academic_year = await getSelectedAcademicYear()
    academic_year_id = academic_year?.academic_year_id
  } catch (e) {}
  try {
    let program = await getSelectedProgramId()
    program_id = program?.program_id
  } catch (e) {}
  try {
    let org = await getSelectedOrgId()
    org_id = org?.org_id
  } catch (e) {}
  commonHeader = {
    academic_year_id: academic_year_id,
    program_id: program_id,
    org_id
  }
  return commonHeader
}
