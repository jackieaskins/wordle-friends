import { SkipNavContent, SkipNavLink } from "@chakra-ui/skip-nav";
import { Navigate, Route, Routes } from "react-router-dom";
import FriendsPage from "../friends/FriendsPage";
import Home from "../Home";
import Navbar from "../nav/Navbar";
import { DateProvider } from "../DateContext";
import Preferences from "../user/Preferences";

export default function AuthRoutes(): JSX.Element {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <Navbar />
      <SkipNavContent>
        <Routes>
          <Route
            path="/"
            element={
              <DateProvider>
                <Home />
              </DateProvider>
            }
          />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </SkipNavContent>
    </>
  );
}
