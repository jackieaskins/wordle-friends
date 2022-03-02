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
import { Color, FullPost } from "../API";

type RevealedPostProps = {
  post: FullPost;
};

export default function RevealedPost({
  post: {
    user: { firstName, lastName },
    colors,
    isHardMode,
    guesses,
    createdAt,
  },
}: RevealedPostProps): JSX.Element {
  const bgColor = useColorModeValue("gray.100", "gray.900");

  const normalFg = useColorModeValue("gray.600", "white");
  const normalBg = useColorModeValue("white", "gray.600");

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
    <Stack width="100%" p={6} bg={bgColor} borderRadius="lg" spacing={6}>
      <Flex justifyContent="space-between">
        <Stack spacing={0}>
          <Text as="strong">
            {firstName} {lastName}
          </Text>
          {isHardMode && <Text>Hard mode</Text>}
        </Stack>
        <Text>{dayjs().to(createdAt)}</Text>
      </Flex>

      <Center>
        <Stack>
          {guesses?.map((guess, guessIndex) => (
            <HStack key={guessIndex}>
              {guess.split("").map((letter, letterIndex) => (
                <Square
                  size="30px"
                  key={letterIndex}
                  color={getColor(colors[guessIndex][letterIndex], "fg")}
                  bg={getColor(colors[guessIndex][letterIndex], "bg")}
                >
                  {letter.toUpperCase()}
                </Square>
              ))}
            </HStack>
          ))}
        </Stack>
      </Center>
    </Stack>
  );
}
