import axios from 'axios'
import {
  getSelectedAcademicYear,
  getSelectedProgramId
} from '../components/helper'

export async function get(url: string, headers: any = {}) {
  let commonHeader: any = await addCommonHeader()
  return await axios.get(url, {
    ...headers,
    headers: {
      ...headers?.headers,
      'x-academic-year-id': commonHeader?.academic_year_id,
      'x-program-id': commonHeader?.program_id
    }
  })
}

export async function post(
  url: string,
  body: any,
  headers: any = {},
  onUploadProgress: any = {}
) {
  let commonHeader: any = await addCommonHeader()
  return await axios.post(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      'x-academic-year-id': commonHeader?.academic_year_id,
      'x-program-id': commonHeader?.program_id
    },
    onUploadProgress
  })
}

export async function update(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await addCommonHeader()
  return await axios.put(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      'x-academic-year-id': commonHeader?.academic_year_id,
      'x-program-id': commonHeader?.program_id
    }
  })
}

export async function distory(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await addCommonHeader()
  return await axios.delete(url, {
    headers: {
      ...headers?.headers,
      'x-academic-year-id': commonHeader?.academic_year_id,
      'x-program-id': commonHeader?.program_id
    },
    data: body
  })
}

export async function patch(url: string, body: any, headers: any = {}) {
  let commonHeader: any = await addCommonHeader()
  return await axios.patch(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
      'x-academic-year-id': commonHeader?.academic_year_id,
      'x-program-id': commonHeader?.program_id
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
  try {
    let academic_year = await getSelectedAcademicYear()
    academic_year_id = academic_year?.academic_year_id
  } catch (e) {}
  try {
    let program = await getSelectedProgramId()
    program_id = program?.program_id
  } catch (e) {}
  commonHeader = {
    academic_year_id: academic_year_id,
    program_id: program_id
  }
  return commonHeader
}
