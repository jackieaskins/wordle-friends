import { Auth } from "aws-amplify";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useQueryClient } from "react-query";
import { clearCognitoLocalStorage } from "../localStorage";

export type ModifiableUserAttributes = {
  ["custom:showSquares"]?: string;
  ["custom:notifyOnFriendPost"]?: string;
  ["custom:notifyOnPostComment"]?: string;
  ["custom:notifyOnCommentReply"]?: string;
  ["custom:timezone"]?: string;
};
type UserAttributes = ModifiableUserAttributes & {
  email: string;
  family_name: string;
  given_name: string;
  sub: string;
};
export type UserInfo = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  showSquares?: boolean;
  notifyOnFriendPost?: boolean;
  notifyOnPostComment?: boolean;
  notifyOnCommentReply?: boolean;
  timezone?: string;
  rawAttributes: UserAttributes;
};
type UserInfoState = {
  isLoading: boolean;
  currentUserInfo?: UserInfo;
};

type UserInfoAction = {
  type: "set";
  userAttributes?: UserAttributes;
};

export type SignUpProps = {
  username: string;
  password: string;
  attributes: UserAttributes;
};

type AuthContextState = {
  currentUserInfo?: UserInfo;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (props: SignUpProps) => Promise<void>;
  updateUserAttributes: (
    newAttributes: Partial<ModifiableUserAttributes>
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

function userInfoReducer(
  _state: UserInfoState,
  { type, userAttributes }: UserInfoAction
) {
  const convertBoolString = (value: string | undefined) =>
    value == undefined ? value : value === "true";

  switch (type) {
    case "set": {
      if (userAttributes) {
        const {
          email,
          family_name: lastName,
          given_name: firstName,
          sub: id,
          ["custom:showSquares"]: showSquares,
          ["custom:notifyOnFriendPost"]: notifyOnFriendPost,
          ["custom:notifyOnPostComment"]: notifyOnPostComment,
          ["custom:notifyOnCommentReply"]: notifyOnCommentReply,
          ["custom:timezone"]: timezone,
        } = userAttributes;
        return {
          isLoading: false,
          currentUserInfo: {
            email,
            firstName,
            id,
            lastName,
            showSquares: convertBoolString(showSquares),
            notifyOnFriendPost: convertBoolString(notifyOnFriendPost),
            notifyOnPostComment: convertBoolString(notifyOnPostComment),
            notifyOnCommentReply: convertBoolString(notifyOnCommentReply),
            timezone,
            rawAttributes: userAttributes,
          },
        };
      }
      return { isLoading: false };
    }
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const [{ isLoading, currentUserInfo }, dispatchUserInfo] = useReducer(
    userInfoReducer,
    { isLoading: true }
  );

  useEffect(() => {
    (async () => {
      const userInfo = await Auth.currentUserInfo();
      dispatchUserInfo({ type: "set", userAttributes: userInfo?.attributes });
    })();
  }, []);

  const updateUserAttributes = useCallback(
    async (newAttributes: Partial<ModifiableUserAttributes>) => {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, newAttributes);
      const userInfo = await Auth.currentUserInfo();
      dispatchUserInfo({ type: "set", userAttributes: userInfo?.attributes });
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    // Try to prevent "The quota has been exceeded" error when signing in on Apple devices
    clearCognitoLocalStorage();

    const { attributes } = await Auth.signIn(email, password);
    dispatchUserInfo({ type: "set", userAttributes: attributes });
  }, []);

  const signUp = useCallback(async (signUpProps: SignUpProps) => {
    await Auth.signUp(signUpProps);
  }, []);

  const signOut = useCallback(async () => {
    await Auth.signOut();
    dispatchUserInfo({ type: "set" });
    queryClient.clear();
  }, [queryClient]);

  if (isLoading) {
    return <div />;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUserInfo,
        signIn,
        signOut,
        signUp,
        updateUserAttributes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  return useContext(AuthContext);
}
