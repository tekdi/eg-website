import React from 'react'
import BaseTheme from './theme'
import { extendTheme } from 'native-base'
import jwt_decode from 'jwt-decode'
import * as facilitatorRegistryService from '../services/facilitatorRegistryService'
import * as authRegistryService from '../services/authRegistryService'

import * as Sentry from '@sentry/react'

export const SentryBreadcrumb = async (category, message, data, level) => {
  Sentry.addBreadcrumb({
    category: category,
    message: message,
    data: data,
    level: level
  })
}

export function useWindowSize(maxWidth = '100%') {
  const [size, setSize] = React.useState([])
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.innerWidth > maxWidth ? maxWidth : '100%',
        window.innerHeight > window.outerHeight
          ? window.outerHeight
          : window.innerHeight
      ])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

export const generateUUID = () => {
  var d = new Date().getTime()
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16
    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export const DEFAULT_THEME = async (theme) => {
  return extendTheme(BaseTheme)
}

export const getAppshellData = async (routes = [], role = '', theme = null) => {
  try {
    const themeName = theme
    const newRoutes = routes
    const newTheme = await DEFAULT_THEME(themeName)
    return { newTheme, newRoutes, config: {} }
  } catch (e) {
    console.error('Catch-error:', e.message)
    return {
      newTheme: await DEFAULT_THEME('joyFull'),
      newRoutes: [],
      config: {}
    }
  }
}

export const getTokernUserInfo = (token = '') => {
  try {
    if (token === '') {
      const newToken = localStorage.getItem('token')
      return jwt_decode(`${newToken}`)
    } else if (token) {
      return jwt_decode(`${token}`)
    } else {
      return {}
    }
  } catch (e) {
    logout()
    return {}
  }
}

export const getArray = (item) =>
  Array.isArray(item) ? item : item ? JSON.parse(item) : []

export const chunk = (array, chunk) => {
  let chunkCount = parseInt(chunk)
  return [].concat.apply(
    [],
    array.map(function (elem, i) {
      return i % chunkCount ? [] : [array.slice(i, i + chunkCount)]
    })
  )
}

export const login = async (credentials) => {
  try {
    const result = await authRegistryService.login(credentials)
    if (result) {
      let token = result.access_token
      const user = await facilitatorRegistryService.getInfo(
        {},
        { Authorization: 'Bearer ' + token }
      )

      if (user.id) {
        setAuthUser(user, token)
        return { user, token }
      }
    }
  } catch (e) {
    return {
      error: e?.response?.data?.message ? e?.response?.data?.message : e.message
    }
  }
}

export const setAuthUser = (
  { id, last_name, first_name, fullName, ...props },
  token
) => {
  localStorage.setItem('id', id)
  localStorage.setItem('token', token)
  setLocalUser({ last_name, first_name, fullName, ...props })
}

export const setLocalUser = ({
  last_name,
  first_name,
  fullName,
  documents
}) => {
  localStorage.setItem(
    'fullName',
    fullName ? fullName : `${first_name} ${last_name}`
  )

  localStorage.setItem('first_name', first_name)
  localStorage.setItem('last_name', last_name)
  localStorage.setItem('profile_url', documents?.[0]?.name)
}

export const logout = () => {
  localStorage.removeItem('id')
  localStorage.removeItem('fullName')
  localStorage.removeItem('first_name')
  localStorage.removeItem('last_name')
  localStorage.removeItem('token')
  localStorage.removeItem('profile_url')
}

export const getDataObject = (data, key) => {
  const arr = key.split('.')
  let value = data
  arr.forEach((item) => {
    if (value[item]) {
      value = value[item]
    } else {
      value = undefined
    }
  })
  return value
}

export const pagination = (arr = [], limit = 5, page = 1) => {
  const data = arr.slice((page - 1) * limit, page * limit)
  const totalPage = Math.ceil((arr?.length ? arr?.length : 0) / limit)
  return {
    data,
    totalPage,
    currentPage: page,
    limit,
    nextPage: totalPage > page ? page + 1 : null,
    previewPage: page > 1 ? page - 1 : null
  }
}

// filters
export const filtersByObject = (data, filter) => {
  return data.filter((item) => {
    for (let key in filter) {
      if (
        item[key] === undefined ||
        !filter[key]?.includes(
          `${
            item?.[key] && typeof item?.[key] === 'string'
              ? item[key].trim()
              : item[key]
          }`
        )
      ) {
        return false
      }
    }
    return true
  })
}

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let fileInfo
    let baseURL = ''
    // Make new FileReader
    let reader = new FileReader()
    // Convert the file to base64 text
    reader.readAsDataURL(file)
    // on reader load somthing...

    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result
      resolve(baseURL)
    }
  })
}
