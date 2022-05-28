import {
  Alert,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ModifiableUserAttributes, useAuth } from "../auth/AuthContext";
import { useCurrentUser } from "../auth/CurrentUserContext";
import NotificationFields from "./fields/NotificationFields";
import ShowSquaresField from "./fields/ShowSquaresField";

export default function Preferences(): JSX.Element {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const { updateUserAttributes } = useAuth();
  const { rawAttributes } = useCurrentUser();

  const formProps = useForm<Partial<ModifiableUserAttributes>>({
    defaultValues: Object.fromEntries(
      Object.entries(rawAttributes).filter(([key]) => key.startsWith("custom:"))
    ),
  });
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = formProps;

  const onSubmit = useCallback(
    async (values: Partial<ModifiableUserAttributes>) => {
      setError(null);

      try {
        await updateUserAttributes(values);
        reset(values);
        toast({
          status: "success",
          position: "top",
          description: "Successfully updated preferences",
        });
      } catch (e: any) {
        setError(e?.toString());
      }
    },
    [reset, toast, updateUserAttributes]
  );

  const sections = useMemo(
    () => [
      {
        key: "general",
        headingText: "General",
        content: <ShowSquaresField />,
      },
      {
        key: "notifications",
        headingText: "Notifications",
        content: <NotificationFields showHelperText={false} />,
      },
    ],
    []
  );

  return (
    <Center>
      <Container>
        <Heading mt={2} mb={6} as="h1" textAlign="center">
          Preferences
        </Heading>

        <FormProvider {...formProps}>
          <Stack spacing={12} as="form" onSubmit={handleSubmit(onSubmit)}>
            {sections.map(({ key, headingText, content }) => (
              <Stack spacing={2} key={key}>
                <Heading as="h2" size="md">
                  {headingText}
                </Heading>
                <Divider />
                {content}
              </Stack>
            ))}

            {error && (
              <Alert status="error" mt={2}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              width="full"
              isLoading={isSubmitting}
              loadingText="Submitting"
              disabled={!isDirty}
            >
              Submit
            </Button>
          </Stack>
        </FormProvider>
      </Container>
    </Center>
  );
}
