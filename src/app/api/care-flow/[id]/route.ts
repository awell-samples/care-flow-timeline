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
    pathway: {
      __args: {
        id: careFlowId,
      },
      success: true,
      pathway: {
        pathway_definition_id: true,
        release_id: true,
        version: true,
        patient_id: true,
        title: true,
        start_date: true,
        stop_date: true,
        complete_date: true,
        status: true,
        status_explanation: true,
        patient: {
          id: true,
        },
      },
    },
  });

  const data = res.pathway;

  return Response.json({ data });
}
