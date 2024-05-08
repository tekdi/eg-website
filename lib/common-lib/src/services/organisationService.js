import { post, patch, handleResponseException, get } from './RestClient'

export const getList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/organisation/list`,
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

export const getOne = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/organisation/${params?.id}`,
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
export const getIpUserList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/ip_users/list`,
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
export const createOrg = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/organisation/create`,
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
export const createIpUser = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
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
export const rolesList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/roles/list`,
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
export const userDetails = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/ip/${params?.id}`,
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
export const addExistingIP = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/organisation/add/existing`,
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

export const getExistingIpList = async (header = {}) => {
  try {
    let headers = {
      ...header,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    const result = await get(
      `${process.env.REACT_APP_API_URL}/organisation/exist_list`,
      {
        headers
      }
    )

    if (result?.data) {
      return result.data
    } else {
      return {}
    }
  } catch (e) {
    return handleResponseException(e)
  }
}
export const addExistingUser = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/add/existing_ip`,
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
export const getExistingUserList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/users/ip_users/exist_list`,
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
export const getattendanceLearnerList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/schedule/learner/attendance/list`,
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

export const PoExamSchedule = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/schedule`,
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
export const PoExamScheduleEdit = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/schedule/edit`,
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
export const markExamAttendance = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/schedule/attendance`,
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

export const LearnerSujectList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/result/subject`,
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
export const examResult = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/result`,
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

export const getSubjectList = async ({ id, ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/exam/schedule/subject/list/${id}`,
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

export const getSubjectOnDate = async (
  { filter, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/exam/schedule/${filter?.selectedId}/${filter?.date}`,
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

export const attendanceReport = async (
  { filter, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/exam/attendance/report`,
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

export const examResultReport = async (
  { filter, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      `${process.env.REACT_APP_API_URL}/exam/result/report`,
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

export const examResultLearnerList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/learner/list`,
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
export const resultView = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    console.log({ params })
    const result = await post(
      `${process.env.REACT_APP_API_URL}/exam/result/search`,
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
