import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import VerifyEmail from "../auth/VerifyEmail";

export default function UnauthRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="*" element={<Navigate replace to="/signin" />} />
    </Routes>
  );
}
