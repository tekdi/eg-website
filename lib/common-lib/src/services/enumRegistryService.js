import {
  get,
  handleResponseException,
  post,
  update as coreUpdate
} from './RestClient'
import mapInterfaceData from './mapInterfaceData'

// enumRegistryService

const interfaceData = {
  title: 'title',
  value: 'value'
}
let only = Object.keys(interfaceData)
export const checkMapInterfaceData = (data, reverse) =>
  mapInterfaceData(data, interfaceData, reverse)

export const getAll = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    return [
      {
        title: 'Sociology',
        value: 'sociology'
      },
      {
        title: 'Home Science',
        value: 'home_science'
      },
      {
        title: 'Maths',
        value: 'maths'
      },
      {
        title: 'Drawing',
        value: 'drawing'
      },
      {
        title: 'Social Studies',
        value: 'social_studies'
      },
      {
        title: 'English',
        value: 'english'
      },
      {
        title: 'Geography',
        value: 'geography'
      }
    ]
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

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

export const getOne = async (filters = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const result = await get(
      process.env.REACT_APP_API_URL + '/users/info/' + filters.id,
      {
        headers
      }
    )

    if (result?.data?.data) {
      let resultStudent = mapInterfaceData(result.data.data, interfaceData)
      return resultStudent
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

export const getOrganization = async (filters = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await get(
    process.env.REACT_APP_API_URL + '/users/organization/' + filters.id,
    {
      headers
    }
  )

  if (result?.data?.data) {
    return result.data.data
  } else {
    return {}
  }
}

export const getInfo = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/users/ip_user_info`,
    {
      headers
    }
  )

  if (result?.data?.data) {
    let resultStudent = mapInterfaceData(result.data.data, interfaceData)
    return resultStudent
  } else {
    return {}
  }
}

export const create = async (data, headers = {}) => {
  try {
    let header = {
      ...headers,
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    let newInterfaceData = interfaceData
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : only
    }
    let newData = mapInterfaceData(data, newInterfaceData, true)
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/register`,
      newData,
      {
        headers: header
      }
    )
    if (result.data) {
      return result.data?.data
    } else {
      return false
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const stepUpdate = async (data = {}, headers = {}) => {
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
    // let newData = mapInterfaceData(data, newInterfaceData, true)
    const result = await coreUpdate(
      `${process.env.REACT_APP_API_URL}/users/update/${data?.id}`,
      data,
      {
        headers: headers?.headers ? headers?.headers : {}
      }
    )
    if (result?.data) {
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

export const update = async (data = {}, headers = {}) => {
  let newInterfaceData = interfaceData
  if (headers?.removeParameter || headers?.onlyParameter) {
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : []
    }
  }
  // let newData = mapInterfaceData(data, newInterfaceData, true)

  const result = await coreUpdate(
    `${process.env.REACT_APP_API_URL}/users/update_facilitator/${data.id}`,
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

export const getQualificationAll = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }

  const result = await get(
    `${process.env.REACT_APP_API_URL}/users/qualification`,
    { params, headers }
  )
  if (result.data) {
    return result.data.data
  } else {
    return []
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

export const getSubjects = async (filters, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await post(
      `${process.env.REACT_APP_API_URL}/subjects`,
      { filters },
      { headers }
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

export const listOfEnum = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(`${process.env.REACT_APP_API_URL}/enum/list`, {
    params,
    headers
  })
  if (result.data) {
    return result.data.data
  } else {
    return []
  }
}

// //user-info on dashboard

// export const userInfo = async (params = {}, header = {}) => {
//   let headers = {
//     Authorization: 'Bearer ' + localStorage.getItem('token'),
//     ...header
//   }
//   const result = await get(`${process.env.REACT_APP_API_URL}/userauth/user-info`, {
//     params,
//     headers
//   })
//   if (result.data) {
//     return result.data.data
//   } else {
//     return []
//   }
// }

export const boardName = async (value, params = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/board/${value}`,
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
  } catch (error) {
    console.error('Error fetching board name:', error)
  }
}
export const boardList = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(`${process.env.REACT_APP_API_URL}/board/list`, {
    params,
    headers
  })
  if (result.data) {
    return result.data.data
  } else {
    return []
  }
}
export const ExamboardList = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(`${process.env.REACT_APP_API_URL}/exam/board/list`, {
    params,
    headers
  })
  if (result.data) {
    return result.data.data
  } else {
    return []
  }
}

export const subjectsList = async (value, params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/board/subject/list/${value}`,
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
}

export const statuswiseCount = async (params = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/facilitators/getStatuswiseCount`,
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
    }
  }
}

export const getStatuswiseCount = async (params = {}, header = {}) => {
  try {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...header
    }
    const result = await get(
      `${process.env.REACT_APP_API_URL}/camp/getStatuswiseCount`,
      {
        params,
        headers
      }
    )
    if (result?.data) {
      return result?.data?.data
    } else {
      return []
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
