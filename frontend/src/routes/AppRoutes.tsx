import { useAuth } from "../auth/AuthContext";
import AuthRoutes from "./AuthRoutes";
import UnauthRoutes from "./UnauthRoutes";

export default function AppRoutes(): JSX.Element {
  const { currentUserInfo } = useAuth();

  return currentUserInfo ? <AuthRoutes /> : <UnauthRoutes />;
}
