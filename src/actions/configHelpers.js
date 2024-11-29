
const apiHeaderConfig = (getState) => {
    const {
      otpVerify: { userInfo },
    } = getState();
  
    return {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: localStorage.getItem("branchCode"),
      },
    };
  };
  
  export default apiHeaderConfig;
  