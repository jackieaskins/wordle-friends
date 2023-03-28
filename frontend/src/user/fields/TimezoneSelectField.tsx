import timezones from "timezones-list";
import SingleSelectField from "../../form/SingleSelectField";

type TimezoneSelectFieldProps = {
  namePrefix?: string;
};

const timezoneOptions = timezones
  .map(({ label, tzCode }) => ({
    label,
    value: tzCode,
  }))
  .sort(({ label: labelA }, { label: labelB }) => labelA.localeCompare(labelB));

export default function TimezoneSelectField({
  namePrefix = "",
}: TimezoneSelectFieldProps): JSX.Element {
  return (
    <SingleSelectField
      name={`${namePrefix}custom:timezone`}
      label="Timezone"
      helperText="Timezone is used for sending daily post reminders."
      required={false}
      isClearable
      isSearchable
      options={timezoneOptions}
    />
  );
}
