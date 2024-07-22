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
    patient: {
      __args: {
        id: patientId,
      },
      success: true,
      patient: {
        profile: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.patient;

  return Response.json({ data });
}
