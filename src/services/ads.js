import { sendGetRequest, sendPostRequest } from "./service";

export const listAdsRequest = async deviceId => {
  const params = {
    deviceId,
  };
  return sendGetRequest("/api/private/ads", params);
};

export const createAdsRequest = async (
  deviceId,
  adsName,
  position,
  adsLength,
  adsType,
  filePath,
  fileType
) => {
  const params = {
    deviceId,
    adsName,
    position,
    adsLength,
    adsType,
    filePath,
    fileType,
  };
  return sendPostRequest("/api/private/ads", params);
};
