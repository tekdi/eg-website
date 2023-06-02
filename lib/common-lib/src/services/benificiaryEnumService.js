import { get } from './RestClient'

export const getStatusList = async (filters = {}, header = {}) => {
    try {
        let headers = {
            ...header,
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
        const result = await get(
            process.env.REACT_APP_API_URL + '/enum/enum_value_list?key=BENEFICIARY_STATUS',
            {
                headers
            }
        )

        if (result?.data?.data) {
            return result?.data?.data
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
