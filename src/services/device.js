import { sendGetRequest, sendPostRequest } from "./service";

export const listOrgDeviceRequest = async (orgId, page, size) => {
  const params = {
    page: page,
    size: size,
  };
  if (orgId) {
    params.orgId = orgId;
  }
  return sendGetRequest(`/api/private/device`, params);
};

export const requestGetSampleRequest = async (deviceId, userId, handType) => {
  const params = {
    deviceId: deviceId,
    userId: userId,
    handType: handType,
  };
  return sendPostRequest("post", "/api/private/device/sample", params);
};

export const createDeviceRequest = async (
  deviceId,
  deviceName,
  orgId,
  password,
  shipVerifyMode,
  userVerifyMode
) => {
  const params = {
    deviceId: deviceId,
    deviceName: deviceName,
    orgId: orgId,
    password,
    shipVerifyMode,
    userVerifyMode,
  };
  return sendPostRequest("post", "/api/private/device", params);
};

export const getDeviceRequest = async (id, orgId) => {
  return sendGetRequest(`/api/device/${id}/${orgId}`);
};
export const updateDeviceRequest = async (
  id,
  deviceName,
  orgId,
  password,
  shipVerifyMode,
  userVerifyMode
) => {
  const params = {
    id: id,
    deviceName: deviceName,
    orgId: orgId,
    password,
    shipVerifyMode,
    userVerifyMode,
  };
  return sendPostRequest("put", "/api/private/device", params);
};
