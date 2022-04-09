import {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { Comment } from "wordle-friends-graphql";

type CommentsContextState = {
  getComments: (postId: string) => Comment[];
  setComments: (postId: string, updater: SetStateAction<Comment[]>) => void;
};

const CommentsContext = createContext<CommentsContextState>(
  {} as CommentsContextState
);

export function CommentsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, Comment[]>
  >({});

  const getComments = useCallback(
    (postId: string) => commentsByPost[postId] ?? [],
    [commentsByPost]
  );
  const setComments = useCallback(
    (postId: string, updater: SetStateAction<Comment[]>) => {
      setCommentsByPost((currCommentsByPost) => {
        const comments =
          typeof updater == "function"
            ? updater(currCommentsByPost[postId] ?? [])
            : updater;
        return { ...currCommentsByPost, [postId]: comments };
      });
    },
    []
  );

  return (
    <CommentsContext.Provider value={{ getComments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments(): CommentsContextState {
  return useContext(CommentsContext);
}
