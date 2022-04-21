import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Reaction } from "wordle-friends-graphql";

type ReactionsContextState = {
  getReactions: (postId: string) => Record<string, string[]>;
  updateReaction: (postId: string, reaction: Reaction) => void;
  setReactions: (postId: string, reactions: Reaction[]) => void;
};

const ReactionsContext = createContext<ReactionsContextState>(
  {} as ReactionsContextState
);

export function ReactionsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [reactionsByPost, setReactionsByPost] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const getReactions = useCallback(
    (postId: string) => reactionsByPost[postId] ?? {},
    [reactionsByPost]
  );

  const updateReaction = useCallback(
    (postId: string, { react, userIds }: Reaction) => {
      setReactionsByPost((currReactionsByPost) => ({
        ...currReactionsByPost,
        [postId]: {
          ...(currReactionsByPost[postId] ?? {}),
          [react]: userIds,
        },
      }));
    },
    []
  );

  const setReactions = useCallback((postId: string, reactions: Reaction[]) => {
    setReactionsByPost((currReactionsByPost) => ({
      ...currReactionsByPost,
      [postId]: Object.fromEntries(
        reactions.map(({ react, userIds }) => [react, userIds])
      ),
    }));
  }, []);

  return (
    <ReactionsContext.Provider
      value={{
        getReactions,
        updateReaction,
        setReactions,
      }}
    >
      {children}
    </ReactionsContext.Provider>
  );
}

export function useReactions(): ReactionsContextState {
  return useContext(ReactionsContext);
}
