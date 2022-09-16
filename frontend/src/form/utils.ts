import { RegisterOptions } from "react-hook-form";

export function getRegisterOptions(
  registerOptions: RegisterOptions | undefined,
  required: boolean
): RegisterOptions {
  return {
    ...(registerOptions ?? {}),
    required: required ? "Field is required" : false,
  };
}
