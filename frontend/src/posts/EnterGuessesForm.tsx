import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChangeEventHandler, useCallback, useState } from "react";
import AutoResizeTextArea from "../form/AutoResizeTextArea";
import { useCreatePost } from "../posts/api";
import { formatDateString } from "../utils/dates";
import { ParsedWordleResult } from "./ShareResultsForm";

type EnterGuessesFormProps = {
  parsedResult: ParsedWordleResult;
};

export default function EnterGuessesForm({
  parsedResult: { date, guessColors, guessSquares, isHardMode },
}: EnterGuessesFormProps): JSX.Element {
  const { mutate: createPost, isLoading } = useCreatePost();
  const [guesses, setGuesses] = useState<string[]>(guessColors.map(() => ""));
  const [message, setMessage] = useState("");

  const onGuessChange: (index: number) => ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (index) =>
        ({ target: { value } }) => {
          setGuesses([
            ...guesses.slice(0, index),
            value.replace(/[^a-z]/gi, "").substring(0, 5),
            ...guesses.slice(index + 1),
          ]);
        },
      [guesses]
    );
  const onMessageChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    ({ target: { value } }) => {
      setMessage(value);
    },
    []
  );

  const shareResults: React.FormEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      createPost({
        input: {
          colors: guessColors,
          isHardMode,
          puzzleDate: formatDateString(date),
          message: message || undefined,
          guesses,
        },
      });
    },
    [createPost, date, guessColors, guesses, isHardMode, message]
  );

  return (
    <Stack as="form" onSubmit={shareResults}>
      <Text as="strong">{isHardMode && "Hard mode"}</Text>

      <FormControl>
        <FormLabel>Comment</FormLabel>
        <AutoResizeTextArea
          rows={1}
          onChange={onMessageChange}
          value={message}
          placeholder="Enter an optional comment"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Guesses</FormLabel>
        <Stack spacing={1}>
          {guesses.map((guess, guessIndex) => (
            <HStack
              key={guessIndex}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box whiteSpace="nowrap">{guessSquares[guessIndex]}</Box>
              <Input
                value={guess}
                onChange={onGuessChange(guessIndex)}
                placeholder={`Enter guess ${guessIndex + 1}`}
              />
            </HStack>
          ))}
        </Stack>
      </FormControl>

      <Button
        type="submit"
        isDisabled={guesses.some((guess) => guess.length !== 5)}
        isLoading={isLoading}
        loadingText="Sharing"
      >
        Share
      </Button>
    </Stack>
  );
}
