import { Container } from "@chakra-ui/react";
import UserPostSection from "./posts/UserPostSection";

export default function Home(): JSX.Element {
  return (
    <Container maxW="xl" centerContent mt={6}>
      <UserPostSection />
    </Container>
  );
}
