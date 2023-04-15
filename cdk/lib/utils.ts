import { DOMAIN_NAME, SITE_NAME } from "./constants";

export function generateTemplateText(body: string[]): string {
  const siteUrl = DOMAIN_NAME
    ? `https://${DOMAIN_NAME}`
    : "http://localhost:8080";

  return [
    "Hi {{firstName}},",
    ...body,
    `Visit ${SITE_NAME}: ${siteUrl}?date={{puzzleDate}}`,
    `To update subscription preferences: ${siteUrl}/preferences`,
  ].join("\r\n\r\n");
}
