import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";
import { adminGetUser } from "../clients/cognito";
import { sendBulkEmail } from "../clients/ses";
import {
  COMMENT_REPLY_TEMPLATE_NAME,
  POST_COMMENT_TEMPLATE_NAME,
} from "../constants";
import { listAllComments, SimpleComment } from "../tables/comments";
import { getPostById } from "../tables/posts";

export async function handlePostComment(event: DynamoDBRecord): Promise<void> {
  const { dynamodb } = event;

  const newImage = dynamodb?.NewImage;
  if (!newImage) {
    throw new Error("No new image. Fix the configuration.");
  }

  const { postId, userId, text } = unmarshall(
    newImage as { [key: string]: AttributeValue }
  ) as SimpleComment;

  const [{ given_name: firstName, family_name: lastName }, post, allComments] =
    await Promise.all([
      adminGetUser(userId),
      getPostById(postId),
      listAllComments({ postId }),
    ]);
  const friendName = `${firstName} ${lastName}`;

  if (!post) {
    throw new Error(`The post with id "${postId}" does not exist`);
  }

  const { puzzleDate, userId: postUserId } = post;
  const otherCommenterIds = Array.from(
    new Set(
      allComments
        .map(({ userId: commenterId }) => commenterId)
        .filter((commenterId) => ![userId, postUserId].includes(commenterId))
    )
  );

  const [originalPoster, ...otherCommenters] = await Promise.all([
    adminGetUser(postUserId),
    ...otherCommenterIds.map(adminGetUser),
  ]);

  if (
    originalPoster["custom:notifyOnPostComment"] === "true" &&
    postUserId !== userId
  ) {
    await sendBulkEmail(
      POST_COMMENT_TEMPLATE_NAME,
      {
        firstName: "friend",
        friendName: "Your friend",
        puzzleDate: "unknown",
        comment: "Unable to load comment",
      },
      [
        {
          email: originalPoster.email,
          replacementData: {
            firstName: originalPoster.given_name,
            friendName,
            comment: text,
            puzzleDate,
          },
        },
      ]
    );
  }

  const otherCommenterDestinations = otherCommenters.filter(
    ({ ["custom:notifyOnCommentReply"]: notifyOnCommentReply }) =>
      notifyOnCommentReply === "true"
  );

  if (!otherCommenterDestinations.length) {
    return;
  }

  await sendBulkEmail(
    COMMENT_REPLY_TEMPLATE_NAME,
    {
      firstName: "friend",
      posterName: "Someone",
      commenterName: "Someone",
      puzzleDate: "unknown",
      comment: "Unable to load comment",
    },
    otherCommenterDestinations.map(({ email, given_name: firstName }) => ({
      email,
      replacementData: {
        firstName,
        posterName: `${originalPoster.given_name} ${originalPoster.family_name}`,
        commenterName: friendName,
        puzzleDate,
        comment: text,
      },
    }))
  );
}
