import { useState, useEffect, useCallback } from "react";
import { GeneratedClinicalNote } from "@awell-health/awell-sdk";

type UseClinicalNoteHook = (id: string) => {
  data?: GeneratedClinicalNote;
  error: null | Error;
  loading: boolean;
  refresh: () => void;
};

export const useClinicalNote: UseClinicalNoteHook = (id) => {
  const [data, setData] = useState<GeneratedClinicalNote>(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/activities/clinical-note/${id}`;
      const resp = await fetch(url);
      const { data, error } = await resp.json();
      if (error || !data.success) {
        throw new Error("Failed to fetch");
      }

      const clinicalNoteData = data.clinical_note as GeneratedClinicalNote;

      setData(clinicalNoteData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
