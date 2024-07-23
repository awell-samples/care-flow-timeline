import { Answer, Form } from "@awell-health/awell-sdk";
import { useState, useEffect } from "react";

type UseFormHook = (formId: string) => {
  data: Form;
  error: null | Error;
  loading: boolean;
};

export const useForm: UseFormHook = (formId) => {
  const [data, setData] = useState<Form | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/api/activities/form/${formId}`;
        const resp = await fetch(url);
        const { data, error } = await resp.json();
        if (error || !data.success) {
          throw new Error("Failed to fetch");
        }

        const form = data.form as Form;

        setData(form);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  return { data, loading, error };
};
