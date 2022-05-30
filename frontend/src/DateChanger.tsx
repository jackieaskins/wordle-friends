import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo } from "react";
import { useDate } from "./DateContext";
import { formatDateString } from "./utils/dates";
import { useManageSearchParams } from "./utils/searchParams";

export default function DateChanger(): JSX.Element {
  const { selectedDate, currentDateTime } = useDate();
  const { addSearchParam } = useManageSearchParams();

  const goTo = useCallback(
    (day: Dayjs) => addSearchParam("date", formatDateString(day)),
    [addSearchParam]
  );

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
          onClick={() => goTo(selectedDate.subtract(1, "day"))}
          isDisabled={isAfterToday}
        />
        <IconButton
          aria-label="Go to next day"
          icon={<ChevronRightIcon />}
          onClick={() => goTo(selectedDate.add(1, "day"))}
          isDisabled={isTodayOrAfter}
        />
        <IconButton
          aria-label="Go to today"
          icon={<ArrowRightIcon width={2} height={2} />}
          onClick={() => goTo(dayjs())}
          isDisabled={isTodayOrAfter}
        />
      </ButtonGroup>
    </Flex>
  );
}
