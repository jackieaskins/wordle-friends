import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateString } from "./utils/dates";

type DateChangerProps = {
  date: Dayjs;
};

export default function DateChanger({ date }: DateChangerProps): JSX.Element {
  const navigate = useNavigate();

  const goToPreviousDay = useCallback(() => {
    navigate(`?date=${formatDateString(date.subtract(1, "day"))}`);
  }, [date, navigate]);

  const goToNextDay = useCallback(() => {
    navigate(`?date=${formatDateString(date.add(1, "day"))}`);
  }, [date, navigate]);

  const goToToday = useCallback(() => {
    navigate(`?date=${formatDateString(dayjs())}`);
  }, [navigate]);

  const isTodayOrAfter = useMemo(
    () => !date.isValid() || date.isAfter(dayjs().subtract(1, "day"), "day"),
    [date]
  );
  const isAfterToday = useMemo(
    () => !date.isValid() || date.isAfter(dayjs(), "day"),
    [date]
  );

  return (
    <Flex justifyContent="space-between" alignItems="center" direction="row">
      <Text as="strong">{date.format("MMMM D, YYYY")}</Text>

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
