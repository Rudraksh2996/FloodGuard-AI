// Stub for AWS configuration.
// In a real implementation, you would use:
// import { RekognitionClient } from "@aws-sdk/client-rekognition";
// import { SNSClient } from "@aws-sdk/client-sns";

export const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key',
  },
};

// export const rekognitionClient = new RekognitionClient(awsConfig);
// export const snsClient = new SNSClient(awsConfig);

export const STUB_MODE = true;
