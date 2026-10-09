import { NextResponse } from "next/server";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    const buffer = Buffer.from(imageBase64, "base64");

    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image too large" }, { status: 400 });
    }

    try {
      const response = await client.send(
        new DetectLabelsCommand({
          Image: { Bytes: buffer },
          MaxLabels: 10,
          MinConfidence: 70,
        })
      );

      const isWater = response.Labels?.some(l => l.Name === "Water" || l.Name === "Flood" || l.Name === "Puddle");
      const v_pooling = isWater ? 0.85 : 0.05;

      return NextResponse.json({ 
        success: true, 
        labels: response.Labels,
        v_pooling,
        flood_detected: isWater
      });
    } catch (rekErr: unknown) {
      if (rekErr instanceof Error && rekErr.name === 'InvalidImageFormatException') {
        return NextResponse.json({ success: false, error: "Invalid image format" }, { status: 400 });
      }
      throw rekErr;
    }
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
