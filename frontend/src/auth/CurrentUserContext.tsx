import { createContext, useContext } from "react";
import { UserInfo } from "./AuthContext";

const CurrentUserContext = createContext<UserInfo>({} as UserInfo);

export const CurrentUserProvider = CurrentUserContext.Provider;

export function useCurrentUser(): UserInfo {
  return useContext(CurrentUserContext);
}
