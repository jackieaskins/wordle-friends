import { useState } from "react";
import { useFormContext } from "react-hook-form";
import CheckboxField, { CheckboxFieldProps } from "./CheckboxField";

type BooleanStringCheckboxFieldProps = CheckboxFieldProps;

export default function BooleanStringCheckboxField(
  props: BooleanStringCheckboxFieldProps
): JSX.Element {
  const { watch } = useFormContext();
  const [defaultValue] = useState(watch(props.name) || "false");

  return (
    <CheckboxField
      {...props}
      defaultValue={defaultValue}
      transformValue={{
        input: (value) => value === "true",
        output: (e) => `${e.target.checked}`,
      }}
    />
  );
}
