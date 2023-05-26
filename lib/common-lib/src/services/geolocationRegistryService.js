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

export const getBlocks = async ({ name, ...params } = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/blocks/${name}`,
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

export const getVillages = async ({ name, ...params } = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await get(
    `${process.env.REACT_APP_API_URL}/locationmaster/villages/${name}`,
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
