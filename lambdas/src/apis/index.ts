import { AppSyncResolverEvent } from "aws-lambda";
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
import { reactionsHandler } from "./reactions";
import { sendFriendRequestHandler } from "./sendFriendRequest";

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
  reactionsHandler,
  sendFriendRequestHandler,
};

export default apis;
