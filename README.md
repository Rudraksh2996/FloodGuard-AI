# FloodGuard AI

FloodGuard AI is an autonomous urban flood and waterlogging prediction system designed for the DTU Environmental Hacks 2026 hackathon (Heat & Water track). The system combines live sensor data simulation with real AWS integrations for computer vision and dispatch notifications.

## Architecture

**Simulated Components:**
- Kinesis Ingestion: Sensor data points are simulated locally in the frontend (`store/simulator-store.ts`).
- SageMaker Acoustic Scoring: Drain impedance and acoustic statuses (e.g. "Severe Choke (850Hz Gurgle)") are dynamically generated.

**Real AWS Integrations:**
- **Amazon Rekognition**: Uploaded CCTV images are analyzed in real-time (`/api/analyze`) to detect flooding, water, and pooling instances.
- **Amazon SNS**: Triggers dispatch SMS notifications for critical units (`/api/dispatch`).
- **Amazon DynamoDB**: Stores live node telemetry, alert cooldown statuses to prevent spam, and system metadata.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add the following keys (do **not** commit values):
   ```
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   SNS_TOPIC_ARN=
   DDB_TABLE=
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## AWS Resources to Create

Before running the application, you must provision the following resources in AWS:

1. **DynamoDB Table**: Create a table named `FloodGuardState` with a string Partition Key (`PK`) and a string Sort Key (`SK`). Enable Time to Live (TTL) on the attribute `ttl`.
2. **SNS Topic**: Create a standard SNS topic (e.g., `FloodGuardAlertTopic`) and subscribe your phone number or email to it.
3. **Rekognition**: No separate resource needed, but ensure your IAM user has `rekognition:DetectLabels` permissions.

### Recommended IAM Policy

Attach the following policy to the IAM user (replace `YOUR_ACCOUNT_ID` with your actual 12-digit AWS account ID):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:DescribeTable"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/FloodGuardState",
                "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/FloodGuardState/index/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "sns:GetTopicAttributes"
            ],
            "Resource": "arn:aws:sns:ap-south-1:YOUR_ACCOUNT_ID:FloodGuardAlertTopic"
        },
        {
            "Effect": "Allow",
            "Action": [
                "rekognition:DetectLabels"
            ],
            "Resource": "*"
        }
    ]
}
```

## Seeding Data

Before using the application for the first time, you must seed the initial DynamoDB metadata. With the app running, simply visit or hit:
\`GET http://localhost:3000/api/seed\`

## API Route Reference

- \`GET /api/seed\`: Seeds initial node data to DynamoDB.
- \`GET /api/nodes\`: Retrieves the list of nodes from DynamoDB.
- \`POST /api/nodes\`: Writes a new reading telemetry point to a specific node (with 30-day TTL).
- \`POST /api/analyze\`: Submits a base64 encoded image to Rekognition, returns tags and a calculated pooling score.
- \`POST /api/dispatch\`: Triggers an SNS alert for a specific node if the FRI is critical, and engages a 15-minute cooldown via DynamoDB to prevent duplicate dispatches.

## AWS Amplify Deployment

This project is configured for **AWS Amplify Hosting (Next.js SSR)** using an IAM compute role.

1. **Environment Variables**: Add these 3 environment variables in the Amplify console:
   - `APP_AWS_REGION` (e.g. `ap-south-1`)
   - `SNS_TOPIC_ARN`
   - `DDB_TABLE`
   *(Do NOT add `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in production. The app uses the Amplify compute role.)*

2. **IAM Compute Role**: Ensure your Amplify App is assigned a Service Role (Compute Role) with the IAM policy listed above (with your AWS Account ID).

3. **Verify Deployment**: Once deployed, visit `https://<your-amplify-domain>/api/health` to confirm the environment variables are set, credentials are using `default-chain`, and live connectivity to DynamoDB and SNS is `OK`.

## Android App

FloodGuard AI includes a native Android app wrapper built with [Capacitor](https://capacitorjs.com/). Since the app acts as a native shell loading the live, deployed website, any future updates to the web interface or API will automatically reflect in the app without requiring an APK rebuild!

### Prerequisites
- **Node.js** (v18+)
- **JDK 17**
- **Android SDK** (usually installed via Android Studio)

### How to Rebuild the APK
1. Ensure your dependencies are synced: `npm run android:sync`
2. Build the Debug APK: `npm run android:build`
3. The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Installation
Copy the generated APK to your Android device and install it, or drag and drop it into a running Android Emulator.

*(Note: Make sure your device allows installing from unknown sources. No environment secrets are bundled into the APK; it is entirely safe and connects securely to the live server.)*
