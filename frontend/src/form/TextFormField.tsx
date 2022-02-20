import { TextField, TextFieldProps } from "@mui/material";
import { RegisterOptions, useFormContext } from "react-hook-form";

type TextFormFieldProps = {
  name: string;
  registerOptions?: RegisterOptions;
} & TextFieldProps;

export default function TextFormField({
  helperText,
  label,
  name,
  registerOptions,
  required,
  ...textFieldProps
}: TextFormFieldProps): JSX.Element {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  return (
    <TextField
      required={required}
      label={label}
      fullWidth
      id={name}
      {...textFieldProps}
      {...register(name, {
        ...(registerOptions ?? {}),
        required: required && `${label || name} is required`,
      })}
      error={!!errors[name]}
      helperText={errors[name]?.message || helperText}
    />
  );
}
