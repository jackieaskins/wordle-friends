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

export type UserInfo = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};

export type SignUpProps = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type AuthContextState = {
  currentUserInfo?: UserInfo;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (props: SignUpProps) => Promise<void>;
};

const AuthContext = createContext<AuthContextState>({} as AuthContextState);
type UserInfoState = {
  isLoading: boolean;
  currentUserInfo?: UserInfo;
};
type UserInfoAction = {
  type: "set";
  userAttributes?: {
    email: string;
    family_name: string;
    given_name: string;
    sub: string;
  };
};

function userInfoReducer(
  _state: UserInfoState,
  { type, userAttributes }: UserInfoAction
) {
  switch (type) {
    case "set": {
      if (userAttributes) {
        const {
          email,
          family_name: lastName,
          given_name: firstName,
          sub: id,
        } = userAttributes;
        return {
          isLoading: false,
          currentUserInfo: {
            email,
            firstName,
            id,
            lastName,
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

  const signIn = useCallback(async (email, password) => {
    const { attributes } = await Auth.signIn(email, password);
    dispatchUserInfo({ type: "set", userAttributes: attributes });
  }, []);

  const signUp = useCallback(
    async ({ email, password, firstName, lastName }) => {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          given_name: firstName,
          family_name: lastName,
        },
      });
    },
    []
  );

  const signOut = useCallback(async () => {
    await Auth.signOut();
    dispatchUserInfo({ type: "set" });
    queryClient.clear();
  }, [queryClient]);

  if (isLoading) {
    return <div>Loading user info</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUserInfo,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  return useContext(AuthContext);
}
