import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { RegisterOptions, useFormState } from "react-hook-form";

export type FormFieldProps = {
  helperText?: ReactNode;
  label?: string;
  name: string;
  registerOptions?: RegisterOptions;
  required: boolean;
};

export default function FormField({
  children,
  helperText,
  label,
  name,
  required,
}: { children: ReactNode } & FormFieldProps): JSX.Element {
  const { errors } = useFormState();

  const error = name
    .split(".")
    .reduce((parent, namePart) => parent?.[namePart], errors);

  return (
    <FormControl isRequired={required} isInvalid={!!error} label={label}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {children}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
