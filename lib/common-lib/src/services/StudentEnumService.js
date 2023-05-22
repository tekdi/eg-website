import { get, post, update as coreUpdate } from './RestClient'
import mapInterfaceData from './mapInterfaceData'

export const getTypeStudent = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  return [
    {
      title: '1',
      value: '1'
    },
    {
      title: '2',
      value: '2'
    },
    {
      title: '3',
      value: '3'
    }
  ]
}

export const lastYear = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  return [
    {
      title: '1995',
      value: '1995'
    },
    {
      title: '1996',
      value: '1996'
    },
    {
      title: '1997',
      value: '1997'
    }
  ]
}

export const lastStandard = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  return [
    {
      title: 'First',
      value: 'First'
    },
    {
      title: 'Second',
      value: 'Second'
    },
    {
      title: 'Third',
      value: 'Third'
    }
  ]
}

export const ReasonOfLeaving = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  return [
    {
      title: 'Family Reason',
      value: 'First'
    },
    {
      title: 'Second',
      value: 'Second'
    },
    {
      title: 'Third',
      value: 'Third'
    }
  ]
}
