import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  useBoolean,
} from "@chakra-ui/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "./auth/AuthContext";
import { useCurrentUser } from "./auth/CurrentUserContext";
import NotificationFields from "./user/fields/NotificationFields";

export default function NotificationsAlert(): JSX.Element | null {
  const [hasUpdated, setHasUpdated] = useBoolean();
  const [showSuccessAlert, setShowSuccessAlert] = useBoolean(true);
  const [error, setError] = useState<string | null>(null);

  const user = useCurrentUser();
  const { updateUserAttributes } = useAuth();
  const formProps = useForm({
    defaultValues: Object.fromEntries(
      Object.entries(user.rawAttributes).filter(([key]) =>
        key.startsWith("custom:notifyOn")
      )
    ),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    watch,
  } = formProps;

  const selectedCount = [
    watch("custom:notifyOnPostComment"),
    watch("custom:notifyOnFriendPost"),
    watch("custom:notifyOnCommentReply"),
  ].filter((val) => val === "true").length;

  if (hasUpdated) {
    if (showSuccessAlert) {
      return (
        <Alert status="success" variant="left-accent">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Successfully updated!</AlertTitle>
            <AlertDescription>
              Notification preferences can be updated at any time from the
              preferences page.
            </AlertDescription>
          </Box>
          <CloseButton onClick={setShowSuccessAlert.off} />
        </Alert>
      );
    }

    return null;
  }

  return (
    <Alert status="info" variant="left-accent">
      <Box flex="1">
        <Flex>
          <AlertIcon />
          <AlertTitle fontSize="lg">New! Enable email notifications</AlertTitle>
        </Flex>

        <Divider my={3} />

        <FormProvider {...formProps}>
          <AlertDescription
            as="form"
            onSubmit={handleSubmit(async (values) => {
              setError(null);
              try {
                await updateUserAttributes(values);
                setHasUpdated.on();
              } catch (e: any) {
                setError(e?.toString());
              }
            })}
          >
            <NotificationFields />

            {error && (
              <Alert status="error" variant="solid" mt={4}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              isFullWidth
              variant="outline"
              mt={4}
              isLoading={isSubmitting}
              loadingText="Submitting"
            >
              Enable selected ({selectedCount})
            </Button>
          </AlertDescription>
        </FormProvider>
      </Box>
    </Alert>
  );
}
