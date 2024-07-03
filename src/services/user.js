import { sendGetRequest, sendPostRequest } from "./service";

export const loginRequest = async (phoneNumber, password) => {
  return await sendPostRequest("post", "/api/public/user/login", {
    phoneNumber: phoneNumber,
    password: password,
  });
};

export const listUserRequest = async (page, size, searchKey) => {
  return await sendGetRequest("/api/private/user/", {
    page: page,
    size: size,
    searchKey: searchKey,
  });
};
export const createUserRequest = async (
  phoneNumber,
  fullName,
  status,
  orgId
) => {
  let params = {
    phoneNumber: phoneNumber,
    fullName: fullName,
    status: status,
    orgId: orgId,
  };
  return await sendPostRequest("post", "/api/private/user", params);
};

export const updateUserRequest = async (
  fullName,
  status,
  orgId,
  userId,
  phoneNumber,
  vehicleDetails,
  roomDetails
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
  if (vehicleDetails) {
    params.vehicleDetails = vehicleDetails;
  }
  if (roomDetails) {
    params.roomDetails = roomDetails;
  }
  return await sendPostRequest("put", "/api/private/user", params);
};
