import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Square,
  Stack,
} from "@chakra-ui/react";
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { Color } from "wordle-friends-graphql";
import AutoResizeTextArea from "../form/AutoResizeTextArea";
import { useSquareColors } from "../utils/colors";

type EnterGuessesFormProps = {
  colors: (Color | null)[][];
  guessesState: [string[], Dispatch<SetStateAction<string[]>>];
  messageState: [string, Dispatch<SetStateAction<string>>];
};

export default function EnterGuessesFormFields({
  colors,
  guessesState,
  messageState,
}: EnterGuessesFormProps): JSX.Element {
  const { getBgColor } = useSquareColors();
  const [guesses, setGuesses] = guessesState;
  const [message, setMessage] = messageState;

  const onGuessChange: (index: number) => ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (index) =>
        ({ target: { value } }) => {
          setGuesses([
            ...guesses.slice(0, index),
            value
              .replace(/[^a-z]/gi, "")
              .substring(0, 5)
              .toUpperCase(),
            ...guesses.slice(index + 1),
          ]);
        },
      [guesses, setGuesses]
    );
  const onMessageChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    ({ target: { value } }) => {
      setMessage(value);
    },
    [setMessage]
  );

  return (
    <Stack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Guesses</FormLabel>
        <Center>
          <Stack>
            {guesses.map((guess, guessIndex) => (
              <Stack key={guessIndex} direction="row">
                <Stack direction="row" alignItems="center">
                  {colors[guessIndex].map((color, colorIndex) => (
                    <Square
                      key={colorIndex}
                      bg={getBgColor(color)}
                      size="20px"
                    />
                  ))}
                </Stack>

                <Input
                  onChange={onGuessChange(guessIndex)}
                  value={guess}
                  placeholder={`Enter guess ${guessIndex + 1}`}
                />
              </Stack>
            ))}
          </Stack>
        </Center>
      </FormControl>

      <FormControl>
        <FormLabel>Comment</FormLabel>
        <AutoResizeTextArea
          rows={1}
          onChange={onMessageChange}
          value={message}
          placeholder="Enter an optional comment"
        />
      </FormControl>
    </Stack>
  );
}
