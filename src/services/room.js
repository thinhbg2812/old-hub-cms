import { sendGetRequest, sendPostRequest } from "./service";

export const listRoomRequest = async (orgId, page, size) => {
  let params = {
    orgId: orgId,
    page: page,
    size: size,
  };
  return await sendGetRequest("/api/private/room", params);
};
export const createRoomRequest = async (roomNumber, keypass, status, orgId) => {
  let params = {
    roomNumber: roomNumber,
    keypass: keypass,
    status: status === "active" ? true : false,
    orgId: orgId,
  };
  return await sendPostRequest("post", "/api/private/room", params);
};

export const editRoomRequest = async (
  roomNumber,
  keypass,
  roomId,
  orgId,
  status
) => {
  let params = {
    roomNumber: roomNumber,
    roomId: roomId,
    keypass: keypass,
    orgId: orgId,
    status: status === "active" ? true : false,
  };
  return await sendPostRequest("put", "/api/private/room", params);
};
