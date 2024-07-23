import { useState } from "react";

type UseHostedPagesActivitySessionHook = () => {
  createSession: ({
    careFlowId,
    stakeholderId,
  }: {
    careFlowId: string;
    stakeholderId: string;
  }) => Promise<string | undefined>;
  loading: boolean;
  error: null | Error;
};

export const useHostedPagesActivitySession: UseHostedPagesActivitySessionHook =
  () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const createSession = async ({
      careFlowId,
      stakeholderId,
    }: {
      careFlowId: string;
      stakeholderId: string;
    }) => {
      setLoading(true);
      try {
        const url = `/api/hosted-pages/create-session`;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            careFlowId,
            stakeholderId,
          }),
        });

        const { data, error } = await resp.json();

        if (error || !data.success) {
          throw new Error("Failed to fetch");
        }

        const sessionUrl = data.session_url;

        return sessionUrl;
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    return { createSession, loading, error };
  };
