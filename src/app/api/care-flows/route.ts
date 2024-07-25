import { AwellSdk } from "@awell-health/awell-sdk";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const careFlowIds = searchParams.getAll("id");

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const batchRequests = careFlowIds.map((id) =>
    sdk.orchestration.query({
      pathway: {
        __args: {
          id: id,
        },
        success: true,
        pathway: {
          id: true,
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
        },
      },
    })
  );

  const res = await Promise.all(batchRequests);

  const data = res;

  return Response.json({ data });
}
