import { NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const sns = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nodeId, nodeName, fri, drainStatus, action } = body;
    
    if (fri < 0.86) {
      return NextResponse.json({ success: false, error: "FRI below critical threshold" }, { status: 400 });
    }

    const now = Date.now();
    const getRes = await ddb.send(new GetCommand({
      TableName: process.env.DDB_TABLE!,
      Key: { PK: `ALERT#${nodeId}`, SK: "COOLDOWN" }
    }));
    
    if (getRes.Item && getRes.Item.ttl > Math.floor(now / 1000)) {
      return NextResponse.json({ 
        success: false, 
        error: "Cooldown active",
        remainingSeconds: getRes.Item.ttl - Math.floor(now / 1000)
      }, { status: 429 });
    }

    const message = `[CRITICAL ALERT - FLOODGUARD AI]\nNode: #${nodeId} (${nodeName})\nRisk Score: ${fri} | Drain Status: ${drainStatus}\nRec. Action: ${action}`;

    const snsRes = await sns.send(new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN!,
      Message: message,
      Subject: `FloodGuard Alert: Node ${nodeId}`
    }));

    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [process.env.DDB_TABLE!]: [
          {
            PutRequest: {
              Item: {
                PK: `ALERT#${nodeId}`,
                SK: "COOLDOWN",
                ttl: Math.floor(now / 1000) + 15 * 60
              }
            }
          },
          {
            PutRequest: {
              Item: {
                PK: `ALERT#${nodeId}`,
                SK: `STATUS#${now}`,
                messageId: snsRes.MessageId,
                fri
              }
            }
          }
        ]
      }
    }));

    return NextResponse.json({ success: true, messageId: snsRes.MessageId });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
