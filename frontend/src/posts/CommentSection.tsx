import { Stack } from "@chakra-ui/react";
import CommentForm from "./CommentForm";
import { useComments } from "./CommentsContext";
import RevealedComment from "./RevealedComment";

type CommentSectionProps = {
  postId: string;
};

export default function CommentSection({
  postId,
}: CommentSectionProps): JSX.Element {
  const { getComments } = useComments();

  const comments = getComments(postId);

  return (
    <Stack mx={2} my={4} spacing={3}>
      {comments.map((comment, index) => (
        <RevealedComment
          key={comment.id}
          comment={comment}
          divider={index !== comments.length - 1}
        />
      ))}

      <CommentForm postId={postId} />
    </Stack>
  );
}
