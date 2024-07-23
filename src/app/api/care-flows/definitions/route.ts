import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(request: Request) {
  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    publishedPathwayDefinitions: {
      success: true,
      publishedPathwayDefinitions: {
        __scalar: true,
      },
    },
  });

  const data = res.publishedPathwayDefinitions;

  return Response.json({ data });
}
