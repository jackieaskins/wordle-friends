import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  useBoolean,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import AutoResizeTextArea from "../form/AutoResizeTextArea";
import { PostWithComments, useCreateComment } from "./api";

type CommentFormProps = {
  post: PostWithComments;
};

export default function CommentForm({ post }: CommentFormProps): JSX.Element {
  const { mutate: createComment, error, isLoading } = useCreateComment(post);
  const [focused, setFocused] = useBoolean(false);
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      createComment(
        { input: { text, postId: post.id } },
        { onSuccess: () => setText("") }
      );
    },
    [createComment, post.id, text]
  );

  const handleChange = useCallback(({ target: { value } }) => {
    setText(value);
  }, []);

  return (
    <Stack as="form" onSubmit={handleSubmit} spacing={2}>
      <FormControl isDisabled={isLoading} isInvalid={!!error}>
        <AutoResizeTextArea
          placeholder="Add comment"
          onFocus={setFocused.on}
          onBlur={setFocused.off}
          size="sm"
          onChange={handleChange}
          value={text}
        />

        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>

      {(focused || text) && (
        <Button
          type="submit"
          isFullWidth
          size="sm"
          disabled={!text || isLoading}
          loadingText="Creating comment"
          isLoading={isLoading}
        >
          Comment
        </Button>
      )}
    </Stack>
  );
}
