import { NextResponse } from 'next/server';
import { dynamoDbClient, snsClient, getCredentialSource } from '@/lib/aws-config';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { GetTopicAttributesCommand } from '@aws-sdk/client-sns';

export async function GET() {
  const ddbTable = process.env.DDB_TABLE;
  const snsTopic = process.env.SNS_TOPIC_ARN;
  const appAwsRegion = process.env.APP_AWS_REGION;

  const envVars = {
    DDB_TABLE: !!ddbTable,
    SNS_TOPIC_ARN: !!snsTopic,
    APP_AWS_REGION: !!appAwsRegion,
  };

  const credentialSource = getCredentialSource();

  let ddbStatus = 'SKIPPED';
  if (ddbTable) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      await dynamoDbClient.send(
        new DescribeTableCommand({ TableName: ddbTable }),
        { abortSignal: controller.signal }
      );
      clearTimeout(id);
      ddbStatus = 'OK';
    } catch (err: unknown) {
      ddbStatus = (err as Error).name || 'Error';
    }
  }

  let snsStatus = 'SKIPPED';
  if (snsTopic) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      await snsClient.send(
        new GetTopicAttributesCommand({ TopicArn: snsTopic }),
        { abortSignal: controller.signal }
      );
      clearTimeout(id);
      snsStatus = 'OK';
    } catch (err: unknown) {
      snsStatus = (err as Error).name || 'Error';
    }
  }

  return NextResponse.json({
    envVars,
    credentialSource,
    liveChecks: {
      dynamoDb: ddbStatus,
      sns: snsStatus,
    }
  });
}
