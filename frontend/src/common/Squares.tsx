import { HStack, Square, Stack, useColorModeValue } from "@chakra-ui/react";
import { useCallback } from "react";
import { Color } from "wordle-friends-graphql";

type SquaresProps = {
  colors: (Color | null)[][];
  guesses?: string[] | null | undefined;
  squareSize?: string;
};

export default function Squares({
  colors,
  guesses,
  squareSize = "25px",
}: SquaresProps): JSX.Element {
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
    <Stack spacing={1}>
      {colors.map((row, rowIndex) => (
        <HStack key={rowIndex} spacing={1}>
          {row.map((color, colorIndex) => (
            <Square
              size={squareSize}
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
  );
}
