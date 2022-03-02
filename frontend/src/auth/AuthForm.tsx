import { Alert, Button, Container, Heading, Stack } from "@chakra-ui/react";
import { ReactNode, useCallback, useState } from "react";
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
    formState: { isSubmitting },
    handleSubmit,
  } = formProps;

  const onSubmitWrapper = useCallback(
    async (values) => {
      setGeneralError(null);
      try {
        await onSubmit(values);
      } catch (e: any) {
        setGeneralError(e?.message || "Unable to submit form");
      }
    },
    [onSubmit]
  );

  return (
    <Container maxW="xl" centerContent minH="100vh" justifyContent="center">
      <FormProvider {...formProps}>
        <Stack
          display="flex"
          width="100%"
          alignItems="center"
          spacing={4}
          onSubmit={handleSubmit(onSubmitWrapper)}
          as="form"
          noValidate
        >
          <Heading>{headerText}</Heading>

          {children(formProps)}

          {generalError && (
            <Alert status="error" mt={2}>
              {generalError}
            </Alert>
          )}

          <Button isLoading={isSubmitting} isFullWidth type="submit">
            {buttonText}
          </Button>

          {footer}
        </Stack>
      </FormProvider>
    </Container>
  );
}
