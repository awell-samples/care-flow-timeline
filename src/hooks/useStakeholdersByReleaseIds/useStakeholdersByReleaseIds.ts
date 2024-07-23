import { type Stakeholder } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback } from "react";

type UseStakeholdersByReleaseIdsHook = ({
  releaseIds,
}: {
  releaseIds: string[];
}) => {
  data: Stakeholder[];
  error: null | Error;
  loading: boolean;
};

export const useStakeholdersByReleaseIds: UseStakeholdersByReleaseIdsHook = ({
  releaseIds,
}) => {
  const [data, setData] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/stakeholders/by-release-ids?release_ids=${releaseIds.join(",")}`;

      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }
      const response = data.stakeholders as Stakeholder[];

      setData(response);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [releaseIds]);

  useEffect(() => {
    if (releaseIds.length === 0) return;

    fetchData();
  }, [releaseIds, fetchData]);

  return { data, loading, error };
};
