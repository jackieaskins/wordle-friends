import {
  AccountRecovery,
  UserPool,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

const VERIFICATION_MESSAGE =
  "Thanks for signing up for Wordle Friends! Your verification code is {####}";

export class CognitoConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: "wordle-friends-userpool",
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for Wordle Friends",
        emailBody: VERIFICATION_MESSAGE,
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: VERIFICATION_MESSAGE,
      },
      signInAliases: { email: true },
      autoVerify: { email: true },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
    });

    userPool.addClient("UserPoolWebClient", {
      userPoolClientName: "wordle-friends-userpool-webclient",
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
    });
  }
}
