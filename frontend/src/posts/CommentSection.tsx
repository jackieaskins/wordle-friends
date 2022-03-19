import { Stack } from "@chakra-ui/react";
import { PostWithComments } from "./api";
import CommentForm from "./CommentForm";
import RevealedComment from "./RevealedComment";

type CommentSectionProps = {
  post: PostWithComments;
};

export default function CommentSection({
  post,
}: CommentSectionProps): JSX.Element {
  return (
    <Stack mx={2} my={4} spacing={3}>
      {post.comments.map((comment, index) => (
        <RevealedComment
          key={comment.id}
          comment={comment}
          divider={index !== post.comments.length - 1}
        />
      ))}

      <CommentForm post={post} />
    </Stack>
  );
}
