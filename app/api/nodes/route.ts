import { NextResponse } from "next/server";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient as docClient } from "@/lib/aws-config";

export async function GET() {
  try {
    const res = await docClient.send(new ScanCommand({
      TableName: process.env.DDB_TABLE!,
      FilterExpression: "SK = :sk",
      ExpressionAttributeValues: { ":sk": "METADATA" }
    }));
    return NextResponse.json({ success: true, nodes: res.Items }, { headers: { "X-Data-Source": "dynamodb" } });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nodeId, v_pooling, a_impedance, rain_rate } = body || {};
    const timestamp = Date.now();
    
    const fri = (v_pooling * 0.55) + (a_impedance * 0.35) + (rain_rate * 0.10);
    
    await docClient.send(new PutCommand({
      TableName: process.env.DDB_TABLE!,
      Item: {
        PK: `NODE#${nodeId || '4'}`,
        SK: `READING#${timestamp}`,
        v_pooling,
        a_impedance,
        rain_rate,
        fri,
        ttl: Math.floor(timestamp / 1000) + 86400 * 30
      }
    }));
    return NextResponse.json({ success: true, message: "Reading written", fri });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
