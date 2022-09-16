import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useController, useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from "./FormField";
import { getRegisterOptions } from "./utils";

export type CheckboxFieldProps = {
  transformValue?: {
    input: (value: string) => boolean;
    output: (e: ChangeEvent<HTMLInputElement>) => string;
  };
} & CheckboxProps &
  FormFieldProps;

export default function CheckboxField({
  children,
  transformValue,
  ...props
}: CheckboxFieldProps): JSX.Element {
  const {
    defaultValue,
    helperText,
    label,
    name,
    registerOptions,
    required,
    ...checkboxProps
  } = props;

  const { control } = useFormContext();
  const {
    field: { onChange, value, ...field },
  } = useController({
    name,
    control,
    rules: getRegisterOptions(registerOptions, required),
    defaultValue,
  });

  return (
    <FormField {...props}>
      <Checkbox
        id={name}
        {...checkboxProps}
        {...field}
        onChange={(e) => onChange(transformValue?.output(e) ?? e)}
        defaultChecked={transformValue?.input(value) ?? value}
        value={transformValue?.input(value) ?? value}
      >
        {children}
      </Checkbox>
    </FormField>
  );
}
