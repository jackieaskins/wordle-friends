import { Button, ButtonGroup, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAcceptFriendRequest, useDeleteFriend } from "./api";

type ReceivedFriendRequestsActionsProps = {
  friendId: string;
};

export default function ReceivedFriendRequestsActions({
  friendId,
}: ReceivedFriendRequestsActionsProps): JSX.Element {
  const toast = useToast();
  const { isLoading: isAccepting, mutate: mutateAccept } =
    useAcceptFriendRequest();
  const { isLoading: isDeclining, mutate: mutateDecline } = useDeleteFriend();

  const acceptFriendRequest = useCallback(() => {
    mutateAccept(
      { friendId },
      {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Successfully accepted friend request",
          });
        },
        onError: () => {
          toast({
            status: "error",
            description: "Unable to accept friend request",
          });
        },
      }
    );
  }, [friendId, mutateAccept, toast]);

  const declineFriendRequest = useCallback(() => {
    mutateDecline(
      { friendId },
      {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Successfully declined friend request",
          });
        },
        onError: () => {
          toast({
            status: "error",
            description: "Unable to decline friend request",
          });
        },
      }
    );
  }, [friendId, mutateDecline, toast]);

  return (
    <ButtonGroup justifyContent="end">
      <Button
        variant="outline"
        size="sm"
        colorScheme="green"
        isLoading={isAccepting}
        onClick={acceptFriendRequest}
      >
        Accept
      </Button>

      <Button
        variant="outline"
        size="sm"
        colorScheme="red"
        isLoading={isDeclining}
        onClick={declineFriendRequest}
      >
        Decline
      </Button>
    </ButtonGroup>
  );
}
