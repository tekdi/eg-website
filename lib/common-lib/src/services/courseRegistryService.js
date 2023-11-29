import mapInterfaceData from './mapInterfaceData'
import { get, post, update as coreUpdate } from './RestClient'

const interfaceData = {
  id: 'courseId',
  name: 'name',
  posterImage: 'posterImage',
  subject: 'subject',
  description: 'description',
  children: 'children'
}

let only = Object.keys(interfaceData)
let baseUrl = process.env.REACT_APP_API_URL

export const getAll = async ({ adapter, ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    headers: {
      ...header.header,
      Authorization: 'Bearer ' + sessionStorage.getItem('token')
    }
  }
  const result = await get(
    process.env.REACT_APP_API_URL + '/course/' + adapter + '/search',
    null,
    { params, headers }
  )

  if (result.data.data) {
    const newData = result.data.data.map((e) =>
      mapInterfaceData(e, interfaceData)
    )
    return await getDataWithUser(newData)
  } else {
    return []
  }
}

export const getOne = async (
  { id, adapter, coreData, type, userId, courseType },
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }
  try {
    const result = await get(
      baseUrl + '/course/' + adapter + '/hierarchy/contentid',
      {
        params: { courseId: id, type: type },
        headers
      }
    )
    if (result?.data?.data) {
      if (coreData) {
        if (coreData === 'withLesonFilter') {
          const { children } = result?.data?.data
          if (children) {
            const childrenTracking = await Promise.all(
              children.map(async (item) => {
                const resultData = await getDataWithTracking(
                  item?.children,
                  userId
                )
                return { ...item, children: resultData }
              })
            )
            return {
              ...result?.data?.data,
              children: childrenTracking,
              courseType
            }
          }
          return { ...result?.data?.data, courseType }
        } else {
          const trakingData = await courseTrackingSearch({
            courseId: id,
            lessonId: id,
            userId: userId ? userId : localStorage.getItem('id')
          })
          return { ...result?.data?.data, trakingData, courseType }
        }
      }
      return mapInterfaceData(result.data.data, interfaceData)
    } else {
      return {}
    }
  } catch (e) {
    console.log('course/hierarchy/contentid', e.message)
    return {}
  }
}

export const getContent = async ({ id, adapter }, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await get(
      baseUrl + '/course/' + adapter + '/content/courseid',
      {
        params: {
          courseId: id
        },
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else if (result?.data?.result) {
      return result.data?.result?.content
    } else {
      return {}
    }
  } catch {
    return {}
  }
}

export const lessontracking = async (
  { program, subject, ...params },
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    setTimeout(async () => {
      const result = await post(
        baseUrl + '/altlessontracking/altcheckandaddlessontracking',
        params,
        { params: { program, subject }, headers }
      )
      if (result?.data?.data) {
        return result.data?.data
      } else {
        return {}
      }
    }, 3000)
  } catch (e) {
    console.log(e)
  }
}

export const getLessontracking = async ({ userId, ...params }, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await post(
      `${baseUrl}/altlessontracking/search/${userId}`,
      { filters: params },
      {
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch {
    return {}
  }
}

export const coursetracking = async (params, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await post(
      baseUrl + '/alt-course-tracking/altcreatecoursetracking',
      params,
      {
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch {
    return {}
  }
}

export const getDataWithTracking = async (data, userId) => {
  if (Array.isArray(data)) {
    return await Promise.all(
      data.map(async (item) => {
        const trakingData = await courseTrackingSearch({
          lessonId: item?.identifier,
          userId: userId ? userId : localStorage.getItem('id')
        })
        return { ...item, trakingData }
      })
    )
  } else {
    return []
  }
}

export const courseTrackingSearch = async (
  { limit, userId, ...params },
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await post(
      `${baseUrl}/altlessontracking/search/${userId}`,
      { filters: params, limit },
      {
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else {
      return []
    }
  } catch {
    return []
  }
}

export const moduleTracking = async (
  { limit, userId, ...params } = {},
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await post(
      `${baseUrl}/altmoduletracking/search/${userId}`,
      { filters: params, limit },
      {
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else {
      return []
    }
  } catch {
    return []
  }
}

export const courseTrackingRead = async ({ id, ...params }, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  

  try {
    const result = await get(baseUrl + '/course/{questionset}/questionsetid', {
      params: { questionsetId: id },
      headers
    })

    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch {
    return {}
  }
}

export const courseStatus = async (params, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  try {
    const result = await post(
      baseUrl + '/altusereligibility/altuserprogrameligibility',
      params,
      { params, headers }
    )

    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch {
    return {}
  }
}

export const getTestAllowStatus = async (
  { id, adapter, coreData, type, userId, courseType },
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }
  try {
    const result = await get(
      baseUrl + '/lms/test',
      {
        params: {},
        headers
      }
    )
    if (result?.data?.data) {
      return result.data?.data
    } else {
      return {}
    }
  } catch (e) {
    console.log('Get Test status api', e.message)
    return {}
  }
}


export const getAssessment = async (
  do_id ,
  header = {}
) => {
  console.log("INSIDE HIERARCHY API");
  console.log(do_id);
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      "https://sunbirdsaas.com/learner/questionset/v1/hierarchy/" + do_id,
      {
        headers
      }
    )
    if (result) {
  console.log(result.data.result.questionSet)
      return result.data.result.questionSet
    } else {
      return {}
    }
  } catch (e) {
    console.log('course/hierarchy/contentid', e.message)
    return {}
  }
}


export const testTrackingCreate = async (
  data,
  header = {}
) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  console.log("testTrackingCreate inside API 1")
  console.log(data);
  try {
    const result = await post(
      baseUrl + '/lms/testTracking',
      data,
      {
        headers
      }
    )
    if (result) {
      console.log("testTrackingCreate inside API")
      console.log(result)
      return result
    } else {
      return {}
    }
  } catch (e) {
    console.log('Get Test status api', e.message)
    return {}
  }
}
