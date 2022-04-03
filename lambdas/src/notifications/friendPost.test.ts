import { AttributeValue } from "aws-lambda";
import { adminGetUser } from "../clients/cognito";
import { sendBulkEmail } from "../clients/ses";
import { listAllFriends } from "../tables/friends";
import { convertColorsToSquares } from "../utils";
import { handleFriendPost } from "./friendPost";

jest.mock("../clients/cognito", () => ({
  adminGetUser: jest.fn(),
}));

jest.mock("../clients/ses", () => ({
  sendBulkEmail: jest.fn(),
}));

jest.mock("../constants", () => ({
  FRIEND_POST_TEMPLATE_NAME: "FRIEND_POST_TEMPLATE_NAME",
}));

jest.mock("../tables/friends", () => ({
  listAllFriends: jest.fn(),
}));

jest.mock("../utils", () => ({
  convertColorsToSquares: jest.fn().mockReturnValue([["⬛"]]),
}));

const NEW_IMAGE = {
  userId: { S: "userId" },
  colors: { L: [{ L: [{ NULL: true }] }] },
  puzzleDate: { S: "2021-01-01" },
};

async function callHandler(newImage?: Record<string, AttributeValue>) {
  return await handleFriendPost({ dynamodb: { NewImage: newImage } });
}

describe("handleFriendPost", () => {
  beforeEach(() => {
    (listAllFriends as jest.Mock).mockResolvedValue([
      { friendId: "notify" },
      { friendId: "do-not-notify" },
    ]);
    (adminGetUser as jest.Mock)
      .mockResolvedValueOnce({
        given_name: "Friend",
        family_name: "Post",
      })
      .mockResolvedValueOnce({
        given_name: "Notify",
        email: "notify@email",
        ["custom:notifyOnFriendPost"]: "true",
        ["custom:showSquares"]: "false",
      })
      .mockResolvedValue({
        ["custom:notifyOnFriendPost"]: "false",
      });
  });

  it("throws an error if no new image", async () => {
    expect.assertions(1);

    await expect(callHandler()).rejects.toEqual(
      new Error("No new image. Fix the configuration.")
    );
  });

  it("exits early if no friends should be notified", async () => {
    expect.assertions(1);

    (adminGetUser as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce({
        given_name: "Friend",
        family_name: "Post",
        ["custom:showSquares"]: "true",
      })
      .mockResolvedValue({
        ["custom:notifyOnFriendPost"]: "false",
      });

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).not.toHaveBeenCalled();
  });

  it("properly hides or shows colors for friends", async () => {
    expect.assertions(1);

    await callHandler(NEW_IMAGE);

    expect(convertColorsToSquares).toHaveBeenCalledWith([[null]], "false");
  });

  it("sends an email for each of the post's user's friends", async () => {
    expect.assertions(2);

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).toHaveBeenCalledTimes(1);
    expect((sendBulkEmail as jest.Mock).mock.calls[0]).toEqual([
      "FRIEND_POST_TEMPLATE_NAME",
      {
        firstName: "friend",
        friendName: "Your friend",
        puzzleDate: "unknown",
        result: "Unable to load result",
      },
      [
        {
          email: "notify@email",
          replacementData: {
            firstName: "Notify",
            friendName: "Friend Post",
            puzzleDate: "2021-01-01",
            result: "⬛",
          },
        },
      ],
    ]);
  });
});
