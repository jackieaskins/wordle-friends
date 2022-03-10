import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useCreateComment } from "./api";

type CommentFormProps = {
  postId: string;
};

export default function CommentForm({ postId }: CommentFormProps): JSX.Element {
  const { mutate: createComment, error, isLoading } = useCreateComment();
  const [text, setText] = useState("");

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && text) {
        createComment(
          { input: { text, postId } },
          {
            onSuccess: () => setText(""),
          }
        );
      }
    },
    [createComment, postId, text]
  );

  const handleChange = useCallback(({ target: { value } }) => {
    setText(value);
  }, []);

  return (
    <FormControl isDisabled={isLoading} isInvalid={!!error}>
      <Input
        placeholder="Add comment"
        onKeyPress={handleKeyPress}
        size="sm"
        onChange={handleChange}
        value={text}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
