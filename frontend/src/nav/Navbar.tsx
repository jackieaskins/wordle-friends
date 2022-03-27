import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Hide,
  IconButton,
  Link,
  Show,
  Spacer,
  Stack,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useReceivedFriendRequests } from "../friends/api";

export default function Navbar(): JSX.Element {
  const [expanded, setExpanded] = useBoolean();
  const { signOut } = useAuth();
  const { data: friendRequests } = useReceivedFriendRequests();

  const commonButtonProps = useMemo(
    () => ({
      variant: "ghost",
      width: "100%",
      height: "100%",
      p: 1,
      onClick: setExpanded.off,
    }),
    [setExpanded.off]
  );

  return (
    <Stack spacing={0} bg={useColorModeValue("gray.50", "gray.900")}>
      <Flex alignItems="center" minH="60px" px={6}>
        <Link
          as={RouterLink}
          to="/"
          fontSize="xl"
          size="sm"
          color={useColorModeValue("blue.600", "blue.200")}
          onClick={setExpanded.off}
        >
          Wordle with Friends
        </Link>

        <Show above="sm">
          <Flex alignItems="center">
            <Link as={RouterLink} to="/preferences" ml={6}>
              Preferences
            </Link>
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
        </Show>

        <Hide above="sm">
          <Spacer />
          <IconButton
            aria-label="Expand navbar"
            size="sm"
            onClick={setExpanded.toggle}
            icon={<HamburgerIcon />}
            variant="outline"
          />
        </Hide>
      </Flex>

      <Show below="sm">
        {expanded && (
          <Stack width="100%" alignItems="center">
            <Divider />
            <Button {...commonButtonProps} as={RouterLink} to="/preferences">
              Preferences
            </Button>
            <Divider />
            <Button {...commonButtonProps} as={RouterLink} to="/friends">
              Friends
              {(friendRequests?.length ?? 0) > 0 && (
                <Badge ml={2}>{friendRequests?.length}</Badge>
              )}
            </Button>
            <Divider />
            <Button {...commonButtonProps} onClick={signOut}>
              Sign out
            </Button>
            <Divider />
          </Stack>
        )}
      </Show>
    </Stack>
  );
}
