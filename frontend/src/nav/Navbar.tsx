import {
  Button,
  Flex,
  Link,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar(): JSX.Element {
  const { signOut } = useAuth();

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

      <Link as={RouterLink} to="/friends" ml={6}>
        Friends
      </Link>

      <Spacer />

      <Button size="sm" variant="outline" onClick={signOut}>
        Sign out
      </Button>
    </Flex>
  );
}
