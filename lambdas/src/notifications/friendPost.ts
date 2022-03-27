import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";
import { FriendStatus } from "wordle-friends-graphql";
import { adminGetUser } from "../clients/cognito";
import { sendBulkEmail } from "../clients/ses";
import { FRIEND_POST_TEMPLATE_NAME } from "../constants";
import { listAllFriends } from "../tables/friends";
import { SimplePost } from "../tables/posts";
import { convertColorsToSquares } from "../utils";

export async function handleFriendPost({
  dynamodb,
}: DynamoDBRecord): Promise<void> {
  const newImage = dynamodb?.NewImage;
  if (!newImage) {
    throw new Error("No new image. Fix the configuration.");
  }

  const { userId, colors, puzzleDate } = unmarshall(
    newImage as { [key: string]: AttributeValue }
  ) as SimplePost;

  const [
    friends,
    {
      given_name: firstName,
      family_name: lastName,
      ["custom:showSquares"]: showSquares,
    },
  ] = await Promise.all([
    listAllFriends({ userId, status: FriendStatus.ACCEPTED }),
    adminGetUser(userId),
  ]);

  const targetUsers = (
    await Promise.all(friends.map(({ friendId }) => adminGetUser(friendId)))
  ).filter(
    ({ ["custom:notifyOnFriendPost"]: notifyOnFriendPost }) =>
      notifyOnFriendPost === "true"
  );

  if (!targetUsers.length) {
    return;
  }

  const friendName = `${firstName} ${lastName}`;
  await sendBulkEmail(
    FRIEND_POST_TEMPLATE_NAME,
    {
      firstName: "friend",
      friendName: "Your friend",
      puzzleDate: "unknown",
      result: "Unable to load result",
    },
    targetUsers.map(({ given_name: firstName, email }) => ({
      email,
      replacementData: {
        firstName,
        friendName,
        puzzleDate,
        result: convertColorsToSquares(colors, showSquares)
          .map((row) => row.join(""))
          .join("\r\n"),
      },
    }))
  );
}
