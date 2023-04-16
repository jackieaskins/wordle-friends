# Wordle with Friends

**Visit:** https://wordle-friends.jackieaskins.com

Wordle with Friends is a social sharing site for the popular game, [Wordle](https://www.nytimes.com/games/wordle/index.html). It allows connecting with your friends and sharing your daily Wordle results without accidentally spoiling anyone. The app is built on AWS and is deployed using the AWS CDK.

## Local Development

### Prerequisites

- [Install NodeJS 18](https://nodejs.org/en/download)
  - Other versions may work, but 18 is recommended
- [Create an AWS account](https://aws.amazon.com/free)
- [Configure the AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

### Resource Creation

The stacks reference some resources that are not managed within the stack. This may change in the future, but here are instructions for creating these resources.

#### SES Verified Identity

This app uses SES to send notifications, reminders, and account-related information. In order to utilize SES, you must set up a verified identity in your account. If you choose to set up a custom domain for the app (instructions in Optional Resources below), you can verify the top-level domain. Otherwise, you can verify a single email address.

Follow [Creating and verifying identities in Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html) to create and verify a domain. Note that your AWS account will be placed in the SES sandbox mode, which will only allow you to send emails to verified email addresses. See [Moving out of the Sandbox SES sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) for more information.

#### Optional Resources

You can optionally configure a custom domain and an SNS topic for receiving notifications when an alarm triggers.

<details>
  <summary>Show optional resources</summary>

##### Domain

If you'd like to vend the app and send emails from a custom domain, create a domain. There are tons of options for configuring custom domains. For ease of use with the other AWS resources, you may consider using [Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html)

##### Hosted Zone

TODO: Specify instructions

##### Alarm Action SNS Topic

TODO: Specify instructions

</details>

### Dependency Installation

This repository utilizes [NPM workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces) to manage the `cdk`, `frontend`, `graphql`, and `lambdas` packages. Each package has its own `package.json` and there is a top-level `package.json` file with scripts to make interacting with each workspace easier.

Start by installing the required dependencies for all of the workspaces:

```sh
npm install
```

Try building the packages to make sure everything succeeds:

```sh
npm run build
```

### Alpha Backend Deployment

1. Create a new file at `cdk/.env`
2. Copy the following into the new file and configure the variables:

   ```sh
   # Required variables
   # Domain name or email address verified with SES
   SES_VERIFIED_IDENTITY=""
   # Email address verified with SES or an email in the registered domain (e.g. no-reply@example.com)
   FROM_EMAIL_ADDRESS=""

   # Optional variables
   # Domain name with a hosted zone
   DOMAIN_NAME=""
   # Arn for the SNS Topic configured to receive alarm notifications
   CLOUD_WATCH_ALARM_TOPIC_ARN=""
   ```

3. Deploy the alpha backend!
   ```sh
   npm run deploy:backend:alpha
   ```
4. Take note of the Cognito output values, you'll need them in the next steps.

### Local Website

1. Create a new file at `frontend/.env.development`.
2. Copy the following into the new file and configure the variables:

   ```sh
   # Set region to the region that your backend alpha stack is deployed to
   REGION="us-east-1"

   # Grab the following from the output of your backend stack
   IDENTITY_POOL_ID=""
   USER_POOL_ID=""
   USER_POOL_WEB_CLIENT_ID=""
   GRAPHQL_ENDPOINT=""
   ```

3. Start the server!
   ```sh
   npm run frontend
   ```
