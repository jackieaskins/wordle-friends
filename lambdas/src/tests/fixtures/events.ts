import { AppSyncResolverEvent } from "aws-lambda";
import { AUTHORIZATION } from "../constants";

export function generateEvent<T, S = Record<string, any> | null>(
  eventArgs: T,
  source: S = {} as S
): AppSyncResolverEvent<T, S> {
  return {
    arguments: eventArgs,
    prev: null,
    stash: {},
    request: {
      headers: { authorization: AUTHORIZATION },
    },
    source,
    info: {
      fieldName: "fieldName",
      parentTypeName: "parentTypeName",
      variables: {},
      selectionSetList: [],
      selectionSetGraphQL: "",
    },
  };
}
