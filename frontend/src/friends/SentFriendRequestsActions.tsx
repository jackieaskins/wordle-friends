import { Button, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDeleteFriend } from "./api";

type SentFriendRequestsActionsProps = {
  friendId: string;
};

export default function SentFriendRequestsActions({
  friendId,
}: SentFriendRequestsActionsProps): JSX.Element {
  const toast = useToast();
  const { isLoading, mutate } = useDeleteFriend();

  const cancelFriendRequest = useCallback(() => {
    mutate(
      { friendId },
      {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Successfully cancelled friend request",
          });
        },
        onError: () => {
          toast({
            status: "error",
            description: "Unable to cancel friend request",
          });
        },
      }
    );
  }, [friendId, mutate, toast]);

  return (
    <Button
      variant="outline"
      size="sm"
      colorScheme="red"
      isLoading={isLoading}
      onClick={cancelFriendRequest}
    >
      Decline
    </Button>
  );
}
