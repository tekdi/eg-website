import React from 'react'
import BaseTheme from './theme'
import { extendTheme } from 'native-base'
import jwt_decode from 'jwt-decode'
import * as facilitatorRegistryService from '../services/facilitatorRegistryService'
import * as enumRegistryService from '../services/enumRegistryService'
import * as authRegistryService from '../services/authRegistryService'
import * as volunteerRegistryService from '../services/volunteerRegistryService'
import * as Sentry from '@sentry/react'
import moment from 'moment'
import { del, delMany } from 'idb-keyval'

export const SentryBreadcrumb = async (category, message, data, level) => {
  Sentry.addBreadcrumb({
    category: category,
    message: message,
    data: data,
    level: level
  })
}

export const setSelectedAcademicYear = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    if (data) {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data)
      localStorage.setItem('academic_year', stringData)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const getSelectedAcademicYear = async () => {
  try {
    return jsonParse(localStorage.getItem('academic_year'))
  } catch (error) {
    return {}
  }
}

export const setSelectedProgramId = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    if (data) {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data)
      localStorage.setItem('program', stringData)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const getSelectedProgramId = async () => {
  try {
    return jsonParse(localStorage.getItem('program'))
  } catch (error) {
    return {}
  }
}

export const setSelectedOrgId = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    if (data) {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data)
      localStorage.setItem('org_id', stringData)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const getSelectedOrgId = async () => {
  try {
    return jsonParse(localStorage.getItem('org_id'))
  } catch (error) {
    return {}
  }
}

export const setOnboardingURLData = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    if (data) {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data)
      localStorage.setItem('onboardingURLData', stringData)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const getOnboardingURLData = async () => {
  try {
    return jsonParse(localStorage.getItem('onboardingURLData'))
  } catch (error) {
    return {}
  }
}

export const removeOnboardingURLData = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.removeItem('onboardingURLData')
    return true
  } catch (error) {
    return false
  }
}

export const setOnboardingMobile = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    if (data) {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data)
      localStorage.setItem('onboardingMobile', stringData)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const getOnboardingMobile = async () => {
  try {
    return localStorage.getItem('onboardingMobile')
  } catch (error) {
    return {}
  }
}

export const removeOnboardingMobile = async (data) => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.removeItem('onboardingMobile')
    return true
  } catch (error) {
    return false
  }
}

