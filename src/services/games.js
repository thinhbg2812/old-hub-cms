import { sendGetRequest, sendPostRequest } from "./service";

export const getActiveGameRequest = async deviceId => {
  const params = {
    deviceId,
  };
  return sendGetRequest("/api/private/games/active", params);
};
export const createGamesRequest = async ({
  deviceId,
  sponsorName,
  code,
  giftName,
  giftValue,
}) => {
  const params = {
    deviceId,
    sponsorName,
    code,
    giftName,
    giftValue,
  };
  return sendPostRequest("post", "/api/private/games", params);
};
export const updateGamesStatusRequest = async (id, status) => {
  const params = {
    id,
    status,
  };
  return sendPostRequest("put", "/api/private/games/status", params);
};
