import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChangeEventHandler, useCallback, useState } from "react";
import { useCreatePost } from "../posts/api";
import { formatDateString } from "../utils/dates";
import { ParsedWordleResult } from "./ShareResultsForm";

type EnterGuessesFormProps = {
  parsedResult: ParsedWordleResult;
};

export default function EnterGuessesForm({
  parsedResult: { date, guessColors, guessSquares, isHardMode },
}: EnterGuessesFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createPost } = useCreatePost();
  const [guesses, setGuesses] = useState<string[]>(guessColors.map(() => ""));

  const onChange: (index: number) => ChangeEventHandler<HTMLInputElement> =
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

  const shareResults = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      createPost(
        {
          input: {
            colors: guessColors,
            isHardMode,
            puzzleDate: formatDateString(date),
            guesses,
          },
        },
        {
          onSettled: () => {
            setIsSubmitting(false);
          },
        }
      );
    },
    [createPost, date, guessColors, guesses, isHardMode]
  );

  return (
    <Stack as="form" onSubmit={shareResults}>
      <Flex justifyContent="space-between">
        <Text as="strong">{date.format("MMM D, YYYY")}</Text>
        <Text>{isHardMode && "Hard mode"}</Text>
      </Flex>

      {guesses.map((guess, guessIndex) => (
        <HStack key={guessIndex}>
          <InputGroup size="lg">
            <InputLeftAddon>{guessSquares[guessIndex]}</InputLeftAddon>
            <Input value={guess} onChange={onChange(guessIndex)} />
          </InputGroup>
        </HStack>
      ))}

      <Button
        type="submit"
        isDisabled={guesses.some((guess) => guess.length !== 5)}
        isLoading={isSubmitting}
        loadingText="Sharing"
      >
        Share
      </Button>
    </Stack>
  );
}
