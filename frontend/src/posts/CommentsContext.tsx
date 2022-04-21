import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Comment } from "wordle-friends-graphql";

type CommentsContextState = {
  getComments: (postId: string) => Comment[];
  addComment: (postId: string, comment: Comment) => void;
  setComments: (postId: string, comments: Comment[]) => void;
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

  const addComment = useCallback((postId: string, comment: Comment) => {
    setCommentsByPost((currCommentsByPost) => ({
      ...currCommentsByPost,
      [postId]: [...(currCommentsByPost[postId] ?? []), comment],
    }));
  }, []);

  const setComments = useCallback((postId: string, comments: Comment[]) => {
    setCommentsByPost((currCommentsByPost) => ({
      ...currCommentsByPost,
      [postId]: comments,
    }));
  }, []);

  return (
    <CommentsContext.Provider value={{ getComments, addComment, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments(): CommentsContextState {
  return useContext(CommentsContext);
}
