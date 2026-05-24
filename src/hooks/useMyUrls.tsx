import { useEffect, useState } from "react";

export function useUrls<T>({
  fetcher,
  params,
}: {
  fetcher: (params?: any) => Promise<T>;

  params?: any;
}) {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await fetcher(params);

      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
