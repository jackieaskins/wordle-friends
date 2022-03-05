import { Container, Stack } from "@chakra-ui/react";
import { useListFriendPosts } from "./posts/api";
import RevealedPost from "./posts/RevealedPost";
import UserPostSection from "./posts/UserPostSection";

export default function Home(): JSX.Element {
  const { data: posts } = useListFriendPosts();

  return (
    <Container maxW="xl" centerContent mt={6}>
      <Stack width="100%" spacing={6}>
        <UserPostSection />

        {posts?.map((post) => (
          <RevealedPost key={post.userId} post={post} />
        ))}
      </Stack>
    </Container>
  );
}
