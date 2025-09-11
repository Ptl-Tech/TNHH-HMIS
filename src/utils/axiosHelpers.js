import axios from "axios";

export const axiosConfig = (user) => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post["staffNo"] = user?.staffNo;
  axios.defaults.headers.post["branchCode"] = user?.branchCode;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const isInAuthPages = new Set([
        "/login",
        "/forgot-password",
        "/reset-password",
      ]).has(window.location.pathname);

      if (error.response?.status === 401 && !isInAuthPages) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
