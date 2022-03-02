import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface InputFieldProps extends InputProps {
  helperText?: ReactNode;
  label?: string;
  name: string;
  registerOptions?: RegisterOptions;
  required: boolean;
}

export default function InputField({
  helperText,
  label,
  name,
  registerOptions,
  required,
  ...inputProps
}: InputFieldProps): JSX.Element {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  return (
    <FormControl isRequired={required} isInvalid={!!errors[name]} label={label}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        width="100%"
        id={name}
        {...inputProps}
        {...register(name, {
          ...(registerOptions ?? {}),
          required: required && `${label || name} is required`,
        })}
      />
      {helperText && !errors[name] && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {errors[name] && (
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
}
