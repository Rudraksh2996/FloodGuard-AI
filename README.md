# FloodGuard AI

An autonomous urban flood and waterlogging prediction system for DTU Environmental Hacks 2026 (Heat & Water track).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (Simulator Store)
- React Leaflet

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Project Structure
- \`app/(marketing)\`: The main landing page with Aceternity UI components.
- \`app/dashboard\`: The Municipal Command Center with a live map and dispatch queue.
- \`app/demo\`: A live mock of the AWS Rekognition pipeline.
- \`components/ui\`: Hand-implemented Aceternity-style UI components.
- \`store/simulator-store.ts\`: Zustand store containing the mock node data and simulation logic.

## Connecting Real AWS Services
The current implementation uses mocked data via a simulator store. To connect real AWS services:

1. Provide your AWS credentials in \`lib/aws-config.ts\`.
2. Implement the stubs in \`/api/analyze/route.ts\` to use \`@aws-sdk/client-rekognition\`.
3. Implement \`/api/dispatch/route.ts\` to use \`@aws-sdk/client-sns\` for real SMS alerts.
4. Replace the \`useNodes()\` hook (in \`hooks/use-nodes.ts\`) to poll an actual endpoint fetching live DynamoDB data instead of the simulator store.
