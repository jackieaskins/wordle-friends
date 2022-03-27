import {
  Box,
  Center,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Post } from "wordle-friends-graphql";
import NewLineText from "../common/NewLineText";
import RelativeTime from "../common/RelativeTime";
import Squares from "../common/Squares";
import UserName from "../common/UserName";
import { PostWithComments } from "./api";
import CommentSection from "./CommentSection";

type RevealedPostProps = {
  currentUserPost: Post | null | undefined;
  post: PostWithComments;
};

export default function RevealedPost({
  currentUserPost,
  post,
}: RevealedPostProps): JSX.Element {
  const { user, userId, colors, isHardMode, message, guesses, createdAt } =
    post;

  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box width="100%" bg={bgColor} borderRadius="lg" px={3}>
      <Flex m={4} justifyContent="space-between" direction={["column", "row"]}>
        <Flex direction="column">
          <Text as="strong">
            <UserName user={user} userId={userId} />
          </Text>
          <Text fontSize="xs" color="gray.500">
            <RelativeTime timestamp={createdAt} />{" "}
            {isHardMode && <span> - Hard mode</span>}
          </Text>
          <NewLineText mt={2}>{message}</NewLineText>
        </Flex>

        <Center mt={[4, 0]}>
          <Squares colors={colors} guesses={guesses} />
        </Center>
      </Flex>

      {currentUserPost && (
        <>
          <Divider />
          <CommentSection post={post} />
        </>
      )}
    </Box>
  );
}
