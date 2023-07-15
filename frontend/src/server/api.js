import axios from "axios";
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from "../constants/config";

const API_URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  function (response) {
    return processResponse(response);
  },
  function (error) {
    return Promise.reject(processError(error));
  }
);
const processResponse = (response) => {
  if (response.status?.status === 200) {
    return { isSucess: true, data: response.data };
  } else {
    return {
      isFailure: true,
      staus: response?.status,
      msg: response?.msg,
      code: response?.code,
    };
  }
};
const processError = async (error) => {
  if (error.response) {
    // Request made and server responded with a status code
    // that falls out of the range of 2xx
    if (error.response?.status === 403) {
      // const { url, config } = error.response;
      // console.log(error);
      // try {
      //     let response = await API.getRefreshToken({ token: getRefreshToken() });
      //     if (response.isSuccess) {
      sessionStorage.clear();
      //         setAccessToken(response.data.accessToken);

      //         const requestData = error.toJSON();

      //         let response1 = await axios({
      //             method: requestData.config.method,
      //             url: requestData.config.baseURL + requestData.config.url,
      //             headers: { "content-type": "application/json", "authorization": getAccessToken() },
      //             params: requestData.config.params
      //         });
      //     }
      // } catch (error) {
      //     return Promise.reject(error)
      // }
    } else {
      console.log("ERROR IN RESPONSE: ", error.toJSON());
      return {
        isError: true,
        msg: API_NOTIFICATION_MESSAGES.responseFailure,
        code: error.response.status,
      };
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.log("ERROR IN RESPONSE: ", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailure,
      code: "",
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("ERROR IN RESPONSE: ", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.networkError,
      code: "",
    };
  }
};

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
  API[key] = (body, showUploadProgress, showDownloadProgress) =>
    axiosInstance({
      method: value.method,
      url: value.url,
      data: body,
      responseType: value.responseType,
      // headers: {
      //   authorization: getAccessToken(),
      // },
      // TYPE: getType(value, body),
      onUploadProgress: function (progressEvent) {
        if (showUploadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showUploadProgress(percentCompleted);
        }
      },
      onDownloadProgress: function (progressEvent) {
        if (showDownloadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showDownloadProgress(percentCompleted);
        }
      },
    });
}

export { API };