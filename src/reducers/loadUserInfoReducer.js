// Reducer for user info
export const userInfoReducer = (state = {}, action) => {
    switch (action.type) {
      case "USER_INFO_LOAD":
        console.log("Received action:", action.console);
        return { ...state, userInfo: action.payload };
      case "USER_LOGOUT":
        return { userInfo: null }; // Clear user info on logout
      default:
        return state;
    }
  };
  