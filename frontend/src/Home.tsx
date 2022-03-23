import { Box, Button, Center, Container, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DateChanger from "./DateChanger";
import Timeline from "./posts/Timeline";
import { useDate } from "./DateContext";

export default function Home(): JSX.Element {
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
    <Center mb={12}>
      <Container>
        <Stack spacing={4} mt={4}>
          <Box>
            <DateChanger />
          </Box>

          {displayText ? (
            <Stack alignItems="center">
              <Text align="center">{displayText}</Text>
              <Button onClick={goToToday} variant="outline">
                {"Today's puzzle"}
              </Button>
            </Stack>
          ) : (
            <Timeline key={selectedPuzzleDate} />
          )}
        </Stack>
      </Container>
    </Center>
  );
}
