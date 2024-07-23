import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const patientId = params.id;

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    patientPathways: {
      __args: {
        patient_id: patientId,
      },
      success: true,
      patientPathways: {
        __scalar: true,
        baseline_info: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.patientPathways;

  return Response.json({ data });
}
