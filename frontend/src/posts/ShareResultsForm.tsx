import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { parseInt } from "lodash";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Color } from "../API";
import { formatDateString } from "../utils/dates";

export type ParsedWordleResult = {
  isHardMode: boolean;
  date: Dayjs;
  guessColors: (Color | null)[][];
  guessSquares: string[];
};

type ShareResultsFormProps = {
  setParsedResult: (parsedResult: ParsedWordleResult) => void;
};

function parseWordleResult(wordleResult: string): {
  details: string;
  guesses: string[];
} {
  const [details, ...guesses] = wordleResult
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !!line);

  return { details, guesses };
}

function getPuzzleDate(details: string): Dayjs {
  const [, puzzleNum] = details.split(" ");
  return dayjs("2021-06-19").add(parseInt(puzzleNum), "day");
}

export default function ShareResultsForm({
  setParsedResult,
}: ShareResultsFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValidating },
    watch,
  } = useForm();

  const parse = useCallback(
    ({ wordleResult }) => {
      const { details, guesses } = parseWordleResult(wordleResult);

      setParsedResult({
        isHardMode: details.endsWith("*"),
        guessSquares: guesses,
        guessColors: guesses.map((guess) =>
          guess
            .split("")
            .filter((square) => square.toLowerCase() !== "\ud83d")
            .map((square) => {
              switch (square.toLowerCase()) {
                case "🟩":
                case "\udfe9":
                  return Color.GREEN;
                case "🟨":
                case "\udfe8":
                  return Color.YELLOW;
                default:
                  return null;
              }
            })
        ),
        date: getPuzzleDate(details),
      });
    },
    [setParsedResult]
  );

  return (
    <Stack width="100%" spacing={4} as="form" onSubmit={handleSubmit(parse)}>
      <FormControl isInvalid={!!errors.wordleResult}>
        <Textarea
          rows={Math.min(
            9,
            Math.max(3, watch("wordleResult")?.split("\n").length ?? 0)
          )}
          placeholder="Paste your Wordle share result"
          {...register("wordleResult", {
            required: "No content provided",
            validate: (value: string) => {
              try {
                const { details, guesses } = parseWordleResult(value);

                if (!details.match(/^Wordle \d+ \d\/6\*?$/)) {
                  return "Invalid Wordle details line";
                }

                if (
                  !guesses.every((guess) => guess.match(/^(🟩|🟨|⬜|⬛){5}$/))
                ) {
                  return "Invalid guesses";
                }

                if (
                  formatDateString(dayjs()) !==
                  formatDateString(getPuzzleDate(details))
                ) {
                  return "Puzzle is not from today";
                }

                return true;
              } catch (e) {
                return "Invalid Wordle result";
              }
            },
          })}
        />
        <FormErrorMessage>{errors.wordleResult?.message}</FormErrorMessage>
      </FormControl>

      <Button
        isFullWidth
        loadingText="Validating results"
        type="submit"
        isDisabled={!isDirty}
        isLoading={isValidating || isSubmitting}
      >
        Parse results
      </Button>
    </Stack>
  );
}
