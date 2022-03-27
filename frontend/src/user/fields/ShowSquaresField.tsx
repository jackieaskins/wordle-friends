import { Radio, Stack } from "@chakra-ui/react";
import { Color } from "wordle-friends-graphql";
import Squares from "../../common/Squares";
import RadioGroupField from "../../form/RadioGroupField";

type ShowSquaresFieldProps = {
  namePrefix?: string;
};

const BLANK_SQUARES = [
  [null, null, null, null, null],
  [null, null, null, null, null],
];
const SQUARES = [
  [Color.YELLOW, null, null, Color.GREEN, null],
  [Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN],
];
const SQUARE_SIZE = "20px";

export default function ShowSquaresField({
  namePrefix = "",
}: ShowSquaresFieldProps): JSX.Element {
  return (
    <RadioGroupField
      name={`${namePrefix}custom:showSquares`}
      label="Choose how to view your friends' posts before you've submitted"
      required
    >
      <Stack direction="row" justifyContent="space-around">
        <Radio value="true" aria-label="Show colors">
          <Squares squareSize={SQUARE_SIZE} colors={SQUARES} />
        </Radio>
        <Radio value="false" aria-label="Hide colors">
          <Squares squareSize={SQUARE_SIZE} colors={BLANK_SQUARES} />
        </Radio>
      </Stack>
    </RadioGroupField>
  );
}
