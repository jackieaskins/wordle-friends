import {
  Badge,
  Button,
  Flex,
  Link,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useReceivedFriendRequests } from "../friends/apis";

export default function Navbar(): JSX.Element {
  const { signOut } = useAuth();
  const { data: friendRequests } = useReceivedFriendRequests();

  return (
    <Flex
      alignItems="center"
      minH="60px"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={2}
      px={6}
    >
      <Link
        as={RouterLink}
        to="/"
        fontSize="xl"
        size="sm"
        color={useColorModeValue("blue.600", "blue.200")}
      >
        Wordle with Friends
      </Link>

      <Flex alignItems="center">
        <Link as={RouterLink} to="/friends" ml={6}>
          Friends
        </Link>
        {(friendRequests?.length ?? 0) > 0 && (
          <Badge ml={2}>{friendRequests?.length}</Badge>
        )}
      </Flex>

      <Spacer />

      <Button size="sm" variant="outline" onClick={signOut}>
        Sign out
      </Button>
    </Flex>
  );
}
