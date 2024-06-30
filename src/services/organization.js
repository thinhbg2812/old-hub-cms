import { sendGetRequest, sendPostRequest } from './service';

export const listOrgRequest = async (page, size) => {
  return sendGetRequest('/api/private/org', {
    page: page,
    size: size,
  });
};

export const createOrgRequest = async (
  orgName,
  address,
  phoneNumber,
  website,
  parentOrgId
) => {
  let params = {
    orgName: orgName,
    address: address,
    phoneNumber: phoneNumber,
  };
  if (website) {
    params.website = website;
  }
  if (parentOrgId) {
    params.parentOrgId = parentOrgId;
  }
  return sendPostRequest('post', '/api/private/org', params);
};

export const getOrgRequest = async orgId => {
  return sendGetRequest(`/api/private/org/${orgId}`);
};

export const updateOrgRequest = async (values, orgId) => {
  values.orgId = orgId;
  return sendPostRequest('put', '/api/private/org', values);
};
