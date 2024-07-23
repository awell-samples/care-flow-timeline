import { Answer } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback } from "react";

type UseFormResponseHook = ({
  careFlowId,
  activityId,
}: {
  careFlowId: string;
  activityId: string;
}) => {
  data: Answer[];
  error: null | Error;
  loading: boolean;
};

export const useFormResponse: UseFormResponseHook = ({
  careFlowId,
  activityId,
}) => {
  const [data, setData] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/care-flow/${careFlowId}/form-response/${activityId}`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }

      const response = data.response.answers as Answer[];

      setData(response);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [careFlowId, activityId]);

  useEffect(() => {
    fetchData();
  }, [careFlowId, activityId]);

  return { data, loading, error };
};
