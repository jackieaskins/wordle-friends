import { Text, TextProps } from "@chakra-ui/react";

export default function NewLineText(props: TextProps): JSX.Element {
  return <Text {...props} whiteSpace="pre-line" />;
}
