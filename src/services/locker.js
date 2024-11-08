import { sendGetRequest, sendPostRequest } from "./service";

export const getDeviceLockerRequest = async deviceId => {
  return sendGetRequest(`/api/private/device/${deviceId}/locker`);
};

export const addStackRequest = async (lockerId, size, position) => {
  const params = {
    lockerId,
    size,
    position,
  };
  return sendPostRequest("post", "/api/private/device/locker/stack", params);
};

export const addMultiStackRequest = async (lockerId, size, stack) => {
  const params = {
    lockerId,
    size,
    stack,
  };
  return sendPostRequest("post", "/api/private/device/locker/stacks", params);
};

export const addLockerRequest = async (deviceId, name, address) => {
  const params = {
    deviceId,
    name,
    address,
  };
  return sendPostRequest("post", "/api/private/device/locker", params);
};
