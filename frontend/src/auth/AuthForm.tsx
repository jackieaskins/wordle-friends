import { Alert, Button, Container, Heading, Stack } from "@chakra-ui/react";
import { ReactNode, useCallback, useState } from "react";
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
  UseFormReturn,
} from "react-hook-form";

type AuthFormProps<T extends FieldValues> = {
  buttonText: string;
  children: (formProps: UseFormReturn<T, any>) => ReactNode;
  footer?: ReactNode;
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  headerText: string;
  onSubmit: SubmitHandler<T>;
};

export default function AuthForm<T extends FieldValues>({
  buttonText,
  children,
  defaultValues,
  footer,
  headerText,
  onSubmit,
}: AuthFormProps<T>): JSX.Element {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const formProps = useForm<T>({ defaultValues });
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = formProps;

  const onSubmitWrapper = useCallback(
    async (values: UnpackNestedValue<T>) => {
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
    <Container width="90%" centerContent minH="100vh" justifyContent="center">
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

          <Button
            loadingText="Submitting"
            isLoading={isSubmitting}
            width="full"
            type="submit"
          >
            {buttonText}
          </Button>

          {footer}
        </Stack>
      </FormProvider>
    </Container>
  );
}
