import { sendPostRequest } from "./service"

export const loginRequest = async(phoneNumber, password) => {
    return await sendPostRequest("post", "/api/public/user/login", {
        phoneNumber: phoneNumber,
        password: password
    })
}