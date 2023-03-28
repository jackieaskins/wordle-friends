import { Props, Select, SingleValue } from "chakra-react-select";
import { useController, useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from "./FormField";
import { getRegisterOptions } from "./utils";

type Option = { label: string; value: string };
type SingleSelectFieldProps = Props<Option, false> & FormFieldProps;

export default function SingleSelectField(
  props: SingleSelectFieldProps
): JSX.Element {
  const { control } = useFormContext();
  const {
    helperText,
    label,
    name,
    registerOptions,
    required,
    options,
    ...selectProps
  } = props;
  const {
    field: { onChange, value, ...field },
  } = useController({
    name,
    control,
    rules: getRegisterOptions(registerOptions, required),
  });

  return (
    <FormField {...props}>
      <Select<Option, false>
        id={name}
        options={options}
        {...selectProps}
        {...field}
        onChange={(option) => onChange(option?.value ?? "")}
        value={
          options?.find((option) => (option as Option).value === value) as
            | SingleValue<Option>
            | undefined
        }
      />
    </FormField>
  );
}
