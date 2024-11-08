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

export const deleteStackRequest = async stackId => {
  const params = {
    stackId,
  };
  return sendPostRequest("delete", "/api/private/device/locker/stack", params);
};

export const removeLockerRequest = async lockerId => {
  const params = {
    lockerId,
  };
  return sendPostRequest("put", "/api/private/device/locker/remove", params);
};
