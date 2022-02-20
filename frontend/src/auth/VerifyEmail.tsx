import { Stack } from "@chakra-ui/react";
import { Auth } from "aws-amplify";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../form/InputField";
import { getPendingEmail, removePendingEmail } from "../localStorage";
import AuthForm from "./AuthForm";

export default function VerifyEmail(): JSX.Element {
  const [pendingEmail] = useState(getPendingEmail());
  const navigate = useNavigate();

  const onSubmit = useCallback(
    ({ email, verificationCode }) => {
      Auth.confirmSignUp(email, verificationCode);
      removePendingEmail();
      navigate("/signin");
    },
    [navigate]
  );

  return (
    <AuthForm
      buttonText="Verify email"
      defaultValues={{ email: pendingEmail }}
      headerText="Verify email"
      onSubmit={onSubmit}
    >
      {() => (
        <Stack width="100%">
          <InputField
            isDisabled={!!pendingEmail}
            label="Email address"
            name="email"
            required
            type="email"
          />

          <InputField
            label="Verification code"
            name="verificationCode"
            required
          />
        </Stack>
      )}
    </AuthForm>
  );
}
