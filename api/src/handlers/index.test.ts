import handlers from ".";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";
import { createCommentHandler } from "./createComment";
import { createPostHandler } from "./createPost";
import { deleteFriendHandler } from "./deleteFriend";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";
import { listFriendPostsHandler } from "./listFriendPosts";
import { listFriendsHandler } from "./listFriends";
import { listPostCommentsHandler } from "./listPostComments";
import { sendFriendRequestHandler } from "./sendFriendRequest";

describe("handlers", () => {
  it.each([
    ["acceptFriendRequest", acceptFriendRequestHandler],
    ["createComment", createCommentHandler],
    ["createPost", createPostHandler],
    ["deleteFriend", deleteFriendHandler],
    ["getCurrentUserPost", getCurrentUserPostHandler],
    ["listFriendPosts", listFriendPostsHandler],
    ["listFriends", listFriendsHandler],
    ["listPostComments", listPostCommentsHandler],
    ["sendFriendRequest", sendFriendRequestHandler],
  ])("returns the proper handler for %s", (key, handler) => {
    expect(handlers[`${key}Handler`]).toEqual(handler);
  });
});
