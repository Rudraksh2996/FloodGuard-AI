import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { SNSClient } from "@aws-sdk/client-sns";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const STUB_MODE = false;

function getClientConfig() {
  const region = process.env.APP_AWS_REGION || process.env.AWS_REGION || "ap-south-1";
  
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return {
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };
  }
  
  return { region };
}

const config = getClientConfig();

export const rekognitionClient = new RekognitionClient(config);
export const snsClient = new SNSClient(config);
export const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient(config));

export const getCredentialSource = () => (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? "env-keys" : "default-chain";
