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
  filters?: {
    patient_id?: string;
    activity_type?: string[];
    pathway_definition_id?: string[];
  };
}) => {
  data?: Activity[];
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const useActivities: UseActivitiesHook = ({
  pagination,
  sorting = { field: "date", direction: "asc" },
  filters,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (!isEmpty(filters.patient_id)) {
        params.append("patient_id", filters.patient_id);
      }

      if (!isEmpty(filters?.activity_type)) {
        filters.activity_type.forEach((type) =>
          params.append("activity_type", type)
        );
      }

      if (!isEmpty(filters?.pathway_definition_id)) {
        filters.pathway_definition_id.forEach((type) =>
          params.append("pathway_definition_id", type)
        );
      }

      params.append("sorting_field", sorting.field);
      params.append("sorting_direction", sorting.direction);

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
  }, [filters, sorting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
