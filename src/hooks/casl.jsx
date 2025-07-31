import { createContext, useContext } from "react";

import { createContextualCan } from "@casl/react";
import { createMongoAbility } from "@casl/ability";

export const AbilityContext = createContext(null);
export const Can = createContextualCan(AbilityContext.Consumer);

export const AbilityProvider = ({ user, children }) => {
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
