import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(
  request: Request,
  { params }: { params: { id: string; activityId: string } }
) {
  const careFlowId = params.id;
  const activityId = params.activityId;

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    formResponse: {
      __args: {
        pathway_id: careFlowId,
        activity_id: activityId,
      },
      success: true,
      response: {
        answers: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.formResponse;

  return Response.json({ data });
}
