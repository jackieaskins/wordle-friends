import { Box, Button, Center, Container, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DateChanger from "./DateChanger";
import Timeline from "./posts/Timeline";
import { useSelectedDate } from "./SelectedDateContext";
import { formatDateString } from "./utils/dates";

export default function Home(): JSX.Element {
  const { date, puzzleDate } = useSelectedDate();
  const navigate = useNavigate();

  const displayText = useMemo(() => {
    if (!date.isValid()) {
      return "How'd you even get here? Let's return to safety.";
    }

    if (date.isAfter(dayjs(), "day")) {
      return "What are you doing in the future? It's far too dangerous, please go back.";
    }

    return null;
  }, [date]);

  const goToToday = useCallback(() => {
    navigate(`?date=${formatDateString(dayjs())}`);
  }, [navigate]);

  return (
    <Center mb={12}>
      <Container>
        <Stack spacing={4} mt={4}>
          <Box>
            <DateChanger date={date} />
          </Box>

          {displayText ? (
            <Stack alignItems="center">
              <Text align="center">{displayText}</Text>
              <Button onClick={goToToday} variant="outline">
                {"Today's puzzle"}
              </Button>
            </Stack>
          ) : (
            <Timeline key={puzzleDate} />
          )}
        </Stack>
      </Container>
    </Center>
  );
}
