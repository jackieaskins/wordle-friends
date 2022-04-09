import { Color } from "wordle-friends-graphql";
import { SimplePost } from "../../tables/posts";
import { PUZZLE_DATE, TIMESTAMPS, USER_ID } from "../constants";

export function generatePost({
  userId = USER_ID,
  puzzleDate = PUZZLE_DATE,
  ...overrides
}: Partial<SimplePost> = {}): SimplePost {
  return {
    id: `${userId}:${puzzleDate}`,
    colors: [
      [null, null, null, null, null],
      [Color.YELLOW, Color.GREEN, null, Color.YELLOW, null],
      [Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN],
    ],
    userId,
    isHardMode: true,
    puzzleDate,
    guesses: ["stire", "pygmy", "nymph"],
    message: "This is a message",
    ...TIMESTAMPS,
    ...overrides,
  };
}

export function generatePartialPost({
  guesses = null,
  message = null,
  colors = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  ...overrides
}: Partial<SimplePost> = {}): SimplePost {
  return {
    ...generatePost(overrides),
    guesses,
    message,
    colors,
  };
}
