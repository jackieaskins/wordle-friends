import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useSendFriendRequest } from "./api";

export default function FriendRequestForm(): JSX.Element {
  const toast = useToast();
  const { isLoading, mutate } = useSendFriendRequest();
  const [friendId, setFriendId] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      setFriendId(value);
    },
    []
  );

  const sendFriendRequest = useCallback(() => {
    mutate(
      { friendId },
      {
        onSuccess: () => {
          setFriendId("");
          toast({
            status: "success",
            description: "Successfully sent friend request",
          });
        },
        onError: () => {
          toast({
            status: "error",
            description: "Unable to send friend request",
          });
        },
      }
    );
  }, [friendId, mutate, toast]);

  return (
    <Stack width="100%">
      <Input
        onChange={handleChange}
        placeholder="Enter user's id"
        size="sm"
        value={friendId}
      />
      <Button isLoading={isLoading} size="sm" onClick={sendFriendRequest}>
        Send friend request
      </Button>
    </Stack>
  );
}
