import { LoadingButton } from "@mui/lab";
import { Alert, Box, Container, Typography } from "@mui/material";
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";

type AuthFormProps = {
  buttonText: string;
  children: (formProps: UseFormReturn<FieldValues, any>) => ReactNode;
  footer?: ReactNode;
  defaultValues?: FieldValues;
  headerText: string;
  onSubmit: SubmitHandler<FieldValues>;
};

export default function AuthForm({
  buttonText,
  children,
  defaultValues,
  footer,
  headerText,
  onSubmit,
}: AuthFormProps): JSX.Element {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const formProps = useForm({ defaultValues });
  const {
    formState: { isSubmitting, isValidating },
    handleSubmit,
  } = formProps;

  const isLoading = useMemo(
    () => isSubmitting || isValidating,
    [isSubmitting, isValidating]
  );

  const onSubmitWrapper = useCallback(
    async (values) => {
      setGeneralError(null);

      try {
        await onSubmit(values);
      } catch (e) {
        setGeneralError((e as any)?.message || "Unable to submit form");
      }
    },
    [onSubmit]
  );

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          {headerText}
        </Typography>

        <FormProvider {...formProps}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitWrapper)}
            noValidate
            sx={{ mt: 3 }}
          >
            {children(formProps)}

            {generalError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {generalError}
              </Alert>
            )}

            <LoadingButton
              loading={isLoading}
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              type="submit"
              variant="contained"
            >
              {buttonText}
            </LoadingButton>

            {footer}
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
}
