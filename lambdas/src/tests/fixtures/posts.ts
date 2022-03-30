import { Color } from "wordle-friends-graphql";
import { SimplePost } from "../../tables/posts";
import { ISO_STRING, PUZZLE_DATE, USER_ID } from "../constants";

export function generatePost(overrides: Partial<SimplePost> = {}): SimplePost {
  return {
    id: `${USER_ID}:${PUZZLE_DATE}`,
    colors: [
      [null, null, null, null, null],
      [Color.YELLOW, Color.GREEN, null, Color.YELLOW, null],
      [Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN],
    ],
    userId: USER_ID,
    createdAt: ISO_STRING,
    updatedAt: ISO_STRING,
    isHardMode: true,
    puzzleDate: PUZZLE_DATE,
    guesses: ["stire", "pygmy", "nymph"],
    message: "This is a message",
    ...overrides,
  };
}

export function generatePartialPost(
  overrides: Partial<SimplePost> = {}
): SimplePost {
  return {
    ...generatePost(),
    guesses: null,
    message: null,
    colors: [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ],
    ...overrides,
  };
}
