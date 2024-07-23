import { PublishedPathwayDefinition } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback } from "react";

type UsePathwayDefinitionsHook = ({
  filters,
}: {
  filters?: { definitionIds?: string[] };
}) => {
  data?: PublishedPathwayDefinition[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const usePathwayDefinitions: UsePathwayDefinitionsHook = ({
  filters: { definitionIds },
}) => {
  const [data, setData] = useState<PublishedPathwayDefinition[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/care-flows/definitions`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }
      let defininitionsData =
        data.publishedPathwayDefinitions as PublishedPathwayDefinition[];

      if (definitionIds) {
        defininitionsData = defininitionsData.filter((def) =>
          definitionIds.includes(def.id)
        );
      }

      setData(defininitionsData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [definitionIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
