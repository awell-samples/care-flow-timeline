import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    clinicalNote: {
      __args: {
        id: id,
      },
      success: true,
      clinical_note: {
        id: true,
        narratives: {
          __scalar: true,
        },
        context: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.clinicalNote;

  return Response.json({ data });
}
