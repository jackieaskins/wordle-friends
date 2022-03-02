import { useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator";
import { useGetCurrentUserPost } from "./api";
import EnterGuessesForm from "./EnterGuessesForm";
import RevealedPost from "./RevealedPost";
import ShareResultsForm, { ParsedWordleResult } from "./ShareResultsForm";

export default function UserPostSection(): JSX.Element {
  const [parsedResult, setParsedResult] = useState<ParsedWordleResult | null>(
    null
  );
  const { isLoading, data: post } = useGetCurrentUserPost();

  if (isLoading)
    return <LoadingIndicator>{"Loading today's result"}</LoadingIndicator>;
  if (post) return <RevealedPost post={post} />;
  if (parsedResult) return <EnterGuessesForm parsedResult={parsedResult} />;
  return <ShareResultsForm setParsedResult={setParsedResult} />;
}
