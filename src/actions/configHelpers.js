const apiHeaderConfig = (getState) => {
  const {
    otpVerify: { user },
  } = getState();

  return {
    headers: {
      "Content-Type": "application/json",
      staffNo: user?.staffNo,
      branchCode: user?.branchCode,
    },
  };
};

export default apiHeaderConfig;
