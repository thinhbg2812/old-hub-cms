import { sendGetRequest, sendPostRequest } from "./service";

export const loginRequest = async (phoneNumber, password) => {
  return await sendPostRequest("post", "/api/public/user/login", {
    phoneNumber: phoneNumber,
    password: password,
  });
};

export const listUserRequest = async (page, size) => {
  return await sendGetRequest("/api/private/user/", {
    page: page,
    size: size,
  });
};
export const createUserRequest = async (
  phoneNumber,
  fullName,
  status,
  orgId,
  deviceId,
  roomDetails,
  vehicleDetails
) => {
  let params = {
    phoneNumber: phoneNumber,
    fullName: fullName,
    status: status,
    orgId: orgId,
    deviceId: deviceId,
    roomDetails,
    vehicleDetails,
  };
  return await sendPostRequest("post", "/api/private/user", params);
};

export const editUserRequest = async (
  fullName,
  status,
  orgId,
  userId,
  phoneNumber
) => {
  let params = {
    userId: userId,
  };
  if (fullName) {
    params.fullName = fullName;
  }
  if (status) {
    params.status = status;
  }
  if (orgId) {
    params.orgId = orgId;
  }
  if (phoneNumber) {
    params.phoneNumber = phoneNumber;
  }
  return await sendPostRequest("put", "/api/private/user", params);
};
