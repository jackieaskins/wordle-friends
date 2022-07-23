import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Show,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { RefType } from "wordle-friends-graphql";
import NewLineText from "../common/NewLineText";
import RelativeTime from "../common/RelativeTime";
import Squares from "../common/Squares";
import UserName from "../common/UserName";
import { SimplePost } from "./api";
import CommentSection from "./CommentSection";
import ReactionSection from "./ReactionSection";
import UpdatePostModal from "./UpdatePostModal";

type RevealedPostProps = {
  currentUserPost: SimplePost | null | undefined;
  post: SimplePost;
};

export default function RevealedPost({
  currentUserPost,
  post,
}: RevealedPostProps): JSX.Element {
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  const {
    id,
    user,
    userId,
    colors,
    isHardMode,
    message,
    guesses,
    createdAt,
    updatedAt,
  } = post;

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const isCurrentUserPost = useMemo(
    () => id === currentUserPost?.id,
    [currentUserPost?.id, id]
  );

  return (
    <Box width="100%" bg={bgColor} borderRadius="lg" px={3}>
      <Stack
        p={4}
        width="100%"
        justifyContent="space-between"
        direction={["column", "row"]}
        spacing={4}
      >
        <Flex direction="column">
          <Flex justifyContent="space-between">
            <Text fontSize="sm" as="strong">
              <UserName user={user} userId={userId} />
            </Text>
            {isCurrentUserPost && (
              <Show below="sm">
                <Button variant="link" size="sm" onClick={onUpdateModalOpen}>
                  Edit
                </Button>
              </Show>
            )}
          </Flex>
          <Text fontSize="xs" color="gray.500">
            <RelativeTime timestamp={createdAt} />{" "}
            {createdAt !== updatedAt && <>(Edited)</>}{" "}
            {isHardMode && <span> - Hard mode</span>}
            {isCurrentUserPost && (
              <Show above="sm">
                <span>
                  {" "}
                  -{" "}
                  <Button variant="link" size="xs" onClick={onUpdateModalOpen}>
                    Edit
                  </Button>
                </span>
              </Show>
            )}
          </Text>
          <NewLineText mt={2} fontSize="sm" overflowWrap="anywhere">
            {message}
          </NewLineText>
        </Flex>

        <Center mt={[4, 0]}>
          <Squares colors={colors} guesses={guesses} />
        </Center>
      </Stack>
      {currentUserPost && (
        <>
          <Divider />
          <ReactionSection refId={id} refType={RefType.Post} />
          <Divider />
          <CommentSection postId={id} />
        </>
      )}

      {isCurrentUserPost && (
        <UpdatePostModal
          key={`${isUpdateModalOpen}`}
          post={post}
          isOpen={isUpdateModalOpen}
          onClose={onUpdateModalClose}
        />
      )}
    </Box>
  );
}
