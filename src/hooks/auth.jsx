import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserDetails } from "../actions/getUserDetails";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const fetchUser = () => dispatch(getUserDetails());

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth)
    throw new Error("Kindly use the useAuth hook within the AuthProvider");

  return auth;
};
