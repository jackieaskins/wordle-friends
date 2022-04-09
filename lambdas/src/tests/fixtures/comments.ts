import { SimpleComment } from "../../tables/comments";
import { PUZZLE_DATE, TIMESTAMPS, USER_ID } from "../constants";

export function generateComment(
  overrides: Partial<SimpleComment> = {}
): SimpleComment {
  return {
    id: "123",
    postId: `${USER_ID}:${PUZZLE_DATE}`,
    userId: USER_ID,
    text: "This is the comment",
    ...TIMESTAMPS,
    ...overrides,
  };
}
