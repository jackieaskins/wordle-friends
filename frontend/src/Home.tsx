import { Button, Typography } from "@mui/material";
import { useCallback } from "react";
import { useAuth } from "./auth/AuthContext";

export default function Home(): JSX.Element {
  const { signOut } = useAuth();

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <>
      <Typography component="h1" variant="h3">
        Wordle with Friends
      </Typography>
      <Button variant="contained" onClick={logout}>
        Log out
      </Button>
    </>
  );
}
