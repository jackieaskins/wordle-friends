import {
  Box,
  Center,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { RefType } from "wordle-friends-graphql";
import NewLineText from "../common/NewLineText";
import RelativeTime from "../common/RelativeTime";
import Squares from "../common/Squares";
import UserName from "../common/UserName";
import { SimplePost } from "./api";
import CommentSection from "./CommentSection";
import ReactionSection from "./ReactionSection";

type RevealedPostProps = {
  currentUserPost: SimplePost | null | undefined;
  post: SimplePost;
};

export default function RevealedPost({
  currentUserPost,
  post,
}: RevealedPostProps): JSX.Element {
  const { id, user, userId, colors, isHardMode, message, guesses, createdAt } =
    post;

  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box width="100%" bg={bgColor} borderRadius="lg" px={3}>
      <Flex m={4} justifyContent="space-between" direction={["column", "row"]}>
        <Flex direction="column">
          <Text fontSize="sm" as="strong">
            <UserName user={user} userId={userId} />
          </Text>
          <Text fontSize="xs" color="gray.500">
            <RelativeTime timestamp={createdAt} />{" "}
            {isHardMode && <span> - Hard mode</span>}
          </Text>
          <NewLineText mt={2} fontSize="sm">
            {message}
          </NewLineText>
        </Flex>

        <Center mt={[4, 0]}>
          <Squares colors={colors} guesses={guesses} />
        </Center>
      </Flex>

      {currentUserPost && (
        <>
          <Divider />
          <ReactionSection refId={id} refType={RefType.Post} />
          <Divider />
          <CommentSection postId={id} />
        </>
      )}
    </Box>
  );
}
