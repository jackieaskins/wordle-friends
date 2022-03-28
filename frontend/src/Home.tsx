import { Box, Button, Center, Container, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateChanger from "./DateChanger";
import Timeline from "./posts/Timeline";
import { useDate } from "./DateContext";
import NotificationsAlert from "./NotificationsAlert";
import { useCurrentUser } from "./auth/CurrentUserContext";

export default function Home(): JSX.Element {
  const { notifyOnFriendPost, notifyOnPostComment, notifyOnCommentReply } =
    useCurrentUser();

  const [showNotificationsAlert] = useState(
    [notifyOnPostComment, notifyOnFriendPost, notifyOnCommentReply].every(
      (val) => val == undefined
    )
  );

  const { currentDateTime, selectedDate, selectedPuzzleDate } = useDate();
  const navigate = useNavigate();

  const displayText = useMemo(() => {
    if (!selectedDate.isValid()) {
      return "How'd you even get here? Let's return to safety.";
    }

    if (selectedDate.isAfter(currentDateTime, "day")) {
      return "What are you doing in the future? It's far too dangerous, please go back.";
    }

    return null;
  }, [currentDateTime, selectedDate]);

  const goToToday = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <Center mb={12} key={selectedPuzzleDate}>
      <Container>
        <Stack spacing={4} mt={4}>
          <Box>
            <DateChanger />
          </Box>

          {showNotificationsAlert && <NotificationsAlert />}

          {displayText ? (
            <Stack alignItems="center">
              <Text align="center">{displayText}</Text>
              <Button onClick={goToToday} variant="outline">
                {"Today's puzzle"}
              </Button>
            </Stack>
          ) : (
            <Timeline />
          )}
        </Stack>
      </Container>
    </Center>
  );
}
