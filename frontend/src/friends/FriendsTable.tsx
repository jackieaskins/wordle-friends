import {
  Center,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { UseQueryResult } from "react-query";
import { Friend } from "wordle-friends-graphql";
import LoadingIndicator from "../common/LoadingIndicator";
import UserName from "../common/UserName";

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
              <Center>
                <LoadingIndicator>{loadingNode}</LoadingIndicator>
              </Center>
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
          friends?.map(({ friendId, friend }) => (
            <Tr key={friendId}>
              <Td>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text>
                    <UserName user={friend} userId={friendId} />
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
