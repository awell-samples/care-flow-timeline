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
    pathwayActivities: {
      __args: {
        pathway_id: careFlowId,
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

  const data = res.pathwayActivities;

  return Response.json({ data });
}
