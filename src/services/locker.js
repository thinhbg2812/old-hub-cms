import { sendGetRequest, sendPostRequest } from "./service";

export const getDeviceLockerRequest = async deviceId => {
  return sendGetRequest(`/api/private/device/${deviceId}/locker`);
};

export const addStackRequest = async (
  lockerId,
  size,
  position,
  boardIndex,
  lockIndex,
  xDirection,
  yDirection
) => {
  const params = {
    lockerId,
    size,
    position,
    boardIndex,
    lockIndex,
    xDirection,
    yDirection,
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

export const addLockerRequest = async (
  deviceId,
  name,
  address,
  roofLightOnTime,
  roofLightOffTime
) => {
  const params = {
    deviceId,
    name,
    address,
    roofLightOffTime,
    roofLightOnTime,
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

export const updateLockerRequest = async (
  lockerId,
  name,
  address,
  deviceId,
  roofLightOffTime,
  roofLightOnTime
) => {
  const params = {
    lockerId,
    name,
    address,
  };
  if (deviceId) {
    params.deviceId = deviceId;
  }
  if (roofLightOffTime) {
    params.roofLightOffTime = roofLightOffTime;
  }
  if (roofLightOnTime) {
    params.roofLightOnTime = roofLightOnTime;
  }
  return sendPostRequest("put", "/api/private/device/locker", params);
};
