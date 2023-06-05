import { get, post, update } from './RestClient'

export const getDocumentStatus = async (params = {}, header = {}) => {
    try {
        let headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            ...header
        }
        const result = await get(`${process.env.REACT_APP_API_URL}/enum/enum_value_list?key=DOCUMENT_STATUS`, {
            params,
            headers
        })
        if (result.data) {
            return result.data.data
        } else {
            return []
        }
    } catch ({ response, message }) {
        return {
            status: response?.status ? response?.status : 404,
            error: response?.data?.message ? response?.data?.message : message
        }
    }
}

export const statusUpdate = async (id, data = {}, header = {}) => {
    try {
        let headers = {
            ...header
        }
        const result = await update(
            `${process.env.REACT_APP_API_URL}/beneficiaries/${id}`,
            data,
            {
                headers
            }
        )
        if (result?.data?.beneficiaries) {
            return result?.data?.beneficiaries
        } else {
            return {}
        }
    } catch ({ response, message }) {
        return {
            status: response?.status ? response?.status : 404,
            error: response?.data?.message ? response?.data?.message : message
        }
    }
}

export const getOne = async (id, header = {}) => {
    try {
        let headers = {
            ...header,
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
        const result = await get(
            process.env.REACT_APP_API_URL + '/beneficiaries/' + id,
            {
                headers
            }
        )
        if (result?.data?.data) {
            return result?.data?.data
        } else {
            return {}
        }
    } catch ({ response, message }) {
        return {
            status: response?.status ? response?.status : 404,
            error: response?.data?.message ? response?.data?.message : message
        }
    }
}