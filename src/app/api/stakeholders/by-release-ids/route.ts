import { type NextRequest } from "next/server";

import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; activityId: string } }
) {
  const searchParams = request.nextUrl.searchParams;

  const releaseIdsAsString = searchParams.get("releaseIds");
  const releaseIds = releaseIdsAsString.split(",");

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    stakeholdersByReleaseIds: {
      __args: {
        release_ids: releaseIds,
      },
      success: true,
      stakeholders: {
        id: true,
        definition_id: true,
        label: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.stakeholdersByReleaseIds;

  return Response.json({ data });
}
