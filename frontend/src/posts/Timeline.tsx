import { Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { useCurrentUser } from "../auth/CurrentUserContext";
import { useDate } from "../DateContext";
import { usePosts } from "./api";
import RevealedPost from "./RevealedPost";
import UserPostSection from "./UserPostSection";

export default function Timeline(): JSX.Element {
  const { id: currentUserId } = useCurrentUser();
  const { selectedPuzzleDate } = useDate();
  const grayColor = useColorModeValue("gray.400", "whiteAlpha.300");

  const { data: allPosts, isLoading: isLoadingAllPosts } =
    usePosts(selectedPuzzleDate);
  const { currentUserPost, friendPosts } = useMemo(() => {
    if (!allPosts) {
      return { currentUserPost: null, friendPosts: null };
    }

    const index = allPosts.findIndex(({ userId }) => userId === currentUserId);
    if (index === -1) {
      return { currentUserPost: null, friendPosts: allPosts };
    }

    return {
      currentUserPost: allPosts?.[index],
      friendPosts: [...allPosts.slice(0, index), ...allPosts.slice(index + 1)],
    };
  }, [allPosts, currentUserId]);

  if (isLoadingAllPosts) {
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

      {!friendPosts?.length && (
        <Text align="center" color={grayColor}>
          None of your friends have posted. You should give them a reminder or
          find some new ones.
        </Text>
      )}

      {friendPosts?.map((post) => (
        <RevealedPost
          key={post.userId}
          post={post}
          currentUserPost={currentUserPost}
        />
      ))}
    </Stack>
  );
}
