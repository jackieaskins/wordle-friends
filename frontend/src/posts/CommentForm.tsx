import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  useBoolean,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import AutoResizeTextArea from "../form/AutoResizeTextArea";
import { useCreateComment } from "./api";

type CommentFormProps = {
  postId: string;
};

export default function CommentForm({ postId }: CommentFormProps): JSX.Element {
  const { mutate: createComment, error, isLoading } = useCreateComment();
  const [focused, setFocused] = useBoolean(false);
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      createComment(
        { input: { text, postId } },
        { onSuccess: () => setText("") }
      );
    },
    [createComment, postId, text]
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
        <Button type="submit" isFullWidth size="sm" disabled={!text}>
          Comment
        </Button>
      )}
    </Stack>
  );
}
