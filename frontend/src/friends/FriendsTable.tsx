import {
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { UseQueryResult } from "react-query";
import { Friend } from "../API";

type FriendsTableProps = {
  useFriendsQuery: () => UseQueryResult<Friend[]>;
  loadingNode: ReactNode;
  emptyNode: ReactNode;
  actions: (friendId: string) => ReactNode;
};

export default function FriendsTable({
  actions,
  emptyNode,
  loadingNode,
  useFriendsQuery,
}: FriendsTableProps): JSX.Element {
  const { isLoading, data: friends } = useFriendsQuery();
  const grayColor = useColorModeValue("gray.400", "whiteAlpha.300");

  return (
    <Table>
      <Tbody>
        {isLoading && (
          <Tr>
            <Td color={grayColor}>
              <Flex justifyContent="center" alignItems="center">
                <Spinner size="sm" />
                <Text ml={2}>{loadingNode}</Text>
              </Flex>
            </Td>
          </Tr>
        )}
        {!isLoading && !friends?.length && (
          <Tr>
            <Td color={grayColor} textAlign="center">
              {emptyNode}
            </Td>
          </Tr>
        )}
        {!isLoading &&
          friends?.map(({ userId: friendId, firstName, lastName }) => (
            <Tr key={friendId}>
              <Td>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text>
                    {firstName} {lastName}
                  </Text>
                  {actions(friendId)}
                </Flex>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}
