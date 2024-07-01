import { sendGetRequest, sendPostRequest } from "./service";

export const createVehicleRequest = async (
  licensePlate,
  vehicleType,
  status,
  orgId
) => {
  let params = {
    licensePlate: licensePlate,
    vehicleType: vehicleType,
    status: status,
    orgId: orgId,
  };
  return await sendPostRequest("post", "/api/private/vehicle", params);
};

export const listVehicleRequests = async (orgId, page, size) => {
  let params = {
    orgId: orgId,
    page: page,
    size: size,
  };
  return await sendGetRequest("/api/private/vehicle", params);
};
