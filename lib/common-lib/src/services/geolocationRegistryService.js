import { get, post, update as coreUpdate } from './RestClient'

export const getStates = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/states`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getType = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/states`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getDistricts = async ({ name, ...params } = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/districts/${name}`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getBlocks = async (
  { name, state, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/blocks/${name}?state=${state}`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getGrampanchyat = async (
  { block, district, state, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/grampanchyat?state=${state}&district=${district}&block=${block}`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getVillages = async (
  { name, state, district, gramp, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/villages/${name}?state=${state}&district=${district}&grampanchayat=${gramp}`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}

export const getMultipleBlocks = async (params = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/locationmaster/multipleblocks`,
    params,
    {
      headers
    }
  )

  if (result?.data) {
    return result?.data?.data
  } else {
    return []
  }
}
