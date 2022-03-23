import { Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { Comment } from "wordle-friends-graphql";
import NewLineText from "../common/NewLineText";
import RelativeTime from "../common/RelativeTime";
import UserName from "../common/UserName";

type RevealedCommentProps = {
  comment: Comment;
  divider: boolean;
};

export default function RevealedComment({
  comment: { text, createdAt, user, userId },
  divider,
}: RevealedCommentProps): JSX.Element {
  return (
    <>
      <Stack spacing={0} px={2}>
        <HStack>
          <Text as="strong" fontSize="xs">
            <UserName user={user} userId={userId} />
          </Text>
          <Text fontSize="xs" color="gray.500">
            <RelativeTime timestamp={createdAt} />
          </Text>
        </HStack>

        <NewLineText fontSize="xs">{text}</NewLineText>
      </Stack>

      {divider && <Divider />}
    </>
  );
}
