import { HStack, Square, Stack } from "@chakra-ui/react";
import { Color } from "wordle-friends-graphql";
import { useSquareColors } from "../utils/colors";

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
  const { getFgColor, getBgColor } = useSquareColors();

  return (
    <Stack spacing={1}>
      {colors.map((row, rowIndex) => (
        <HStack key={rowIndex} spacing={1}>
          {row.map((color, colorIndex) => (
            <Square
              size={squareSize}
              key={colorIndex}
              color={getFgColor(color)}
              bg={getBgColor(color)}
            >
              {guesses?.[rowIndex].charAt(colorIndex).toUpperCase()}
            </Square>
          ))}
        </HStack>
      ))}
    </Stack>
  );
}
