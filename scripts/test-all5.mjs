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
  console.log("== 3. SEED ==");
  let res = await fetch("http://localhost:3000/api/seed");
  console.log("Seed response:", await res.text());
  
  // Verify with SDK
  let qRes = await ddb.send(new QueryCommand({
    TableName: process.env.DDB_TABLE,
    IndexName: undefined,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": "NODE#4" }
  }));
  console.log("SDK Query for NODE#4:", qRes.Items?.map(i => i.SK));
  
  let allNodes = 0;
  for (let i = 1; i <= 12; i++) {
    let id = i === 4 ? "4" : `node-${i}`;
    let res = await ddb.send(new QueryCommand({ TableName: process.env.DDB_TABLE, KeyConditionExpression: "PK = :pk", ExpressionAttributeValues: { ":pk": `NODE#${id}` } }));
    if (res.Items?.find(item => item.SK === "METADATA")) allNodes++;
  }
  console.log("Total NODE# METADATA items:", allNodes);

  console.log("\n== 3. NODES ==");
  res = await fetch("http://localhost:3000/api/nodes");
  console.log("GET /api/nodes X-Data-Source header:", res.headers.get("x-data-source"));
  
  res = await fetch("http://localhost:3000/api/nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, v_pooling: 0.88, a_impedance: 0.85, rain_rate: 0.9 })
  });
  console.log("POST /api/nodes response:", await res.text());
  
  qRes = await ddb.send(new QueryCommand({
    TableName: process.env.DDB_TABLE,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: { ":pk": "NODE#4", ":sk": "READING#" }
  }));
  console.log("SDK Query for NODE#4 READINGs:", qRes.Items?.slice(-1).map(i => ({ SK: i.SK, ttl: i.ttl, fri: i.fri })));

  console.log("\n== 4. ANALYZE ==");
  const imgBuffer = fs.readFileSync('test-image.jpg');
  const imgBase64 = imgBuffer.toString('base64');
  
  res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: imgBase64 })
  });
  console.log("Analyze POST response:", JSON.stringify(await res.json()).substring(0, 300));
  
  res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: "not_an_image" })
  });
  console.log("Analyze POST non-image (Status " + res.status + "):", await res.text());

  console.log("\n== 5. DISPATCH ==");
  res = await fetch("http://localhost:3000/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, nodeName: "DTU Main Gate", fri: 0.92, drainStatus: "Choke", action: "Dispatch" })
  });
  console.log("Dispatch response 1 (Status " + res.status + "):", await res.text());

  res = await fetch("http://localhost:3000/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, nodeName: "DTU Main Gate", fri: 0.92, drainStatus: "Choke", action: "Dispatch" })
  });
  console.log("Dispatch response 2 (Status " + res.status + "):", await res.text());

  res = await fetch("http://localhost:3000/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, nodeName: "DTU Main Gate", fri: 0.50, drainStatus: "Choke", action: "Dispatch" })
  });
  console.log("Dispatch response 3 - low FRI (Status " + res.status + "):", await res.text());

  qRes = await ddb.send(new QueryCommand({
    TableName: process.env.DDB_TABLE,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": "ALERT#4" }
  }));
  console.log("SDK Query for ALERT#4:", qRes.Items?.map(i => i.SK));
}
run();
