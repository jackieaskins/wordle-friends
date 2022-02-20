import { Grid } from "@mui/material";
import { Auth } from "aws-amplify";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextFormField from "../form/TextFormField";
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField
              disabled={!!pendingEmail}
              label="Email address"
              name="email"
              required
              type="email"
            />
          </Grid>

          <Grid item xs={12}>
            <TextFormField
              label="Verification code"
              name="verificationCode"
              required
            />
          </Grid>
        </Grid>
      )}
    </AuthForm>
  );
}
