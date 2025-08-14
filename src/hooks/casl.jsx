import { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createContextualCan } from "@casl/react";
import { createMongoAbility } from "@casl/ability";

import { useAuth } from "./auth";

export const AbilityContext = createContext(null);
export const Can = createContextualCan(AbilityContext.Consumer);

export const AbilityProvider = ({ children }) => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isInAuthPages = () =>
    new Set(["/login", "/forgot-password", "/reset-password"]).has(
      location.pathname
    );

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user === null && !isInAuthPages()) return navigate("/login");
      if (user && isInAuthPages()) return navigate("/Dashboard");
    }
  }, [user, loading, navigate]);

  const ability = createMongoAbility(user?.permissions || []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  const ability = useContext(AbilityContext);
  if (!ability)
    throw "Kindly use the useAbility hook within the Ability Provider";

  return ability;
};
