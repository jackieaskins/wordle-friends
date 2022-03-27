import { Stack } from "@chakra-ui/react";
import BooleanStringCheckboxField from "../../form/BooleanStringCheckboxField";

type NotificationFieldsProps = {
  showHelperText?: boolean;
  namePrefix?: string;
};

const FIELDS = [
  {
    name: "custom:notifyOnFriendPost",
    text: "A friend shares their Wordle post",
    label: "Send me an email when:",
  },
  {
    name: "custom:notifyOnPostComment",
    text: "Someone comments on my Wordle post",
  },
  {
    name: "custom:notifyOnCommentReply",
    text: "Someone comments on a post I've commented on",
    helperText:
      "Email notifications can be disabled at any time from your preferences page.",
  },
];

export default function NotificationFields({
  namePrefix = "",
  showHelperText = true,
}: NotificationFieldsProps): JSX.Element {
  return (
    <Stack>
      {FIELDS.map(({ helperText, label, name, text }) => (
        <BooleanStringCheckboxField
          key={name}
          name={`${namePrefix}${name}`}
          label={label}
          helperText={showHelperText ? helperText : null}
          required={false}
        >
          {text}
        </BooleanStringCheckboxField>
      ))}
    </Stack>
  );
}
