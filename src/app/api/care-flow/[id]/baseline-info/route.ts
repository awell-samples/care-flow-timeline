import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const careFlowId = params.id;

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    baselineInfo: {
      __args: {
        pathway_id: careFlowId,
      },
      success: true,
      baselineDataPoints: {
        value: true,
        definition: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.baselineInfo;

  return Response.json({ data });
}
