import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DELHI_NODES } from "@/lib/mock-data";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    for (const node of DELHI_NODES) {
      await docClient.send(new PutCommand({
        TableName: process.env.DDB_TABLE!,
        Item: {
          PK: `NODE#${node.id}`,
          SK: `METADATA`,
          ...node
        }
      }));
    }
    return NextResponse.json({ success: true, message: "12 NODE# METADATA items exist" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
