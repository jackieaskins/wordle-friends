import { RadioGroup, RadioGroupProps } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from "./FormField";
import { getRegisterOptions } from "./utils";

type RadioGroupFieldProps = RadioGroupProps & FormFieldProps;

export default function RadioGroupField({
  children,
  ...props
}: RadioGroupFieldProps): JSX.Element {
  const {
    helperText,
    label,
    name,
    registerOptions,
    required,
    ...radioGroupProps
  } = props;
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
    rules: getRegisterOptions(registerOptions, required),
  });

  return (
    <FormField {...props}>
      <RadioGroup width="100%" id={name} {...radioGroupProps} {...field}>
        {children}
      </RadioGroup>
    </FormField>
  );
}
