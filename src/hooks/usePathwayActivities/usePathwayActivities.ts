import { Activity } from "@awell-health/awell-sdk";
import { useState, useEffect, useCallback } from "react";

type UsePathwayActivitiesHook = ({
  pathwayId,
  filters,
}: {
  pathwayId: string;
  filters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
}) => {
  data: Activity[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const usePathwayActivities: UsePathwayActivitiesHook = ({
  pathwayId,
  filters,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/care-flow/${pathwayId}/activities`;
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
            //@ts-ignore it's okay
            filters.activity_status.includes(activity.status)
          );
        }

        if (filters?.activity_type && filters.activity_type.length > 0) {
          activities = activities.filter((activity) =>
            //@ts-ignore it's okay
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
  }, [pathwayId, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
