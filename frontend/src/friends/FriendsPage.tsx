import { CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useCurrentUser } from "../auth/CurrentUserContext";
import AcceptedFriendsActions from "./AcceptedFriendsActions";
import {
  useFriends,
  useReceivedFriendRequests,
  useSentFriendRequests,
} from "./api";
import FriendRequestForm from "./FriendRequestForm";
import FriendsTable from "./FriendsTable";
import ReceivedFriendRequestsActions from "./ReceivedFriendRequestsActions";
import SentFriendRequestsActions from "./SentFriendRequestsActions";

export default function FriendsPage(): JSX.Element {
  const { id: userId } = useCurrentUser();
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(userId);

  useEffect(() => {
    if (hasCopied) {
      toast({
        description: `Successfully copied ${userId}`,
        status: "success",
      });
    }
  }, [hasCopied, toast, userId]);

  const tabs = useMemo(
    () => [
      {
        id: "received",
        title: "Friend requests",
        content: (
          <FriendsTable
            emptyNode="No friend requests"
            loadingNode="Loading friend requests"
            useFriendsQuery={useReceivedFriendRequests}
            actions={(friendId) => (
              <ReceivedFriendRequestsActions friendId={friendId} />
            )}
          />
        ),
      },
      {
        id: "accepted",
        title: "Friends",
        content: (
          <FriendsTable
            emptyNode="No friends :("
            loadingNode="Loading friends"
            useFriendsQuery={useFriends}
            actions={(friendId) => (
              <AcceptedFriendsActions friendId={friendId} />
            )}
          />
        ),
      },
      {
        id: "sent",
        title: "Sent requests",
        content: (
          <FriendsTable
            emptyNode="No sent requests"
            loadingNode="Loading sent requests"
            useFriendsQuery={useSentFriendRequests}
            actions={(friendId) => (
              <SentFriendRequestsActions friendId={friendId} />
            )}
          />
        ),
      },
    ],
    []
  );

  return (
    <Center>
      <Container>
        <Stack display="flex" alignItems="center" spacing={4} mt={2}>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            direction={["column", "row"]}
          >
            <Heading textAlign="center">Friends</Heading>
            <Button rightIcon={<CopyIcon />} onClick={onCopy} variant="ghost">
              Copy your friend code
            </Button>
          </Flex>

          <FriendRequestForm />

          <Tabs width="100%" isFitted>
            <TabList>
              {tabs.map(({ id, title }) => (
                <Tab key={id}>{title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabs.map(({ id, content }) => (
                <TabPanel key={id}>{content}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </Center>
  );
}
