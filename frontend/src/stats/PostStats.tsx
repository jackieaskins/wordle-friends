import {
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Color, MinimalPost } from "wordle-friends-graphql";

type PostStatsProps = {
  posts: MinimalPost[];
};

export default function PostStats({ posts }: PostStatsProps): JSX.Element {
  const stats = useMemo(() => {
    const sorted = posts
      .map((post) => {
        const { colors } = post;
        const isCompleted =
          colors.length < 6 ||
          colors[5].every((color) => color === Color.GREEN);
        const result = isCompleted ? colors.length : "DNF";

        return {
          ...post,
          __isCompleted: isCompleted,
          __result: result,
        };
      })
      .sort((a, b) => {
        if (!a.__isCompleted) return 1;
        if (!b.__isCompleted) return -1;
        return a.colors.length - b.colors.length;
      });

    const getStat = (label: "Worst" | "Best") => {
      const { __result: stat } =
        label === "Best" ? sorted[0] : sorted[sorted.length - 1];
      const matches = sorted
        .filter(({ __result }) => __result === stat)
        .map(({ puzzleDate }) => dayjs(puzzleDate).format("MMM D"));

      return {
        label,
        stat,
        helpText: matches.length == 1 ? matches[0] : `${matches.length} days`,
      };
    };

    const average =
      posts
        .map(({ colors }) => colors.length)
        .reduce((sum, len) => sum + len, 0) / posts.length;

    return [
      {
        label: "Average",
        stat: Number.isInteger(average) ? average : average.toFixed(2),
        helpText: `${posts.length} day${posts?.length === 1 ? "" : "s"} played`,
      },
      getStat("Best"),
      getStat("Worst"),
    ];
  }, [posts]);

  return (
    <StatGroup>
      {stats.map(({ label, stat, helpText }) => (
        <Stat
          key={label}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <StatLabel>{label}</StatLabel>
          <StatNumber>{stat}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Stat>
      ))}
    </StatGroup>
  );
}
