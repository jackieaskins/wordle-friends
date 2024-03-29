import {
  SendBulkTemplatedEmailCommand,
  SendTemplatedEmailCommand,
  SESClient,
} from "@aws-sdk/client-ses";
import { mockClient } from "aws-sdk-client-mock";
import { sendBulkEmail, sendTemplatedEmail } from "./ses";

jest.mock("../constants", () => ({
  FROM_EMAIL_ADDRESS: "no-reply@example.com",
  SITE_NAME: "Site name",
}));

const TEMPLATE = "templateName";
const EMAIL = "email";
const DEFAULT_DATA = { firstName: "Default", puzzleDate: "default" };
const REPLACEMENT_DATA = {
  firstName: "Replacement",
  puzzleDate: "replacement",
};

const sesClient = mockClient(SESClient);

describe("ses", () => {
  beforeEach(() => {
    sesClient.reset();
  });

  describe("sendBulkTemplatedEmail", () => {
    it("sends emails to each destination", async () => {
      expect.assertions(1);

      await sendBulkEmail(TEMPLATE, DEFAULT_DATA, [
        { email: EMAIL, replacementData: REPLACEMENT_DATA },
      ]);

      expect(
        sesClient.commandCalls(SendBulkTemplatedEmailCommand, {
          Source: "Site name <no-reply@example.com>",
          Template: TEMPLATE,
          DefaultTemplateData: JSON.stringify(DEFAULT_DATA),
          Destinations: [
            {
              Destination: { ToAddresses: [EMAIL] },
              ReplacementTemplateData: JSON.stringify(REPLACEMENT_DATA),
            },
          ],
        })
      ).toHaveLength(1);
    });

    it("splits requests into chunks of 50", async () => {
      expect.assertions(1);

      const destinations = [];
      for (let i = 0; i < 151; i++) {
        destinations.push({ email: EMAIL, replacementData: REPLACEMENT_DATA });
      }

      await sendBulkEmail(TEMPLATE, DEFAULT_DATA, destinations);

      expect(
        sesClient.commandCalls(SendBulkTemplatedEmailCommand)
      ).toHaveLength(4);
    });
  });

  describe("sendTemplatedEmail", () => {
    it("sends an email to the provided email", async () => {
      expect.assertions(1);

      await sendTemplatedEmail(TEMPLATE, REPLACEMENT_DATA, EMAIL);

      expect(
        sesClient.commandCalls(SendTemplatedEmailCommand, {
          Source: "Site name <no-reply@example.com>",
          Template: TEMPLATE,
          TemplateData: JSON.stringify(REPLACEMENT_DATA),
          Destination: { ToAddresses: [EMAIL] },
        })
      ).toHaveLength(1);
    });
  });
});
