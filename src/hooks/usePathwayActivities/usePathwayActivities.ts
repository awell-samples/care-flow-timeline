import { Activity } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback, useMemo } from "react";

type UsePathwayActivitiesHook = ({
  careFlowId,
  filters,
}: {
  careFlowId: string;
  filters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
  sorting?: {
    field?: string;
    direction?: string;
  };
}) => {
  data: Activity[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

const defaultSorting = { field: "date", direction: "asc" };

export const usePathwayActivities: UsePathwayActivitiesHook = ({
  careFlowId,
  filters,
  sorting = defaultSorting,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("sorting_field", sorting.field);
      params.append("sorting_direction", sorting.direction);

      const url = `/api/care-flow/${careFlowId}/activities?${params.toString()}`;
      const resp = await fetch(url, { cache: "no-store" });
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }

      let activities = data.activities as Activity[];

      // Apply filters
      if (filters) {
        if (filters?.activity_status && filters.activity_status.length > 0) {
          activities = activities.filter((activity) =>
            filters.activity_status.includes(activity.status)
          );
        }

        if (filters?.activity_type && filters.activity_type.length > 0) {
          activities = activities.filter((activity) =>
            filters.activity_type.includes(activity.object?.type ?? "NO_TYPE")
          );
        }
      }

      setData(activities);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [careFlowId, filters, sorting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
