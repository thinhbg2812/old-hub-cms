import axios from 'axios';

export const sendPostRequest = async (requestType, uri, data, isPublic) => {
  const config = {
    method: requestType,
    url: process.env.REACT_APP_BE_DOMAIN + uri,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    data: JSON.stringify(data),
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.data.message === 'Invalid token') {
        sessionStorage.setItem('token', '');
        window.location.reload();
      }
    }
    return {
      isError: true,
      msg: error.message,
    };
  }
};

export const sendGetRequest = async (uri, request) => {
  const config = {
    method: 'get',
    url: process.env.REACT_APP_BE_DOMAIN + uri,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    params: request,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.data.message === 'Invalid token') {
        sessionStorage.setItem('token', '');
        window.location.reload();
      }
    }
    return {
      isError: true,
      msg: error.message,
    };
  }
};
