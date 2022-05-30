import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useDate } from "../DateContext";
import { useUserPosts } from "../posts/api";
import { useSecondaryTextColor } from "../utils/colors";
import { formatDateString } from "../utils/dates";
import PostStats from "./PostStats";

const DATE_FORMAT = "MMM D";
const NUM_DAYS = 7;

export default function StatAccordion(): JSX.Element {
  const { currentDateTime } = useDate();
  const secondaryTextColor = useSecondaryTextColor();
  const currentDate = useMemo(
    () => formatDateString(currentDateTime),
    [currentDateTime]
  );
  const startDate = useMemo(
    () => formatDateString(dayjs(currentDate).subtract(NUM_DAYS - 1, "days")),
    [currentDate]
  );
  const { data: posts, isLoading } = useUserPosts(startDate, currentDate);

  return (
    <Accordion allowToggle>
      <Skeleton isLoaded={!isLoading}>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <AccordionButton
                pl={0}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="end">
                  <Text as="strong" pr={2}>
                    Stats
                  </Text>
                  <Text color={secondaryTextColor} fontSize="sm">
                    {dayjs(startDate).format(DATE_FORMAT)} -{" "}
                    {dayjs(currentDate).format(DATE_FORMAT)}
                  </Text>
                </Box>

                {isExpanded ? (
                  <MinusIcon fontSize="12px" />
                ) : (
                  <AddIcon fontSize="12px" />
                )}
              </AccordionButton>

              <AccordionPanel pb={4}>
                {posts?.length ? (
                  <PostStats posts={posts} />
                ) : (
                  <Text textAlign="center" color={secondaryTextColor}>
                    No games played in last {NUM_DAYS} days
                  </Text>
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Skeleton>
    </Accordion>
  );
}