export function useWindowSize(maxWidth = '1080') {
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

export const getUniqAttendance = (attendances, status, students = []) => {
  let studentIds = students.map((e) => e.id)
  return attendances
    .slice()
    .reverse()
    .filter((value, index, self) => {
      return (
        self.findIndex(
          (m) =>
            value?.studentId === m?.studentId &&
            value?.date === m?.date &&
            value?.attendance === status
        ) === index
      )
    })
    .filter(
      (e) =>
        studentIds.includes(e.studentId) &&
        e.studentId &&
        e.date &&
        e.attendance &&
        e.id
    )
}

export const getStudentsPresentAbsent = (
  attendances,
  students,
  count,
  status = 'Present'
) => {
  const newPresent = getUniqAttendance(attendances, status, students)
  return students
    .map((value) => {
      let newCount = newPresent.filter((e) => e.studentId === value.id).length
      if (newCount >= count) {
        return {
          count,
          id: value.id
        }
      }
      return undefined
    })
    .filter((e) => e?.id)
}

export const getPercentageStudentsPresentAbsent = (
  attendances,
  student,
  workingDaysCount,
  status = 'Present'
) => {
  const newPresent = getUniqAttendance(attendances, status, [student])
  let count = newPresent.filter((e) => e.studentId === student.id).length
  return {
    count,
    percentage: (count * 100) / workingDaysCount,
    ...student
  }
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

export const overrideColorTheme = (colorObject = {}, theme = 'joyfull') => {
  const data = extendTheme(BaseTheme)
  return { ...data.colors, ...colorObject }
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
export const jsonParse = (str, returnObject = {}) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return returnObject
  }
}
export const isJsonString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
export const getArray = (item) =>
  Array.isArray(item)
    ? item
    : item?.constructor?.name === 'String' && isJsonString(item)
    ? JSON.parse(item)
    : []

export const getUniqueArray = (item) => {
  const arr = getArray(item)
  if (Array.isArray(arr)) {
    return arr?.filter((val, index) => {
      return arr.indexOf(val) === index
    })
  } else {
    return []
  }
}

export const chunk = (array, chunk) => {
  if (!Array.isArray(array)) {
    return []
  }

  let chunkCount = parseInt(chunk)
  return [].concat(
    ...array.map(function (elem, i) {
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
  localStorage.removeItem('academic_year')
  localStorage.removeItem('program')
  localStorage.removeItem('loadCohort')
  del('lastFetchTime')
  localStorage.removeItem('org_id')
  localStorage.removeItem('status')
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
export const sendAndVerifyOtp = async (
  schema,
  { mobile, otp, hash },
  type = ''
) => {
  if (otp) {
    const bodyData = {
      mobile: mobile.toString(),
      reason: 'verify_mobile',
      otp: otp.toString(),
      hash: hash
    }
    let verifyotp
    verifyotp = await authRegistryService.verifyOtp(bodyData)
    if (verifyotp.success) {
      return { status: true }
    } else {
      return { status: false }
    }
  } else {
    let otpData = {}
    const sendotpBody = {
      mobile: mobile?.toString(),
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
    if (
      obj[key] != undefined &&
      obj[key] != '-' &&
      obj[key] != '' &&
      arr?.includes(key)
    ) {
      p++
    }
  })
  return (p / arr?.length || 0) * 100
}

export const objProps = (obj) => {
  let result = {}
  for (let val in obj) {
    if (obj[val]?.constructor.name === 'Object') {
      const data = objProps(obj?.[val])
      result = {
        ...result,
        ...(data?.constructor.name === 'Object' ? data : {})
      }
    } else {
      result[val] = obj[val]
    }
  }
  return result
}
export const filterObject = (
  obj,
  arr,
  defaultVlaue = {},
  defaultVlaueAll = undefined
) => {
  let newObj = {}
  arr.forEach((item) => {
    if (obj?.[item] || obj?.[item] === false || obj?.[item] === 0) {
      newObj = { ...newObj, [item]: obj[item] }
    } else if (defaultVlaue?.[item]) {
      newObj = { ...newObj, [item]: defaultVlaue?.[item] }
    } else {
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
      ['enumNames']: arrData.map((e) => `${e?.[title] || e}`)
    }
    enumObj = { ...enumObj, ['enum']: arrData.map((e) => `${e?.[value] || e}`) }
  }
  if (schema) {
    const newProperties = schema?.['properties']?.[key]
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
  } else {
    return schema
  }
}

export const getUiSchema = (schema, { key, extra } = {}) => {
  return {
    ...schema,
    [key]: { ...(schema?.[key] ? schema[key] : {}), ...extra }
  }
}

export const validation = ({ data, key, errors, message, type = '' }) => {
  let regex = /^(?!.*[\u0900-\u097F])[A-Za-z0-9\s\p{P}]+$/
  let boolean = false
  switch (type) {
    case 'aadhaar':
      regex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
      boolean = !`${data}`?.match(regex)
      break
    case 'mobile':
      regex = /^[6-9]\d{9}$/
      boolean = !`${data}`?.match(regex)
      break
    case 'contact_number':
      regex = /^[6-9]\d{9}$/
      boolean = !`${data}`?.match(regex)
      break
    case 'age-18':
      const years = moment().diff(data, 'years')
      boolean = years < 18
      break
    case 'required':
      boolean = data ? true : false
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

export const checkAadhaar = (user, aadhaar, compareList = []) => {
  let isVerified = true
  const arr = [
    'photo',
    'first_name',
    'middle_name',
    'last_name',
    'dob',
    'gender',
    'aadhaar_no'
  ]
  const [first_name, middle_name, last_name] = aadhaar?.name
    ? aadhaar?.name?.split(' ')
    : []
  const data = arr.map((item) => {
    let result = {}
    if (item === 'first_name') {
      result = {
        name: 'FIRST_NAME',
        aadhaar: first_name || '-',
        user: user?.[item] || '-',
        arr: item
      }
      if (compareList?.includes('first_name')) {
        if (result?.aadhaar?.toLowerCase() !== result?.user?.toLowerCase()) {
          isVerified = false
        }

        result = {
          ...result,
          isVerified
        }
      }
    } else if (item === 'middle_name') {
      result = {
        name: 'MIDDLE_NAME',
        aadhaar: last_name ? middle_name : '-',
        user: user?.[item] || '-',
        arr: item
      }
      if (compareList?.includes('middle_name')) {
        if (result?.aadhaar?.toLowerCase() !== result?.user?.toLowerCase()) {
          isVerified = false
        }
      }
    } else if (item === 'last_name') {
      result = {
        name: 'LAST_NAME',
        aadhaar: !last_name ? middle_name || '-' : last_name,
        user: user?.[item] || '-',
        arr: item
      }

      if (compareList?.includes('last_name')) {
        if (result?.aadhaar?.toLowerCase() !== result?.user?.toLowerCase()) {
          isVerified = false
        }
      }
    } else if (item === 'dob') {
      result = {
        name: 'DATE_OF_BIRTH',
        aadhaar: aadhaar?.dateOfBirth
          ? moment(aadhaar?.dateOfBirth, 'D-M-Y').format('Y-M-D')
          : '-',
        user: user?.[item] || '-',
        arr: item
      }
      if (compareList?.includes('dob')) {
        const isTrue = moment(result?.user).isSame(result?.aadhaar)
        if (!isTrue) {
          isVerified = false
        }

        result = {
          ...result,
          isVerified
        }
      }
    } else if (item === 'gender') {
      result = {
        name: 'GENDER',
        aadhaar: aadhaar?.gender || '-',
        user: user?.[item] || '-',
        arr: item
      }
      if (compareList?.includes('dob')) {
        if (
          (result?.aadhaar === 'M' && result?.user !== 'male') ||
          (result?.aadhaar === 'F' && result?.user !== 'female') ||
          (result?.aadhaar === 'O' && result?.user !== 'other')
        ) {
          isVerified = false
        }
        result = {
          ...result,
          isVerified
        }
      }
    } else if (item === 'photo') {
      result = {
        name: 'PHOTO',
        aadhaar: aadhaar?.photo,
        user: [
          user?.profile_photo_1?.id,
          user?.profile_photo_2?.id,
          user?.profile_photo_3?.id
        ],
        arr: item
      }
    } else if (item === 'aadhaar_no') {
      result = {
        name: 'AADHAAR_NO',
        aadhaar: aadhaar?.maskedNumber || '-',
        user: `xxxx-xxxx-${user?.aadhar_no?.substr(
          user?.aadhar_no?.length - 4
        )}`,
        arr: item
      }

      if (compareList?.includes('aadhaar_no') || compareList?.length === 0) {
        if (
          aadhaar?.maskedNumber?.substr(aadhaar?.maskedNumber?.length - 4) !==
          result?.user?.substr(result?.user?.length - 4)
        ) {
          isVerified = false
          result = {
            ...result,
            isVerified: false
          }
        }
      }
    }
    return result
  })
  return { data, isVerified }
}

export const translateEnumOption = async (
  enumType,
  value,
  enumApiData = null
) => {
  let enumData = enumApiData
  if (!enumApiData) {
    enumData = await enumRegistryService.listOfEnum()
  }
  let enumTypeData = enumData[enumType]
  if (enumTypeData?.length > 0) {
    const translation = enumTypeData.find((item) => item.value === value)
    if (translation?.title) {
      return translation?.title
    } else {
      return value
    }
  }
}

export const dateOfBirth = async (dateString) => {
  const today = moment().diff(moment(dateString, 'DD-MM-YYYY'))
  const duration = moment.duration(today)
  const years = duration.years()
  const months = duration.months()
  const days = duration.days()

  return `Years: ${years}, Months: ${months}, Days: ${days}`
}

export const enrollmentDateOfBirth = (enrollmentDate, dateString) => {
  const today = moment(enrollmentDate, 'YYYY-MM-DD').diff(
    moment(dateString, 'YYYY-MM-DD', true)
  )
  const duration = moment.duration(today)
  const years = duration.years()
  const months = duration.months()
  const days = duration.days()
  return {
    message: `Age as per enrollment receipt:  Years: ${years}, Months: ${months}, Days: ${days}`,
    diff: duration.years()
  }
}

export const jsonToQueryString = (json) => {
  if (json?.constructor.name !== 'Object') {
    json = {}
  }
  return (
    '?' +
    Object.keys(json)
      .filter((e) => e && e !== '')
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
      .join('&')
  )
}

export const setQueryParameters = (data) => {
  var pageUrl =
    window.location.origin + window.location.pathname + jsonToQueryString(data)
  window.history.pushState('', '', pageUrl)
}

export const setFilterLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getFilterLocalStorage = (key) => {
  const data = localStorage.getItem(key)
  return jsonParse(data)
}

export const tableCustomStyles = {
  rows: {
    style: {
      minHeight: '70px', // override the row height
      cursor: 'pointer'
    }
  },
  headCells: {
    style: {
      background: 'btnGray.100',
      color: '#616161',
      size: '16px',
      justifyContent: 'flex-start',
      height: '50px'
    }
  },
  cells: {
    style: {
      color: '#616161',
      size: '19px',
      justifyContent: 'flex-start'
    }
  },
  pagination: {
    style: {
      background: 'btnGray.100',
      borderRadius: '20px',
      margin: '30px 0px',
      minHeight: '45px'
    }
  }
}

export const getBeneficaryDocumentationStatus = (docStatus) => {
  if (!docStatus) {
    return false
  } else {
    const JsonConvert = docStatus ? JSON.parse(docStatus) : {}
    // Check if all values are either "complete" or "not_applicable"
    const isAllCompleteOrNotApplicable = Object.values(JsonConvert).every(
      (value) => value === 'complete' || value === 'not_applicable'
    )
    return isAllCompleteOrNotApplicable ? true : false
  }
}
export const sprintF = (str, ...args) => {
  return str.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match
  })
}

export const urlData = (only = []) => {
  return location.search
    .slice(1)
    .split('&')
    .map((p) => p.split('='))
    .reduce((obj, pair) => {
      const [key, value] = pair.map(decodeURIComponent)
      if (key && value && key !== '') {
        if (only.includes(key) && value != '') {
          const newValue = value.split(',')
          obj[key] = newValue
        } else {
          obj[key] = value
        }
      }
      return obj
    }, {})
}
// Calculate map distance
export const mapDistance = (lat1, lon1, lat2, lon2) => {
  lon1 = (lon1 * Math.PI) / 180
  lon2 = (lon2 * Math.PI) / 180
  lat1 = (lat1 * Math.PI) / 180
  lat2 = (lat2 * Math.PI) / 180
  // Haversine formula
  let dlon = lon2 - lon1
  let dlat = lat2 - lat1
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)
  let c = 2 * Math.asin(Math.sqrt(a))
  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371
  const location_distance = c * r
  const totalDistance = location_distance.toFixed(2)
  return totalDistance
}

export const getFileTypeFromBase64 = async (base64String) => {
  // Extract base64 header which contains the file type
  // Split the base64 string by comma
  if (base64String) {
    //console.log("base64String", base64String);
    const parts = base64String.split(',')

    // Extract the header portion containing the file type
    const header = parts[0]

    // Extract the file type from the header
    const fileType = header.split(':')[1].split(';')[0]

    return fileType
  }
  return null
}
export const getEnrollmentIds = (dataArr, state_name) => {
  if (Array?.isArray(dataArr)) {
    if (state_name === 'RAJASTHAN') {
      return {
        payment_receipt_document_id: dataArr?.find(
          (e) => e?.key == 'payment_receipt_document_id'
        )?.id
      }
    }
    return {
      payment_receipt_document_id: dataArr?.find(
        (e) => e?.key == 'payment_receipt_document_id'
      )?.id,
      application_form:
        dataArr?.find((e) => e?.key == 'application_form')?.id || undefined,
      application_login_id:
        dataArr?.find((e) => e?.key == 'application_login_id')?.id || undefined
    }
  }
  return {}
}
