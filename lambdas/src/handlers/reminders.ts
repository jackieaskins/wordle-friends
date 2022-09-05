import { EventBridgeEvent } from "aws-lambda";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { adminGetUser } from "../clients/cognito";
import { sendTemplatedEmail } from "../clients/ses";
import { REMINDER_TEMPLATE_NAME } from "../constants";
import { getPost } from "../tables/posts";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function handler({
  detail: { userId },
}: EventBridgeEvent<string, { userId: string }>): Promise<void> {
  const {
    "custom:timezone": tz,
    email,
    given_name: firstName,
  } = await adminGetUser(userId);

  const puzzleDate = dayjs().tz(tz).format("YYYY-MM-DD");
  const post = await getPost({ userId, puzzleDate });

  if (!post) {
    await sendTemplatedEmail(
      REMINDER_TEMPLATE_NAME,
      { firstName, puzzleDate },
      email
    );
  }
}
