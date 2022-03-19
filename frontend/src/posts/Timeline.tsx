import { Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useSelectedDate } from "../SelectedDateContext";
import { useGetCurrentUserPost, useListFriendPosts } from "./api";
import RevealedPost from "./RevealedPost";
import UserPostSection from "./UserPostSection";

export default function Timeline(): JSX.Element {
  const { puzzleDate } = useSelectedDate();
  const grayColor = useColorModeValue("gray.400", "whiteAlpha.300");

  const { data: currentUserPost, isLoading: isLoadingCurrentPost } =
    useGetCurrentUserPost(puzzleDate);
  const { data: posts, isLoading: isLoadingPosts } =
    useListFriendPosts(puzzleDate);

  if (isLoadingCurrentPost || isLoadingPosts) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return (
    <Stack spacing={6}>
      <UserPostSection currentUserPost={currentUserPost} />

      {!posts?.length && (
        <Text align="center" color={grayColor}>
          None of your friends have posted. You should give them a reminder or
          find some new ones.
        </Text>
      )}

      {posts?.map((post) => (
        <RevealedPost
          key={post.userId}
          post={post}
          currentUserPost={currentUserPost}
        />
      ))}
    </Stack>
  );
}
