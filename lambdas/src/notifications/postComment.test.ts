import { AttributeValue } from "aws-lambda";
import { adminGetUser } from "../clients/cognito";
import { sendBulkEmail } from "../clients/ses";
import { listAllComments } from "../tables/comments";
import { getPostById } from "../tables/posts";
import { handlePostComment } from "./postComment";

jest.mock("../clients/cognito", () => ({
  adminGetUser: jest.fn(),
}));

jest.mock("../clients/ses", () => ({
  sendBulkEmail: jest.fn(),
}));

jest.mock("../constants", () => ({
  COMMENT_REPLY_TEMPLATE_NAME: "COMMENT_REPLY_TEMPLATE_NAME",
  POST_COMMENT_TEMPLATE_NAME: "POST_COMMENT_TEMPLATE_NAME",
}));

jest.mock("../tables/comments", () => ({
  listAllComments: jest.fn(),
}));

jest.mock("../tables/posts", () => ({
  getPostById: jest.fn(),
}));

const NEW_IMAGE = {
  postId: { S: "postId" },
  userId: { S: "commenter" },
  text: { S: "Comment text" },
};

async function callHandler(newImage?: Record<string, AttributeValue>) {
  await handlePostComment({
    dynamodb: {
      NewImage: newImage,
    },
  });
}

describe("handlePostComment", () => {
  beforeEach(() => {
    (adminGetUser as jest.Mock)
      .mockResolvedValueOnce({
        given_name: "Trigger",
        family_name: "Commenter",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnPostComment"]: "true",
        email: "original@email",
        given_name: "Original",
        family_name: "Poster",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnCommentReply"]: "true",
        email: "notify@email",
        given_name: "Other",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnCommentReply"]: "false",
      });
    (getPostById as jest.Mock).mockResolvedValue({
      puzzleDate: "2021-01-01",
      userId: "postUserId",
    });
    (listAllComments as jest.Mock).mockResolvedValue([
      { userId: "notify" },
      { userId: "postUserId" },
      { userId: "no-notify" },
    ]);
  });

  it("throws an error if no new image", async () => {
    expect.assertions(1);

    await expect(callHandler()).rejects.toEqual(
      new Error("No new image. Fix the configuration.")
    );
  });

  it("throws an error if no post", async () => {
    expect.assertions(1);

    (getPostById as jest.Mock).mockResolvedValue(undefined);

    await expect(callHandler(NEW_IMAGE)).rejects.toEqual(
      new Error('The post with id "postId" does not exist')
    );
  });

  it("does not send an email to other commenters if notifications are not enabled", async () => {
    expect.assertions(1);

    (adminGetUser as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce({
        given_name: "Trigger",
        family_name: "Commenter",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnPostComment"]: "false",
        email: "original@email",
        given_name: "Original",
        family_name: "Poster",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnCommentReply"]: "false",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnCommentReply"]: "false",
      });

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).not.toHaveBeenCalled();
  });

  it("does not send an email to the original poster if notifications are not enabled", async () => {
    expect.assertions(1);

    (adminGetUser as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce({
        given_name: "Trigger",
        family_name: "Commenter",
      })
      .mockResolvedValueOnce({
        ["custom:notifyOnPostComment"]: "false",
        email: "original@email",
        given_name: "Original",
        family_name: "Poster",
      });
    (listAllComments as jest.Mock).mockReset().mockResolvedValue([]);

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).not.toHaveBeenCalled();
  });

  it("sends an email to the current user if they enable notifications", async () => {
    expect.assertions(1);

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).toHaveBeenCalledWith(
      "POST_COMMENT_TEMPLATE_NAME",
      {
        firstName: "friend",
        friendName: "Your friend",
        puzzleDate: "unknown",
        comment: "Unable to load comment",
      },
      [
        {
          email: "original@email",
          replacementData: {
            firstName: "Original",
            friendName: "Trigger Commenter",
            comment: "Comment text",
            puzzleDate: "2021-01-01",
          },
        },
      ]
    );
  });

  it("sends an email to other commenters with notifications enabled", async () => {
    expect.assertions(1);

    await callHandler(NEW_IMAGE);

    expect(sendBulkEmail).toHaveBeenCalledWith(
      "COMMENT_REPLY_TEMPLATE_NAME",
      {
        firstName: "friend",
        posterName: "Someone",
        commenterName: "Someone",
        puzzleDate: "unknown",
        comment: "Unable to load comment",
      },
      [
        {
          email: "notify@email",
          replacementData: {
            comment: "Comment text",
            commenterName: "Trigger Commenter",
            firstName: "Other",
            posterName: "Original Poster",
            puzzleDate: "2021-01-01",
          },
        },
      ]
    );
  });
});
