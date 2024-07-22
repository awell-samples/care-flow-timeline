import { Answer } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";

type UseFormResponseHook = ({
  pathwayId,
  activityId,
}: {
  pathwayId: string;
  activityId: string;
}) => {
  data: Answer[];
  error: null | Error;
  loading: boolean;
};

export const useFormResponse: UseFormResponseHook = ({
  pathwayId,
  activityId,
}) => {
  const [data, setData] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/api/care-flow/${pathwayId}/form-response/${activityId}`;
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
    };

    fetchData();
  }, []);

  return { data, loading, error };
};