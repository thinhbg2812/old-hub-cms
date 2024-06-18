import { sendGetRequest, sendPostRequest } from "./service"

export const loginRequest = async(phoneNumber, password) => {
    return await sendPostRequest("post", "/api/public/user/login", {
        phoneNumber: phoneNumber,
        password: password
    })
}

export const listUserRequest = async(page, size) => {
    return await sendGetRequest("/api/private/user/", {
        page: page,
        size: size
    })
}
export const createUserRequest = async(phoneNumber, fullName, status, orgId, deviceId) => {
    console.log(2)
    let params = {
        phoneNumber: phoneNumber,
        fullName: fullName,
        status: status,
        orgId: orgId,
        deviceId: deviceId
    }
    return await sendPostRequest("post", "/api/private/user", params)
}