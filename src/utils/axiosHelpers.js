import axios from "axios";

export const axiosConfig = (user) => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post["staffNo"] = user?.staffNo;
  axios.defaults.headers.post["branchCode"] = user?.branchCode;

  axios.interceptors.response.use(
    (response) => response,
    (rejected) => {
      const isInAuthPages = new Set([
        "/login",
        "/forgot-password",
        "/reset-password",
      ]).has(window.location.pathname);

      if (rejected.status === 401 && !isInAuthPages)
        return (window.location.href = "/login");

      return rejected;
    }
  );
};
