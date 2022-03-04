import { useAuth } from "../auth/AuthContext";
import { CurrentUserProvider } from "../auth/CurrentUserContext";
import AuthRoutes from "./AuthRoutes";
import UnauthRoutes from "./UnauthRoutes";

export default function AppRoutes(): JSX.Element {
  const { currentUserInfo } = useAuth();

  return currentUserInfo ? (
    <CurrentUserProvider value={currentUserInfo}>
      <AuthRoutes />
    </CurrentUserProvider>
  ) : (
    <UnauthRoutes />
  );
}
