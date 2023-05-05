import { get, post, update as coreUpdate } from './RestClient'
import manifest from '../manifest.json'
import mapInterfaceData from './mapInterfaceData'

export const login = async (params = {}, header = {}) => {
  let headers = {
    ...header
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/users/login`,
    params,
    {
      params,
      headers
    }
  )

  if (result?.data?.data) {
    return result?.data?.data
  } else {
    return {}
  }
}
