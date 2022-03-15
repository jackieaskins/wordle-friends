import { AppSyncResolverEvent } from "aws-lambda";

export const AUTHORIZATION = "authorization";
export const PUZZLE_DATE = "2021-01-01";
export const ISO_STRING = "2021-01-01T00:00:00Z";
export const TIMESTAMPS = { createdAt: ISO_STRING, updatedAt: ISO_STRING };

export function generateEvent<T>(eventArgs: T): AppSyncResolverEvent<T> {
  return {
    arguments: eventArgs,
    prev: null,
    stash: {},
    request: {
      headers: { authorization: AUTHORIZATION },
    },
    source: null,
    info: {
      fieldName: "fieldName",
      parentTypeName: "parentTypeName",
      variables: {},
      selectionSetList: [],
      selectionSetGraphQL: "",
    },
  };
}
