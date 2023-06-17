import React from 'react'
import BaseTheme from './theme'
import { extendTheme } from 'native-base'
import jwt_decode from 'jwt-decode'
import * as facilitatorRegistryService from '../services/facilitatorRegistryService'
import * as enumRegistryService from '../services/enumRegistryService'
import * as authRegistryService from '../services/authRegistryService'
import * as Sentry from '@sentry/react'
import moment from 'moment'
import { t } from 'i18next'

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
    let data = new URLSearchParams()
    for (let param in credentials) {
      data.append(param, credentials[param])
    }

    const result = await authRegistryService.login(data)
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
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message
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
  profile_photo_1
}) => {
  localStorage.setItem(
    'fullName',
    fullName ? fullName : `${first_name} ${last_name}`
  )

  localStorage.setItem('first_name', first_name)
  localStorage.setItem('last_name', last_name)
  localStorage.setItem('profile_url', profile_photo_1?.name)
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
          `${item?.[key] && typeof item?.[key] === 'string'
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

export const updateSchemaEnum = (
  schema,
  { key, arr, title, value, filters } = {}
) => {
  let enumObj = {}
  let arrData = arr
  if (!_.isEmpty(filters)) {
    arrData = filtersByObject(arr, filters)
  }
  enumObj = {
    ...enumObj,
    ['enumNames']: arrData.map((e) => `${e?.[title]}`)
  }
  enumObj = { ...enumObj, ['enum']: arrData.map((e) => `${e?.[value]}`) }
  const newProperties = schema['properties'][key]
  let properties = {}
  if (newProperties) {
    if (newProperties.enum) delete newProperties.enum
    let { enumNames, ...remainData } = newProperties
    properties = remainData
  }
  return {
    ...schema,
    ['properties']: {
      ...schema['properties'],
      [key]: {
        ...properties,
        ...(_.isEmpty(arr) ? {} : enumObj)
      }
    }
  }
}
export const sendAndVerifyOtp = async (schema, { mobile, otp, hash }) => {
  if (otp) {
    const bodyData = {
      mobile: mobile.toString(),
      reason: 'verify_mobile',
      otp: otp.toString(),
      hash: hash
    }
    const verifyotp = await authRegistryService.verifyOtp(bodyData)
    if (verifyotp.success) {
      return { status: true }
    } else {
      return { status: false }
    }
  } else {
    let otpData = {}
    const sendotpBody = {
      mobile: mobile.toString(),
      reason: 'verify_mobile'
    }

    const sendOtpData = async () => {
      let reset = true
      otpData = await authRegistryService.sendOtp(sendotpBody)
      const result = otpData?.data
      localStorage.setItem('hash', otpData?.data?.hash)
      // console.log(otpData)
    }

    if (!schema?.properties?.otp) {
      await sendOtpData()
    }

    const newSchema = {
      ...schema,
      required: ['otp', 'mobile'],
      properties: {
        ...schema['properties'],
        otp: {
          description: 'USER_ENTER_FOUR_DIGIT_OTP',
          type: 'number',
          title: 'OTP',
          format: 'CustomOTPBox',
          onClickResendOtp: sendOtpData,
          mobile
        }
      }
    }

    return { otpData, newSchema }
  }
}
export const arrList = (obj, arr) => {
  let p = 0
  const keyz = obj?.constructor?.name === 'Object' ? Object.keys(obj) : []
  keyz.forEach((key) => {
    if (obj[key] != undefined && obj[key] != '' && arr.includes(key)) {
      p++
    }
  })
  return (p / arr.length) * 100
}

export const filterObject = (
  obj,
  arr,
  defaultVlaue = {},
  defaultVlaueAll = ''
) => {
  let newObj = {}
  arr.forEach((item) => {
    if (obj?.[item]) {
      newObj = { ...newObj, [item]: obj[item] }
    } else if (defaultVlaue?.[item]) {
      newObj = { ...newObj, [item]: defaultVlaue?.[item] }
    } else if (['', 0].includes(defaultVlaueAll)) {
      newObj = { ...newObj, [item]: defaultVlaueAll }
    }
  })
  return newObj
}

export const getOptions = (
  schema,
  { key, arr, title, value, filters, extra } = {}
) => {
  let enumObj = {}
  let arrData = arr
  if (arrData?.length > 0) {
    if (!_.isEmpty(filters)) {
      arrData = filtersByObject(arr, filters)
    }
    enumObj = {
      ...enumObj,
      ['enumNames']: arrData.map((e) => `${e?.[title]}`)
    }
    enumObj = { ...enumObj, ['enum']: arrData.map((e) => `${e?.[value]}`) }
  }
  const newProperties = schema['properties']?.[key]
  let properties = {}
  if (newProperties) {
    if (newProperties?.enum) delete newProperties.enum
    let { enumNames, ...remainData } = newProperties
    properties = remainData
  }
  if (newProperties?.type === 'array') {
    return {
      ...schema,
      ['properties']: {
        ...schema['properties'],
        [key]: {
          ...{ ...properties, ...(extra ? extra : {}) },
          items: {
            ...(properties?.items ? properties?.items : {}),
            ...(_.isEmpty(arr) ? {} : enumObj)
          }
        }
      }
    }
  } else {
    return {
      ...schema,
      ['properties']: {
        ...schema['properties'],
        [key]: {
          ...{ ...properties, ...(extra ? extra : {}) },
          ...(_.isEmpty(arr) ? {} : enumObj)
        }
      }
    }
  }
}

export const validation = ({ data, key, errors, message, type = '' }) => {
  let regex = /^(?!.*[\u0900-\u097F])[A-Za-z0-9\s\p{P}]+$/
  let boolean = false
  switch (type) {
    case 'aaddhaar':
      regex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
      boolean = !`${data}`?.match(regex)
      break
    case 'mobile':
      regex = /^[6-9]\d{9}$/
      boolean = !`${data}`?.match(regex)
      break
    case 'age-18':
      const years = moment().diff(data, 'years')
      boolean = years < 18
      break
    default:
      regex = /^(?!.*[\u0900-\u097F])[A-Za-z0-9\s\p{P}]+$/
      boolean = !`${data}`?.match(regex)
      break
  }

  if (errors) {
    if (boolean) {
      return errors?.[key]?.addError(message)
    } else {
      return errors
    }
  } else {
    return boolean
  }
}
export const translateEnumOption = async (enumType, value, enumApiData = null) => {
  let enumData = enumApiData
  if (!enumApiData) {
    enumData = await enumRegistryService.listOfEnum();
  }
  let enumTypeData = enumData[enumType];
  if (enumTypeData?.length > 0) {
    const translation = enumTypeData.find((item) => item.value === value);
    if (translation?.title) {
      return translation?.title
    }
    else {
      return value
    }
  }

}
