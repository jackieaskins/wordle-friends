import { Amplify } from "aws-amplify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

dayjs.extend(relativeTime);

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.REGION,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
});

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
