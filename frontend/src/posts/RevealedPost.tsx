import {
  Center,
  Flex,
  HStack,
  Square,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback } from "react";
import { Color, Post } from "wordle-friends-graphql";

type RevealedPostProps = {
  post: Post;
};

export default function RevealedPost({
  post: { user, userId, colors, isHardMode, message, guesses, createdAt },
}: RevealedPostProps): JSX.Element {
  const bgColor = useColorModeValue("gray.200", "gray.900");

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
    <Flex
      width="100%"
      p={6}
      bg={bgColor}
      borderRadius="lg"
      justifyContent="space-between"
    >
      <Flex direction="column">
        <Text as="strong">
          {user ? `${user.firstName} ${user.lastName}` : userId}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {dayjs().to(createdAt)} {isHardMode && <span> - Hard mode</span>}
        </Text>
        <Text mt={2}>{message}</Text>
      </Flex>

      <Center>
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
  );
}
