import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Square,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { Color, Post } from "wordle-friends-graphql";
import NewLineText from "../common/NewLineText";
import RelativeTime from "../common/RelativeTime";
import UserName from "../common/UserName";
import { PostWithComments } from "./api";
import CommentSection from "./CommentSection";

type RevealedPostProps = {
  currentUserPost: Post | null | undefined;
  post: PostWithComments;
};

export default function RevealedPost({
  currentUserPost,
  post,
}: RevealedPostProps): JSX.Element {
  const { user, userId, colors, isHardMode, message, guesses, createdAt } =
    post;

  const bgColor = useColorModeValue("gray.50", "gray.900");

  const normalFg = useColorModeValue("gray.600", "white");
  const normalBg = useColorModeValue("gray.300", "gray.600");

  const getColor = useCallback(
    (color: Color | null, ground: "fg" | "bg") => {
      switch (color) {
        case Color.GREEN:
          return { bg: "green.400", fg: "white" }[ground];
        case Color.YELLOW:
          return { bg: "yellow.300", fg: "gray.600" }[ground];
        default:
          return { bg: normalBg, fg: normalFg }[ground];
      }
    },
    [normalBg, normalFg]
  );

  return (
    <Box width="100%" bg={bgColor} borderRadius="lg" px={3}>
      <Flex m={4} justifyContent="space-between" direction={["column", "row"]}>
        <Flex direction="column">
          <Text as="strong">
            <UserName user={user} userId={userId} />
          </Text>
          <Text fontSize="xs" color="gray.500">
            <RelativeTime timestamp={createdAt} />{" "}
            {isHardMode && <span> - Hard mode</span>}
          </Text>
          <NewLineText mt={2}>{message}</NewLineText>
        </Flex>

        <Center mt={[4, 0]}>
          <Stack spacing={1}>
            {colors.map((row, rowIndex) => (
              <HStack key={rowIndex} spacing={1}>
                {row.map((color, colorIndex) => (
                  <Square
                    size="25px"
                    key={colorIndex}
                    color={getColor(color, "fg")}
                    bg={getColor(color, "bg")}
                  >
                    {guesses?.[rowIndex].charAt(colorIndex).toUpperCase()}
                  </Square>
                ))}
              </HStack>
            ))}
          </Stack>
        </Center>
      </Flex>

      {currentUserPost && (
        <>
          <Divider />
          <CommentSection post={post} />
        </>
      )}
    </Box>
  );
}
