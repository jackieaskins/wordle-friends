import { Button } from "@chakra-ui/react";
import { FormEventHandler, useCallback, useState } from "react";
import { formatDateString } from "../utils/dates";
import { useCreatePost } from "./api";
import EnterGuessesFormFields from "./EnterGuessesFormFields";
import { ParsedWordleResult } from "./ShareResultsForm";

type EnterGuessesSectionProps = {
  parsedResult: ParsedWordleResult;
};

export default function EnterGuessesForm({
  parsedResult,
}: EnterGuessesSectionProps): JSX.Element {
  const { mutate: createPost, isLoading } = useCreatePost();

  const guessesState = useState<string[]>(parsedResult.colors.map(() => ""));
  const [guesses] = guessesState;
  const messageState = useState<string>("");
  const [message] = messageState;

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();

      const { colors, date, isHardMode } = parsedResult;

      createPost({
        input: {
          colors,
          isHardMode,
          puzzleDate: formatDateString(date),
          message,
          guesses,
        },
      });
    },
    [createPost, guesses, message, parsedResult]
  );

  return (
    <form onSubmit={handleSubmit}>
      <EnterGuessesFormFields
        {...parsedResult}
        guessesState={guessesState}
        messageState={messageState}
      />

      <Button
        type="submit"
        width="100%"
        isDisabled={guesses.some((guess) => guess.length !== 5)}
        isLoading={isLoading}
        loadingText="Sharing"
        mt={6}
      >
        Share
      </Button>
    </form>
  );
}
