import { AppSyncResolverEvent } from "aws-lambda";
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

const apis: Record<
  string,
  (userId: string, event: AppSyncResolverEvent<any, any>) => any
> = {
  acceptFriendRequestHandler,
  commentDataHandler,
  createCommentHandler,
  createPostHandler,
  createReactionHandler,
  deleteFriendHandler,
  deleteReactionHandler,
  getCurrentUserPostHandler,
  listFriendPostsHandler,
  listFriendsHandler,
  listPostCommentsHandler,
  listPostsHandler,
  listUserPostsHandler,
  reactionsHandler,
  sendFriendRequestHandler,
  updatePostHandler,
};

export default apis;
