import { Textarea, TextareaProps } from "@chakra-ui/react";
import { ForwardedRef, forwardRef } from "react";
import ResizeTextarea from "react-textarea-autosize";

function AutoResizeTextarea(
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <Textarea
      minHeight="unset"
      overflow="hidden"
      width="100%"
      resize="none"
      ref={ref}
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  );
}

export default forwardRef<HTMLTextAreaElement, TextareaProps>(
  AutoResizeTextarea
);
