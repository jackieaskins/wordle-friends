import { Link, Stack } from "@chakra-ui/react";
import { useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import InputField from "../form/InputField";
import { setPendingEmail } from "../localStorage";
import { useAuth } from "./AuthContext";
import AuthForm from "./AuthForm";

export default function SignUp(): JSX.Element {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (values) => {
      await signUp(values);
      setPendingEmail(values.email);
      navigate("/verify");
    },
    [navigate, signUp]
  );

  return (
    <AuthForm
      buttonText="Sign up"
      footer={
        <Link as={RouterLink} to="/signin">
          Already have an account? Sign in.
        </Link>
      }
      headerText="Sign up"
      onSubmit={onSubmit}
    >
      {({ getValues }) => (
        <Stack width="100%">
          <InputField
            autoComplete="given-name"
            label="First name"
            name="firstName"
            required
          />
          <InputField
            autoComplete="family-name"
            label="Last name"
            name="lastName"
            required
          />
          <InputField
            autoComplete="email"
            label="Email address"
            name="email"
            required
            type="email"
          />
          <InputField
            autoComplete="new-password"
            helperText="Password must be at least 8 characters and contain lowercase, uppercase, numeric, and symbol characters"
            label="Password"
            name="password"
            required
            registerOptions={{
              validate: {
                hasLower: (value) =>
                  /[a-z]/.test(value) ||
                  "Password must have a lowercase letter",
                hasUpper: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password must have an uppercase character",
                hasNumber: (value) =>
                  /\d/.test(value) || "Password must have a numeric character",
                hasSymbol: (value) =>
                  /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]/.test(value) ||
                  "Password must have a symbol character",
              },
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            }}
            type="password"
          />
          <InputField
            autoComplete="new-password"
            label="Password confirmation"
            name="passwordConfirmation"
            required
            registerOptions={{
              validate: {
                matchesPassword: (value) =>
                  value === getValues("password") ||
                  "Password confirmation must match Password",
              },
            }}
            type="password"
          />
        </Stack>
      )}
    </AuthForm>
  );
}
