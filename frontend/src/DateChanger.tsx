import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDate } from "./DateContext";
import { formatDateString } from "./utils/dates";

export default function DateChanger(): JSX.Element {
  const { selectedDate, currentDateTime } = useDate();
  const navigate = useNavigate();

  const goToPreviousDay = useCallback(() => {
    navigate(`?date=${formatDateString(selectedDate.subtract(1, "day"))}`);
  }, [selectedDate, navigate]);

  const goToNextDay = useCallback(() => {
    navigate(`?date=${formatDateString(selectedDate.add(1, "day"))}`);
  }, [selectedDate, navigate]);

  const goToToday = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const isTodayOrAfter = useMemo(
    () =>
      !selectedDate.isValid() ||
      selectedDate.isAfter(currentDateTime.subtract(1, "day"), "day"),
    [currentDateTime, selectedDate]
  );
  const isAfterToday = useMemo(
    () =>
      !selectedDate.isValid() || selectedDate.isAfter(currentDateTime, "day"),
    [currentDateTime, selectedDate]
  );

  return (
    <Flex justifyContent="space-between" alignItems="center" direction="row">
      <Text as="strong">{selectedDate.format("MMMM D, YYYY")}</Text>

      <ButtonGroup spacing={1} size="sm" variant="outline">
        <IconButton
          aria-label="Go to previous day"
          icon={<ChevronLeftIcon />}
          onClick={goToPreviousDay}
          isDisabled={isAfterToday}
        />
        <IconButton
          aria-label="Go to next day"
          icon={<ChevronRightIcon />}
          onClick={goToNextDay}
          isDisabled={isTodayOrAfter}
        />
        <IconButton
          aria-label="Go to today"
          icon={<ArrowRightIcon width={2} height={2} />}
          onClick={goToToday}
          isDisabled={isTodayOrAfter}
        />
      </ButtonGroup>
    </Flex>
  );
}
