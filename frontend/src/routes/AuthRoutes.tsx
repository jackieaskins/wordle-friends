import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import FriendList from "../friends/FriendList";
import Home from "../Home";
import Navbar from "../nav/Navbar";

export default function AuthRoutes(): JSX.Element {
  return (
    <>
      <Navbar />
      <Box px={6} pt={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Box>
    </>
  );
}
