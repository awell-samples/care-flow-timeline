import { PathwayPayload } from "@awell-health/awell-sdk";
import { isEmpty } from "lodash";
import { useState, useEffect, useCallback } from "react";

type UsePathwaysHook = (id: string[]) => {
  data?: PathwayPayload[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const usePathways: UsePathwaysHook = (ids) => {
  const [data, setData] = useState<PathwayPayload[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      ids.forEach((id) => params.append("id", id));

      const url = `/api/care-flows?${params.toString()}`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error) {
        throw new Error("Failed to fetch");
      }
      const careFlowsData = data as { pathway: PathwayPayload }[];

      setData(careFlowsData.map((_) => _.pathway));
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [ids]);

  useEffect(() => {
    if (isEmpty(ids)) return;

    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
