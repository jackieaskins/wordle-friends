import { Amplify } from "aws-amplify";
import ReactDOM from "react-dom";
import App from "./App";

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  },
});

ReactDOM.render(<App />, document.getElementById("root"));
