import { Pathway } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback } from "react";

type UsePathwayHook = (id: string) => {
  data?: Pathway;
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const usePathway: UsePathwayHook = (id) => {
  const [data, setData] = useState<Pathway>(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/care-flow/${id}`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }
      const careFlowData = data.pathway as Pathway;

      setData(careFlowData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
