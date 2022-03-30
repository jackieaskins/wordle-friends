import apis from ".";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";
import { createCommentHandler } from "./createComment";
import { createPostHandler } from "./createPost";
import { deleteFriendHandler } from "./deleteFriend";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";
import { listFriendPostsHandler } from "./listFriendPosts";
import { listFriendsHandler } from "./listFriends";
import { listPostCommentsHandler } from "./listPostComments";
import { listPostsHandler } from "./listPosts";
import { sendFriendRequestHandler } from "./sendFriendRequest";

const apiHandlers: [string, any][] = [
  ["acceptFriendRequest", acceptFriendRequestHandler],
  ["createComment", createCommentHandler],
  ["createPost", createPostHandler],
  ["deleteFriend", deleteFriendHandler],
  ["getCurrentUserPost", getCurrentUserPostHandler],
  ["listFriendPosts", listFriendPostsHandler],
  ["listFriends", listFriendsHandler],
  ["listPostComments", listPostCommentsHandler],
  ["listPosts", listPostsHandler],
  ["sendFriendRequest", sendFriendRequestHandler],
];

describe("apis", () => {
  it.each(apiHandlers)("returns the proper handler for %s", (key, handler) => {
    expect(apis[`${key}Handler`]).toEqual(handler);
  });

  it("checks each api", () => {
    expect(Object.entries(apis)).toHaveLength(apiHandlers.length);
  });
});
