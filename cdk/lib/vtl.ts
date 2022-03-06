export function getUserRequest(sourceKey: string): string {
  return `
{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.source.${sourceKey})
  }
}
  `;
}
