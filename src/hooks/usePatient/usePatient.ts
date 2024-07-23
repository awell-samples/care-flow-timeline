import { User } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

type UsePatientHook = (id: string) => {
  data?: User;
  error: null | Error;
  loading: boolean;
};

export const usePatient: UsePatientHook = (id) => {
  const [data, setData] = useState<User>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/patient/${id}`);
        const { data, error } = await resp.json();
        if (error || !data.success) {
          throw new Error("Failed to fetch");
        }

        const patientData = data.patient as User;

        setData(patientData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!isEmpty(id)) {
      fetchData();
    }
  }, [id]);

  return { data, loading, error };
};
