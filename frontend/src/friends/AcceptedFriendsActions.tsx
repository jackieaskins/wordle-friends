import { Button, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDeleteFriend } from "./api";
type AcceptedFriendsActionsProps = {
  friendId: string;
};

export default function AcceptedFriendsActions({
  friendId,
}: AcceptedFriendsActionsProps): JSX.Element {
  const { isLoading, mutate } = useDeleteFriend();
  const toast = useToast();

  const deleteFriend = useCallback(() => {
    mutate(
      { friendId },
      {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Successfully deleted friend",
          });
        },
        onError: () => {
          toast({ status: "error", description: "Unable to delete friend" });
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
      onClick={deleteFriend}
    >
      Unfriend
    </Button>
  );
}
