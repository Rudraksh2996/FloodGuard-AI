import fs from 'fs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}));

async function run() {
  console.log("== 2. SEED ==");
  let res = await fetch("http://localhost:3000/api/seed");
  let data = await res.json();
  console.log("Seed response:", data);
  
  // Verify with SDK
  const qRes = await ddb.send(new QueryCommand({
    TableName: process.env.DDB_TABLE,
    IndexName: undefined,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": "NODE#4" } // just check one to see if it exists
  }));
  console.log("SDK Query for NODE#4:", qRes.Items?.map(i => i.SK));

  console.log("\n== 3. NODES ==");
  res = await fetch("http://localhost:3000/api/nodes");
  console.log("GET /api/nodes X-Data-Source header:", res.headers.get("x-data-source"));
  
  res = await fetch("http://localhost:3000/api/nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, v_pooling: 0.88, a_impedance: 0.85, rain_rate: 0.9 })
  });
  data = await res.json();
  console.log("POST /api/nodes response:", data);
  
  const qRes2 = await ddb.send(new QueryCommand({
    TableName: process.env.DDB_TABLE,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: { ":pk": "NODE#4", ":sk": "READING#" }
  }));
  console.log("SDK Query for NODE#4 READINGs:", qRes2.Items?.map(i => ({ SK: i.SK, ttl: i.ttl })));

  console.log("\n== 4. ANALYZE ==");
  // Generate a dummy 1x1 jpeg base64 just to test if Rekognition accepts it. 
  // Wait, Rekognition might reject a 1x1 image as too small.
  // We'll download a tiny placeholder image instead.
}
run();
