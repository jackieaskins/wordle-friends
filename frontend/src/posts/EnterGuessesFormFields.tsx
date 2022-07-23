import {
  Center,
  FormControl,
  FormLabel,
  PinInput,
  PinInputField,
  Stack,
  useColorModeValue,
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
  const { getFgColor, getBgColor } = useSquareColors();
  const focusBorderColor = useColorModeValue("gray.300", "white");
  const [guesses, setGuesses] = guessesState;
  const [message, setMessage] = messageState;

  const onGuessChange: (index: number) => (value: string) => void = useCallback(
    (index) => (value) => {
      setGuesses([
        ...guesses.slice(0, index),
        value.replace(/[^a-z]/gi, "").substring(0, 5),
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
                <PinInput
                  type="alphanumeric"
                  onChange={onGuessChange(guessIndex)}
                  focusBorderColor={focusBorderColor}
                  value={guess.toUpperCase()}
                  variant="flushed"
                >
                  {colors[guessIndex].map((color, colorIndex) => (
                    <PinInputField
                      key={colorIndex}
                      fontWeight="bold"
                      borderWidth={0}
                      background={getBgColor(color)}
                      color={getFgColor(color)}
                      _focus={{ caretColor: getFgColor(color) }}
                      _placeholder={{ color: getFgColor(color), opacity: 0.8 }}
                    />
                  ))}
                </PinInput>
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
