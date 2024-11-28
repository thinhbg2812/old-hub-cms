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
  fileType,
  status,
  externalLink
) => {
  const params = {
    deviceId,
    adsName,
    position,
    adsLength,
    adsType,
    filePath,
    fileType,
    status,
    externalLink,
  };
  return sendPostRequest("post", "/api/private/ads", params);
};

export const getAdsRequest = async adsId => {
  const params = {
    adsId,
  };
  return sendGetRequest("/api/private/ads/get", params);
};

export const updateAdsRequest = async (
  id,
  position,
  adsName,
  adsLength,
  adsType,
  filePath,
  fileType,
  externalLink
) => {
  const params = {
    id,
    position,
    adsName,
    adsLength,
    adsType,
    filePath,
    fileType,
    externalLink,
  };
  return sendPostRequest("put", "/api/private/ads", params);
};

export const deleteAdsRequest = id => {
  const params = {
    id,
  };
  return sendPostRequest("delete", "/api/private/ads", params);
};
