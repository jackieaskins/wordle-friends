import { Button, Heading } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAuth } from "./auth/AuthContext";

export default function Home(): JSX.Element {
  const { signOut } = useAuth();

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <>
      <Heading>Wordle with Friends</Heading>
      <Button onClick={logout}>Log out</Button>
    </>
  );
}
