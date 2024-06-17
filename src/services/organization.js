import { sendGetRequest } from "./service"

export const listOrgRequest = async(page, size) => {
    return sendGetRequest("/api/private/org", {
        page: page,
        size: size
    })
}