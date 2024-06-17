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