import { useState, useEffect, useCallback } from "react";
import { Checklist } from "@awell-health/awell-sdk";

type UseChecklistHook = (id: string) => {
  data?: Checklist;
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const useChecklist: UseChecklistHook = (id) => {
  const [data, setData] = useState<Checklist>(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/activities/checklist/${id}`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }

      const checklistData = data.checklist as Checklist;

      setData(checklistData);
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
