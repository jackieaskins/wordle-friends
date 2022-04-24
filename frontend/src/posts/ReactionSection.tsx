import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { RefType } from "wordle-friends-graphql";
import ReactionButton from "./ReactionButton";
import { useReactions } from "./ReactionsContext";

export type ReactionType =
  | ":heart:"
  | ":+1:"
  | ":-1:"
  | ":joy:"
  | ":cry:"
  | ":flush:";
const reactionTypes: ReactionType[] = [
  ":heart:",
  ":+1:",
  ":-1:",
  ":joy:",
  ":cry:",
  ":flush:",
];
type ReactionSectionProps = {
  refType: RefType;
  refId: string;
};

export default function ReactionSection({
  refType,
  refId,
}: ReactionSectionProps): JSX.Element {
  const { getReactions } = useReactions();
  const userIdsByReact = getReactions(refId);

  const [sortedReactionTypes] = useState(
    [...reactionTypes].sort((a, b) => {
      const aUserIds = userIdsByReact[a];
      const bUserIds = userIdsByReact[b];

      if (!aUserIds) {
        return 1;
      }
      if (!bUserIds) {
        return -1;
      }

      return bUserIds.length - aUserIds.length;
    })
  );

  return (
    <Flex justifyContent="space-around" my={2}>
      {sortedReactionTypes.map((react) => (
        <ReactionButton
          key={react}
          refType={refType}
          refId={refId}
          react={react}
          userIds={userIdsByReact[react] ?? []}
        />
      ))}
    </Flex>
  );
}
