import { Color } from "wordle-friends-graphql";

type Square = "🟩" | "🟨" | "⬛";

export function convertColorsToSquares(
  colors: (Color | null)[][],
  showSquares: "true" | "false" | undefined
): Square[][] {
  return colors.map((row) =>
    row.map((square) => {
      if (showSquares === "true") {
        switch (square) {
          case Color.GREEN:
            return "🟩";
          case Color.YELLOW:
            return "🟨";
          default:
            return "⬛";
        }
      }
      return "⬛";
    })
  );
}
