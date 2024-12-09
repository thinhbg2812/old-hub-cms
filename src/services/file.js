import axios from "axios";
import { sendGetRequest } from "./service";
import download from "js-file-download";

export const uploadFileRequest = async file => {
  const formData = new FormData();
  formData.append("myFile", file, file.name);
  const config = {
    method: "post",
    url: process.env.REACT_APP_BE_DOMAIN + "/api/file/upload",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  try {
    const resp = await axios.postForm(
      process.env.REACT_APP_BE_DOMAIN + "/api/file/upload",
      formData,
      config
    );
    return resp.data;
  } catch (error) {
    return {
      isError: true,
      msg: error.response.data.message,
    };
  }
};

export const downloadRequest = async adsId => {
  const params = {
    adsId,
  };
  const reqs = {
    method: "get",
    url: process.env.REACT_APP_BE_DOMAIN + "/api/file/ads",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    params: params,
    responseType: "blob",
  };
  try {
    const resp = await axios(reqs);
    const disposition = resp.headers["content-disposition"];
    let filename = disposition
      .split(";")[1]
      .split("=")[1]
      .replace('"', "")
      .replace('"', "");
    filename = decodeURI(filename);
    download(resp.data, filename);
    return {
      isError: false,
    };
  } catch (error) {
    return {
      isError: true,
      msg: error.response.data.message,
    };
  }
};

export const importStackFile = async (file, lockerId) => {
  const formData = new FormData();
  formData.append("myFile", file, file.name);
  const config = {
    method: "post",
    url: process.env.REACT_APP_BE_DOMAIN + "/api/file/importStack",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  try {
    const resp = await axios.postForm(
      process.env.REACT_APP_BE_DOMAIN +
        `/api/file/importStack?lockerId=${lockerId}`,
      formData,
      config
    );
    return resp.data.data;
  } catch (error) {
    return {
      isError: true,
      msg: error.response.data.message,
    };
  }
};
