import axios from "axios";

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
