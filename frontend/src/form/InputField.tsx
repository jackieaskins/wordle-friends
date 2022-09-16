import { Input, InputProps } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from "./FormField";
import { getRegisterOptions } from "./utils";

type InputFieldProps = InputProps & FormFieldProps;

export default function InputField(props: InputFieldProps): JSX.Element {
  const { helperText, label, name, registerOptions, required, ...inputProps } =
    props;
  const { register } = useFormContext();

  return (
    <FormField {...props}>
      <Input
        width="100%"
        id={name}
        {...inputProps}
        {...register(name, getRegisterOptions(registerOptions, required))}
      />
    </FormField>
  );
}
