import { Grid, Link } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import TextFormField from "../form/TextFormField";
import { useAuth } from "./AuthContext";
import AuthForm from "./AuthForm";

export default function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const onSubmit = useCallback(
    async ({ email, password }) => {
      await signIn(email, password);
      navigate("/");
    },
    [navigate, signIn]
  );

  return (
    <AuthForm
      buttonText="Sign in"
      footer={
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot">
              Forgot password?
            </Link>
          </Grid>

          <Grid item>
            <Link component={RouterLink} to="/signup">
              {"Don't have an account? Sign up."}
            </Link>
          </Grid>
        </Grid>
      }
      headerText="Sign in"
      onSubmit={onSubmit}
    >
      {() => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField
              autoComplete="email"
              label="Email address"
              name="email"
              required
              type="email"
            />
          </Grid>

          <Grid item xs={12}>
            <TextFormField
              autoComplete="current-password"
              label="Password"
              name="password"
              required
              type="password"
            />
          </Grid>
        </Grid>
      )}
    </AuthForm>
  );
}
