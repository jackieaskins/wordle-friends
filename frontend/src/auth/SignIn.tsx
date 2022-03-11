import { Flex, Link, Stack } from "@chakra-ui/react";
import { useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import InputField from "../form/InputField";
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
        <Flex
          direction={["column-reverse", "row"]}
          alignItems={["center"]}
          justifyContent="space-between"
          width="100%"
        >
          <Link as={RouterLink} to="/forgot">
            Forgot password?
          </Link>

          <Link as={RouterLink} to="/signup">
            {"Don't have an account? Sign up."}
          </Link>
        </Flex>
      }
      headerText="Sign in"
      onSubmit={onSubmit}
    >
      {() => (
        <Stack width="100%">
          <InputField
            autoComplete="email"
            label="Email address"
            name="email"
            required
            type="email"
          />

          <InputField
            autoComplete="current-password"
            label="Password"
            name="password"
            required
            type="password"
          />
        </Stack>
      )}
    </AuthForm>
  );
}
