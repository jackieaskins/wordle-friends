import { EventBridgeEvent } from "aws-lambda";
import { adminGetUser, UserAttributes } from "../clients/cognito";
import { sendTemplatedEmail } from "../clients/ses";
import { getPost } from "../tables/posts";
import { generatePost } from "../tests/fixtures/posts";
import { handler } from "./reminders";

jest.mock("../clients/cognito", () => ({
  ...jest.requireActual("../clients/cognito"),
  adminGetUser: jest.fn(),
}));

jest.mock("../clients/ses", () => ({
  sendTemplatedEmail: jest.fn(),
}));

jest.mock("../constants", () => ({
  REMINDER_TEMPLATE_NAME: "reminder-template",
}));

jest.mock("../tables/posts", () => ({
  getPost: jest.fn(),
}));

const USER_ID = "userId";
const EMAIL = "email@example.com";
const FIRST_NAME = "Name";
const TZ = "America/New_York";
const EVENT = { detail: { userId: USER_ID } } as EventBridgeEvent<
  string,
  { userId: string }
>;

const mockAdminGetUser = jest.mocked(adminGetUser);
const mockSendTemplatedEmail = jest.mocked(sendTemplatedEmail);
const mockGetPost = jest.mocked(getPost);

async function callHandler() {
  return await handler(EVENT);
}

describe("reminders", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2022-09-04T23:42:09.798Z"));
    mockAdminGetUser.mockResolvedValue({
      "custom:timezone": TZ,
      email: EMAIL,
      given_name: FIRST_NAME,
    } as UserAttributes);
    mockGetPost.mockResolvedValue(generatePost({ userId: USER_ID }));
  });

  it("loads user attributes", async () => {
    expect.assertions(1);

    await callHandler();

    expect(mockAdminGetUser).toHaveBeenCalledWith(USER_ID);
  });

  it("loads the user's post for the current day", async () => {
    expect.assertions(1);

    await callHandler();

    expect(mockGetPost).toHaveBeenCalledWith({
      userId: USER_ID,
      puzzleDate: "2022-09-04",
    });
  });

  it("does not send an email if the user has already posted", async () => {
    expect.assertions(1);

    await callHandler();

    expect(mockSendTemplatedEmail).not.toHaveBeenCalled();
  });

  it("sends an email if the user has not posted", async () => {
    expect.assertions(1);
    mockGetPost.mockResolvedValue(undefined);

    await callHandler();

    expect(mockSendTemplatedEmail).toHaveBeenCalledWith(
      "reminder-template",
      { firstName: FIRST_NAME, puzzleDate: "2022-09-04" },
      EMAIL
    );
  });
});
