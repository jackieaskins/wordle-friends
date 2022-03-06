import { AppSyncResolverEvent } from "aws-lambda";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";
import { createCommentHandler } from "./createComment";
import { createPostHandler } from "./createPost";
import { deleteFriendHandler } from "./deleteFriend";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";
import { listFriendPostsHandler } from "./listFriendPosts";
import { listFriendsHandler } from "./listFriends";
import { listPostCommentsHandler } from "./listPostComments";
import { sendFriendRequestHandler } from "./sendFriendRequest";

const handlers: Record<
  string,
  (userId: string, event: AppSyncResolverEvent<any>) => any
> = {
  acceptFriendRequestHandler,
  createCommentHandler,
  createPostHandler,
  deleteFriendHandler,
  getCurrentUserPostHandler,
  listFriendPostsHandler,
  listFriendsHandler,
  listPostCommentsHandler,
  sendFriendRequestHandler,
};

export default handlers;
