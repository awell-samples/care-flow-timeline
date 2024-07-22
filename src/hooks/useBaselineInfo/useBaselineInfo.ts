import { BaselineDataPoint } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

type UseBaselineInfoHook = ({ pathway_id }: { pathway_id: string }) => {
  data: BaselineDataPoint[];
  error: null | Error;
  loading: boolean;
};

export const useBaselineInfo: UseBaselineInfoHook = ({ pathway_id }) => {
  const [data, setData] = useState<BaselineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/care-flow/${pathway_id}/baseline-info`);
        const { data, error } = await resp.json();
        if (error || !data.success) {
          throw new Error("Failed to fetch");
        }

        const response = data.baselineDataPoints as BaselineDataPoint[];

        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!isEmpty(pathway_id)) {
      fetchData();
    }
  }, [pathway_id]);

  return { data, loading, error };
};
