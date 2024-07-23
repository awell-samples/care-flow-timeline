import { PatientPathway } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

type UsePatientPathwaysHook = (patientId: string) => {
  data: PatientPathway[];
  error: null | Error;
  loading: boolean;
};

export const usePatientPathways: UsePatientPathwaysHook = (patientId) => {
  const [data, setData] = useState<PatientPathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/patient/${patientId}/care-flows`);
        const { data, error } = await resp.json();
        if (error || !data.success) {
          throw new Error("Failed to fetch");
        }

        const patientPathwaysData = data.patientPathways as PatientPathway[];

        setData(patientPathwaysData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!isEmpty(patientId)) {
      fetchData();
    }
  }, [patientId]);

  return { data, loading, error };
};
