import { getBase64 } from '../components/helper'
import {
  get,
  post,
  update as coreUpdate,
  update,
  patch,
  handleResponseException
} from './RestClient'
import mapInterfaceData from './mapInterfaceData'
import { REACT_APP_UPLOAD_FILE_SIZE } from '../config/constant'

// facilitatorRegistryService

const interfaceData = {
  title: 'title',
  value: 'value'
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const isExist = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/is_user_exist`,
      params,
      {
        headers: headers
      }
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

export const getOne = async (id, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL + '/beneficiaries/' + id,
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

export const getAuditLogs = async (contextId, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL +
        '/users/audit/program_beneficiaries.status/' +
        contextId,
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

export const editProfileById = async (data = {}, headers = {}) => {
  try {
    let newInterfaceData = interfaceData
    if (headers?.removeParameter || headers?.onlyParameter) {
      newInterfaceData = {
        ...interfaceData,
        removeParameter: headers?.removeParameter
          ? headers?.removeParameter
          : [],
        onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : []
      }
    }
    const result = await coreUpdate(
      `${process.env.REACT_APP_API_URL}/beneficiaries/${data.id}`,
      data,
      {
        headers: headers?.headers ? headers?.headers : {}
      }
    )
    if (result?.data) {
      return result
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
export const getBeneficiariesList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries`,
      params,
      { headers }
    )

    if (result?.data?.data?.data) {
      // let resultStudent = result?.data?.data?.data.map((e) =>
      //   mapInterfaceData(e, interfaceData)
      // )
      return result?.data?.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const statusUpdate = async (data = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await coreUpdate(
      `${process.env.REACT_APP_API_URL}/beneficiaries/statusUpdate`,
      data,
      {
        headers: headers ? headers : {}
      }
    )
    if (result?.data?.beneficiaries) {
      return result?.data?.beneficiaries
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const lastYear = async (filters = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }

    const currentYear = new Date().getFullYear()
    const maxAge = 30
    const years = [{ value: 'NA' }]

    for (let i = currentYear; i >= currentYear - maxAge; i--) {
      years.push({ value: i })
    }

    return years
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getStatusList = async (filters = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL +
        '/enum/enum_value_list?key=BENEFICIARY_STATUS',
      {
        headers
      }
    )

    if (result?.data?.data) {
      return result?.data?.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getDocumentStatus = async (params = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/enum/enum_value_list?key=DOCUMENT_STATUS`,
      {
        params,
        headers
      }
    )
    if (result.data) {
      return result.data.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const getStatusUpdate = async (id, data = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/beneficiaries/${id}`,
      data,
      {
        headers
      }
    )
    if (result?.data?.beneficiaries) {
      return result?.data?.beneficiaries
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const validateFileMaxSize = async (file) => {
  try {
    let max_file_upload_size = 1048576 * REACT_APP_UPLOAD_FILE_SIZE
    if (file.size <= max_file_upload_size) {
      const data = await getBase64(file)
      return data
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const enrollmentReceipt = async (id, data = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/beneficiaries/${id}`,
      data,
      {
        headers
      }
    )
    if (result?.data?.data?.program_beneficiaries) {
      return result?.data?.data?.program_beneficiaries
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}

export const isExistEnrollment = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/${id}/is_enrollment_exists`,
      params,
      {
        headers: headers
      }
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

export const createAg = async (formData, header = {}) => {
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const updateAg = async (formData, userId, header = {}) => {
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const beneficiariesFilter = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/admin/list`,
      params,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
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

export const exportBeneficiariesCsv = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/admin/export-csv`,
      params,
      {
        headers: headers ? headers : {}
      }
    )
    if (result?.data) {
      const downloadUrl = URL.createObjectURL(new Blob([result?.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'Beneficiaries.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
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

export const exportBeneficiariesSubjectsCsv = async (
  params = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/admin/export-subjects-csv`,
      params,
      {
        headers: headers ? headers : {}
      }
    )
    if (result?.data) {
      const downloadUrl = URL.createObjectURL(new Blob([result?.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'BeneficiariesSubjects.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
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

export const getDuplicateBeneficiariesList = async (
  params = {},
  header = {}
) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL +
        '/beneficiaries/admin/list/duplicates-count-by-aadhaar',
      {
        params,
        headers
      }
    )
    if (result?.data) {
      return result?.data
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

export const getDuplicateBeneficiariesListByAadhaar = async (
  params = {},
  header = {}
) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const queryParams = new URLSearchParams(params)
    const result = await post(
      `${
        process.env.REACT_APP_API_URL
      }/beneficiaries/admin/list/duplicates-by-aadhaar?${queryParams.toString()}`,
      params,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
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

export const deactivateDuplicates = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/admin/list/deactivate-duplicates`,
      params,
      {
        headers: headers
      }
    )
    if (result?.data) {
      return result?.data
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

export const verifyEnrollment = async (formData, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/beneficiaries/admin/verify-enrollment`,
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
  } catch (e) {
    return handleResponseException(e)
  }
}

export const updateAadhaarNumber = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await patch(
      `${process.env.REACT_APP_API_URL}/beneficiaries/update-Beneficiaries-aadhar/${params?.id}`,
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
