import { Container, Skeleton, Stack } from "@chakra-ui/react";
import { useGetCurrentUserPost, useListFriendPosts } from "./posts/api";
import RevealedPost from "./posts/RevealedPost";
import UserPostSection from "./posts/UserPostSection";

export default function Home(): JSX.Element {
  const { data: currentUserPost, isLoading: isLoadingCurrentPost } =
    useGetCurrentUserPost();
  const { data: posts, isLoading: isLoadingPosts } = useListFriendPosts();

  return (
    <Container maxW="xl" centerContent mt={6}>
      <Skeleton
        isLoaded={!isLoadingCurrentPost && !isLoadingPosts}
        width="100%"
      >
        <Stack spacing={6}>
          <UserPostSection currentUserPost={currentUserPost} />

          {posts?.map((post) => (
            <RevealedPost
              key={post.userId}
              post={post}
              currentUserPost={currentUserPost}
            />
          ))}
        </Stack>
      </Skeleton>
    </Container>
  );
}
