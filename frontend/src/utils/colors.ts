import { useColorModeValue } from "@chakra-ui/react";
import { useCallback } from "react";
import { Color } from "wordle-friends-graphql";

export function useSecondaryTextColor(): string {
  return useColorModeValue("gray.500", "whiteAlpha.400");
}

export function useSquareColors(): {
  getBgColor: (color: Color | null) => string;
  getFgColor: (color: Color | null) => string;
} {
  const normalFg = useColorModeValue("gray.600", "white");
  const normalBg = useColorModeValue("gray.300", "gray.600");

  const getBgColor = useCallback(
    (color: Color | null) => {
      switch (color) {
        case Color.GREEN:
          return "green.400";
        case Color.YELLOW:
          return "yellow.300";
        default:
          return normalBg;
      }
    },
    [normalBg]
  );

  const getFgColor = useCallback(
    (color: Color | null) => {
      switch (color) {
        case Color.GREEN:
          return "white";
        case Color.YELLOW:
          return "gray.600";
        default:
          return normalFg;
      }
    },
    [normalFg]
  );

  return { getBgColor, getFgColor };
}
