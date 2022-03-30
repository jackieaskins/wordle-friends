import { AppSyncResolverEvent } from "aws-lambda";
import { AUTHORIZATION } from "../constants";

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
