import { Flex, Spinner } from "@chakra-ui/react";
import { ReactNode } from "react";

type LoadingIndicatorProps = {
  children: ReactNode;
};

export default function LoadingIndicator({
  children,
}: LoadingIndicatorProps): JSX.Element {
  return (
    <Flex alignItems="center">
      <Spinner mr={2} size="sm" />
      {children}
    </Flex>
  );
}
