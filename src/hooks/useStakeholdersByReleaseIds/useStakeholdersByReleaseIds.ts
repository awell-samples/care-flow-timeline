import { type Stakeholder } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";

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
  useEffect(() => {
    if (releaseIds.length === 0) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL(`/api/stakeholders/by-release-ids`);
        url.search = new URLSearchParams({
          release_ids: releaseIds.join(","),
        }).toString();
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
    };

    fetchData();
  }, [releaseIds]);

  return { data, loading, error };
};
