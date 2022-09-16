import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  RegisterOptions,
  useFormState,
} from "react-hook-form";

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

  const error: FieldError | undefined = name
    .split(".")
    .reduce(
      (parent, namePart) => parent?.[namePart] as FieldErrorsImpl,
      errors
    ) as unknown as FieldError | undefined;

  return (
    <FormControl isRequired={required} isInvalid={!!error} label={label}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {children}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
