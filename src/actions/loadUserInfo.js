// Action to load user info from localStorage
export const loadUserInfo = () => (dispatch) => {
    const storedUserInfo = localStorage.getItem("userInfo");
  
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      const { branchCode, no, staffNo } = parsedUserInfo;
      dispatch({ type: "USER_INFO_LOAD", payload: { branchCode, no, staffNo } });
    }
  };
  