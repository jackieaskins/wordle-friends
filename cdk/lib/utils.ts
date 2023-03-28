import { DOMAIN_NAME } from "./constants";

export function generateTemplateText(body: string[]): string {
  const siteUrl = `https://${DOMAIN_NAME}`;

  return [
    "Hi {{firstName}},",
    ...body,
    `Visit Wordle with Friends: ${siteUrl}?date={{puzzleDate}}`,
    `To update subscription preferences: ${siteUrl}/preferences`,
  ].join("\r\n\r\n");
}
