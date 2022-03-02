import { Box } from "@chakra-ui/react";
import { SkipNavContent, SkipNavLink } from "@chakra-ui/skip-nav";
import { Navigate, Route, Routes } from "react-router-dom";
import FriendsPage from "../friends/FriendsPage";
import Home from "../Home";
import Navbar from "../nav/Navbar";

export default function AuthRoutes(): JSX.Element {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <Navbar />
      <SkipNavContent>
        <Box px={6} pt={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Box>
      </SkipNavContent>
    </>
  );
}
