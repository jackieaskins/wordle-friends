import {
  SendBulkTemplatedEmailCommand,
  SendTemplatedEmailCommand,
  SESClient,
} from "@aws-sdk/client-ses";
import { REGION } from "../constants";

export type BaseTemplateData = {
  firstName: string;
  puzzleDate: string;
};
type BulkEmailDestination<T> = {
  email: string;
  replacementData: T;
};

const CHUNK_SIZE = 50;
const FROM_ADDRESS =
  "Wordle with Friends <no-reply@wordle-friends.jackieaskins.com>";

const client = new SESClient({ region: REGION });

function chunkArr<T>(items: T[]): T[][] {
  const output: T[][] = [];
  let chunk: T[] = [];

  for (const item of items) {
    if (chunk.length === CHUNK_SIZE) {
      output.push(chunk);
      chunk = [];
    }

    chunk.push(item);
  }

  output.push(chunk);

  return output;
}

// TODO: Error handling
export async function sendBulkEmail<T extends BaseTemplateData>(
  template: string,
  defaultData: T,
  destinations: BulkEmailDestination<T>[]
): Promise<void> {
  await Promise.all(
    chunkArr(destinations).map((chunk) =>
      client.send(
        new SendBulkTemplatedEmailCommand({
          Source: FROM_ADDRESS,
          Template: template,
          DefaultTemplateData: JSON.stringify(defaultData),
          Destinations: chunk.map(({ email, replacementData }) => ({
            Destination: { ToAddresses: [email] },
            ReplacementTemplateData: JSON.stringify(replacementData),
          })),
        })
      )
    )
  );
}

export async function sendTemplatedEmail<T extends BaseTemplateData>(
  template: string,
  templateData: T,
  email: string
): Promise<void> {
  await client.send(
    new SendTemplatedEmailCommand({
      Source: FROM_ADDRESS,
      Template: template,
      TemplateData: JSON.stringify(templateData),
      Destination: { ToAddresses: [email] },
    })
  );
}
