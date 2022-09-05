import apis from ".";
import { commentDataHandler } from "./comments/commentData";
import { createCommentHandler } from "./comments/createComment";
import { listPostCommentsHandler } from "./comments/listPostComments";
import { acceptFriendRequestHandler } from "./friends/acceptFriendRequest";
import { deleteFriendHandler } from "./friends/deleteFriend";
import { listFriendPostsHandler } from "./friends/listFriendPosts";
import { listFriendsHandler } from "./friends/listFriends";
import { sendFriendRequestHandler } from "./friends/sendFriendRequest";
import { createPostHandler } from "./posts/createPost";
import { getCurrentUserPostHandler } from "./posts/getCurrentUserPost";
import { listPostsHandler } from "./posts/listPosts";
import { listUserPostsHandler } from "./posts/listUserPosts";
import { updatePostHandler } from "./posts/updatePost";
import { createReactionHandler } from "./reactions/createReaction";
import { deleteReactionHandler } from "./reactions/deleteReaction";
import { reactionsHandler } from "./reactions/reactions";

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
  ["updatePost", updatePostHandler],
];

describe("apis", () => {
  it.each(apiHandlers)("returns the proper handler for %s", (key, handler) => {
    expect(apis[`${key}Handler`]).toEqual(handler);
  });

  it("checks each api", () => {
    expect(Object.entries(apis)).toHaveLength(apiHandlers.length);
  });
});
