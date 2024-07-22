import { BaselineDataPoint } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

type UseBaselineInfoHook = ({ careFlowId }: { careFlowId: string }) => {
  data: BaselineDataPoint[];
  error: null | Error;
  loading: boolean;
};

export const useBaselineInfo: UseBaselineInfoHook = ({ careFlowId }) => {
  const [data, setData] = useState<BaselineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/care-flow/${careFlowId}/baseline-info`);
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

    if (!isEmpty(careFlowId)) {
      fetchData();
    }
  }, [careFlowId]);

  return { data, loading, error };
};
