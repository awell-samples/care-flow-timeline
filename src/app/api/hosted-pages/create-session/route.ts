import { AwellSdk } from "@awell-health/awell-sdk";

export async function POST(request: Request) {
  const { stakeholderId, pathwayId } = await request.json();

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.mutation({
    startHostedActivitySession: {
      __args: {
        input: {
          pathway_id: pathwayId,
          stakeholder_id: stakeholderId,
        },
      },
      success: true,
      session_url: true,
    },
  });

  const data = res.startHostedActivitySession;

  return Response.json({ data });
}
