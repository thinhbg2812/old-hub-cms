import { sendGetRequest, sendPostRequest } from "./service";

export const listOrgDeviceRequest = async orgId => {
  return sendGetRequest(`/api/private/device/${orgId}`);
};

export const requestGetSampleRequest = async (deviceId, userId, handType) => {
  const params = {
    deviceId: deviceId,
    userId: userId,
    handType: handType,
  };
  return sendPostRequest("post", "/api/private/device/sample", params);
};

export const createDeviceRequest = async (deviceId, deviceName, orgId) => {
  const params = {
    deviceId: deviceId,
    deviceName: deviceName,
    orgId: orgId,
  };
  return sendPostRequest("post", "/api/private/device", params);
};

export const getDeviceRequest = async (id, orgId) => {
  return sendGetRequest(`/api/device/${id}/${orgId}`);
};
