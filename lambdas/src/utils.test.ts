import { Color } from "wordle-friends-graphql";
import { convertColorsToSquares } from "./utils";

describe("utils", () => {
  describe("convertColorsToSquares", () => {
    it("returns colors when showing squares", () => {
      expect(
        convertColorsToSquares(
          [
            [null, null, null],
            [Color.YELLOW, Color.YELLOW, Color.YELLOW],
            [Color.GREEN, Color.GREEN, Color.GREEN],
            [null, Color.YELLOW, Color.GREEN],
          ],
          "true"
        )
      ).toEqual([
        ["⬛", "⬛", "⬛"],
        ["🟨", "🟨", "🟨"],
        ["🟩", "🟩", "🟩"],
        ["⬛", "🟨", "🟩"],
      ]);
    });
  });

  it("returns black squares when not showing squares", () => {
    expect(
      convertColorsToSquares([[null, Color.YELLOW, Color.GREEN]], "false")
    ).toEqual([["⬛", "⬛", "⬛"]]);
  });

  it("returns black squares when show squares is not defined", () => {
    expect(
      convertColorsToSquares([[null, Color.YELLOW, Color.GREEN]], undefined)
    ).toEqual([["⬛", "⬛", "⬛"]]);
  });
});
