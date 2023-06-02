import { get, post, update as coreUpdate, update } from './RestClient'
import mapInterfaceData from './mapInterfaceData'

// facilitatorRegistryService

const interfaceData = {
  title: 'title',
  value: 'value'
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const isExist = async (params = {}, header = {}) => {
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const editProfileById = async (data = {}, headers = {}) => {
  console.log('data', 'inside request')

  let newInterfaceData = interfaceData
  if (headers?.removeParameter || headers?.onlyParameter) {
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : []
    }
  }
  console.log(data, 'inside request')
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
}
export const getBeneficiariesList = async (params = {}, header = {}) => {
  console.log(params, "params")
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
      console.log(result)
      // let resultStudent = result?.data?.data?.data.map((e) =>
      //   mapInterfaceData(e, interfaceData)
      // )
      return result?.data?.data?.data
    } else {
      return []
    }
  }
  catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const statusUpdate = async (data = {}, header = {}) => {
  try {
    let headers = {
      ...header
    }
    const result = await update(
      `${process.env.REACT_APP_API_URL}/beneficiaries/statusUpdate`,
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const lastYear = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }

  const currentYear = new Date().getFullYear()
  const startAge = 14
  const endAge = 30
  const years = Array.from({ length: endAge - startAge + 1 }, (_, index) => ({
    value: currentYear - startAge - index
  }))

  return years
}
