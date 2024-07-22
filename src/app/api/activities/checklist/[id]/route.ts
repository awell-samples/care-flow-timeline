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
    checklist: {
      __args: {
        id: id,
      },
      success: true,
      checklist: {
        title: true,
        items: true,
      },
    },
  });

  const data = res.checklist;

  return Response.json({ data });
}
