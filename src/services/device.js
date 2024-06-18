import { sendGetRequest } from "./service"

export const listOrgDeviceRequest = async(orgId) => {
    return sendGetRequest(`/api/private/device/${orgId}`)
}