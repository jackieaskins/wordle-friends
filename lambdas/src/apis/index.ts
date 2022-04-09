import { AppSyncResolverEvent } from "aws-lambda";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";
import { commentDataHandler } from "./commentData";
import { createCommentHandler } from "./createComment";
import { createPostHandler } from "./createPost";
import { deleteFriendHandler } from "./deleteFriend";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";
import { listFriendPostsHandler } from "./listFriendPosts";
import { listFriendsHandler } from "./listFriends";
import { listPostCommentsHandler } from "./listPostComments";
import { listPostsHandler } from "./listPosts";
import { sendFriendRequestHandler } from "./sendFriendRequest";

const apis: Record<
  string,
  (userId: string, event: AppSyncResolverEvent<any, any>) => any
> = {
  acceptFriendRequestHandler,
  commentDataHandler,
  createCommentHandler,
  createPostHandler,
  deleteFriendHandler,
  getCurrentUserPostHandler,
  listFriendPostsHandler,
  listFriendsHandler,
  listPostCommentsHandler,
  listPostsHandler,
  sendFriendRequestHandler,
};

export default apis;
