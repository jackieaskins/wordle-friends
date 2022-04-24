import { Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import {
  BiDislike,
  BiHeart,
  BiLaugh,
  BiLike,
  BiSad,
  BiShocked,
} from "react-icons/bi";
import { RefType } from "wordle-friends-graphql";
import { useCurrentUser } from "../auth/CurrentUserContext";
import { useCreateReaction, useDeleteReaction } from "./api";
import { ReactionType } from "./ReactionSection";

const icons: Record<ReactionType, IconType> = {
  ":-1:": BiDislike,
  ":+1:": BiLike,
  ":cry:": BiSad,
  ":joy:": BiLaugh,
  ":flush:": BiShocked,
  ":heart:": BiHeart,
};

type ReactionButtonProps = {
  react: ReactionType;
  refId: string;
  refType: RefType;
  userIds: string[];
};

export default function ReactionButton({
  react,
  refId,
  refType,
  userIds,
}: ReactionButtonProps): JSX.Element {
  const { mutate: createReaction, isLoading: isCreatingReaction } =
    useCreateReaction();
  const { mutate: deleteReaction, isLoading: isDeletingReaction } =
    useDeleteReaction();

  const { id: currentUserId } = useCurrentUser();

  const isLoading = useMemo(
    () => isCreatingReaction || isDeletingReaction,
    [isCreatingReaction, isDeletingReaction]
  );
  const selected = useMemo(
    () => userIds.includes(currentUserId),
    [currentUserId, userIds]
  );
  const updateReaction = useCallback(() => {
    const variables = { input: { refId, refType, react } };
    selected ? deleteReaction(variables) : createReaction(variables);
  }, [createReaction, deleteReaction, react, refId, refType, selected]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      color={selected ? "blue.300" : undefined}
      spacing={1}
      cursor={isLoading ? undefined : "pointer"}
      onClick={isLoading ? undefined : updateReaction}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Icon as={icons[react]} boxSize={6} />
      )}
      {userIds.length > 0 && <Text fontSize="sm">{userIds.length}</Text>}
    </Stack>
  );
}
