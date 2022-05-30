import apis from ".";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";
import { commentDataHandler } from "./commentData";
import { createCommentHandler } from "./createComment";
import { createPostHandler } from "./createPost";
import { createReactionHandler } from "./createReaction";
import { deleteFriendHandler } from "./deleteFriend";
import { deleteReactionHandler } from "./deleteReaction";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";
import { listFriendPostsHandler } from "./listFriendPosts";
import { listFriendsHandler } from "./listFriends";
import { listPostCommentsHandler } from "./listPostComments";
import { listPostsHandler } from "./listPosts";
import { listUserPostsHandler } from "./listUserPosts";
import { reactionsHandler } from "./reactions";
import { sendFriendRequestHandler } from "./sendFriendRequest";

const apiHandlers: [string, any][] = [
  ["acceptFriendRequest", acceptFriendRequestHandler],
  ["commentData", commentDataHandler],
  ["createComment", createCommentHandler],
  ["createPost", createPostHandler],
  ["createReaction", createReactionHandler],
  ["deleteFriend", deleteFriendHandler],
  ["deleteReaction", deleteReactionHandler],
  ["getCurrentUserPost", getCurrentUserPostHandler],
  ["listFriendPosts", listFriendPostsHandler],
  ["listFriends", listFriendsHandler],
  ["listPostComments", listPostCommentsHandler],
  ["listPosts", listPostsHandler],
  ["listUserPosts", listUserPostsHandler],
  ["reactions", reactionsHandler],
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
