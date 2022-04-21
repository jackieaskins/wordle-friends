import { Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import {
  FaFrown,
  FaHeart,
  FaLaughSquint,
  FaRegFrown,
  FaRegHeart,
  FaRegLaughSquint,
  FaRegSurprise,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaSurprise,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { RefType } from "wordle-friends-graphql";
import { useCurrentUser } from "../auth/CurrentUserContext";
import { useCreateReaction, useDeleteReaction } from "./api";
import { ReactionType } from "./ReactionSection";

const emptyIcons: Record<ReactionType, IconType> = {
  ":-1:": FaRegThumbsDown,
  ":+1:": FaRegThumbsUp,
  ":cry:": FaRegFrown,
  ":joy:": FaRegLaughSquint,
  ":flush:": FaRegSurprise,
  ":heart:": FaRegHeart,
};
const filledIcons: Record<ReactionType, IconType> = {
  ":-1:": FaThumbsDown,
  ":+1:": FaThumbsUp,
  ":cry:": FaFrown,
  ":joy:": FaLaughSquint,
  ":flush:": FaSurprise,
  ":heart:": FaHeart,
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
  const ReactionIcon = useMemo(
    () => (selected ? filledIcons[react] : emptyIcons[react]),
    [react, selected]
  );

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
        <Icon as={ReactionIcon} boxSize={5} />
      )}
      {userIds.length > 0 && <Text fontSize="sm">{userIds.length}</Text>}
    </Stack>
  );
}
