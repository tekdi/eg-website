import { get, post, update as coreUpdate } from './RestClient'
import mapInterfaceData from './mapInterfaceData'

export const getTypeStudent = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/enum/enum_value_list?key=TYPE_OF_LEARNER`,
    { params, headers }
  )
  if (result.data) {
    return result.data.data
  } else {
    return []
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

export const lastStandard = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  return [
    {
      title: '1st',
      value: '1st'
    },
    {
      title: '2nd',
      value: '2nd'
    },
    {
      title: '3rd',
      value: '3rd'
    },
    {
      title: '4th',
      value: '4th'
    },
    {
      title: '5th',
      value: '5th'
    },
    {
      title: '6th',
      value: '6th'
    },
    {
      title: '7th',
      value: '7th'
    },
    {
      title: '8th',
      value: '8th'
    },
    {
      title: '9th',
      value: '9th'
    },
    {
      title: '10th',
      value: '10th'
    }
  ]
}

export const ReasonOfLeaving = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/enum/enum_value_list?key=REASON_OF_LEAVING_EDUCATION`,
    { params, headers }
  )
  if (result.data) {
    return result.data.data
  } else {
    return []
  }
}
