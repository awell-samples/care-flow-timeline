import { Activity } from "@awell-health/awell-sdk";
import { isEmpty } from "lodash";
import { useState, useEffect, useCallback } from "react";

type UseActivitiesHook = ({
  sorting,
  pagination,
  filters,
}: {
  sorting?: {
    field?: string;
    direction?: string;
  };
  pagination?: {
    count?: number;
    offset?: number;
  };
  filters: {
    patient_id: string;
    activity_type?: string[];
  };
}) => {
  data?: Activity[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const useActivities: UseActivitiesHook = ({
  pagination,
  sorting,
  filters,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("patient_id", filters.patient_id);
      if (!isEmpty(filters?.activity_type)) {
        filters.activity_type.forEach((type) =>
          params.append("activity_type", type)
        );
      }

      const url = `/api/activities?${params.toString()}`;

      const resp = await fetch(url, { cache: "no-store" });
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }

      const activitiesData = data.activities as Activity[];

      setData(activitiesData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [pagination, sorting, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
