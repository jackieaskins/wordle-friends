import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API, graphqlOperation } from "aws-amplify";

export async function callGraphql<V, R>(
  query: string,
  variables?: V
): Promise<GraphQLResult<R>> {
  return (await API.graphql(
    graphqlOperation(query, variables)
  )) as GraphQLResult<R>;
}
