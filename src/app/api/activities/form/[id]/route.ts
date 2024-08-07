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
    form: {
      __args: {
        id: id,
      },
      success: true,
      form: {
        __scalar: true,
        questions: {
          __scalar: true,
        },
      },
    },
  });

  const data = res.form;

  return Response.json({ data });
}
