import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../Home";

export default function AuthRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
