import { useState } from "react";
import { PostWithComments } from "./api";
import EnterGuessesForm from "./EnterGuessesForm";
import RevealedPost from "./RevealedPost";
import ShareResultsForm, { ParsedWordleResult } from "./ShareResultsForm";

export type UserPostSectionProps = {
  currentUserPost: PostWithComments | null | undefined;
};

export default function UserPostSection({
  currentUserPost,
}: UserPostSectionProps): JSX.Element {
  const [parsedResult, setParsedResult] = useState<ParsedWordleResult | null>(
    null
  );

  if (currentUserPost)
    return (
      <RevealedPost currentUserPost={currentUserPost} post={currentUserPost} />
    );
  if (parsedResult) return <EnterGuessesForm parsedResult={parsedResult} />;
  return <ShareResultsForm setParsedResult={setParsedResult} />;
}
