import { get, post, update as coreUpdate } from './RestClient'


let baseUrl = process.env.REACT_APP_API_URL


export const getAssessment = async (do_id, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await get(
      'https://sunbirdsaas.com/learner/questionset/v1/hierarchy/' + do_id,
      {
        headers
      }
    )
    if (result) {
      return result.data.result.questionSet
    } else {
      return {}
    }
  } catch (e) {
    console.log('course/hierarchy/contentid', e.message)
    return {}
  }
}

export const testTrackingCreate = async (data, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  try {
    const result = await post(baseUrl + '/lms/testTracking', data, {
      headers
    })
    if (result) {
      return result
    } else {
      return {}
    }
  } catch (e) {
    console.log('Get Test status api', e.message)
    return {}
  }
}
