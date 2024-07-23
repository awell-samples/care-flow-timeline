import { type NextRequest } from "next/server";

import { AwellSdk } from "@awell-health/awell-sdk";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const patientId = searchParams.get("patient_id");
  const activityTypes = searchParams.getAll("activity_type");

  const sdk = new AwellSdk({
    apiUrl: process.env.AWELL_API_URL,
    apiKey: process.env.AWELL_API_KEY,
  });

  const res = await sdk.orchestration.query({
    activities: {
      __args: {
        pagination: {
          count: 20,
          offset: 0,
        },
        sorting: {
          field: "date",
          direction: "desc",
        },
        filters: {
          patient_id: { eq: patientId },
          activity_type: {
            in: activityTypes,
          },
        },
      },
      success: true,
      activities: {
        id: true,
        stream_id: true,
        date: true,
        action: true,
        status: true,
        resolution: true,
        reference_id: true,
        container_name: true,
        isUserActivity: true,
        public: true,
        session_id: true,
        icon_url: true,
        form: {
          questions: {
            __scalar: true,
          },
        },
        form_display_mode: true,
        action_component: {
          title: true,
        },
        indirect_object: {
          __scalar: true,
        },
        object: {
          __scalar: true,
        },
        stakeholders: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.activities;

  return Response.json({ data });
}
