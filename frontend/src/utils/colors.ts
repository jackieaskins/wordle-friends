import { useColorModeValue } from "@chakra-ui/react";

export function useSecondaryTextColor(): string {
  return useColorModeValue("gray.500", "whiteAlpha.400");
}
