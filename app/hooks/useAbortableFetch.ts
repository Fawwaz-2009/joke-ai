import { useState, useCallback } from "react";

export const useAbortableFetch = () => {
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const fetchData = useCallback((fetchFunction: (arg: AbortController) => void) => {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    fetchFunction(newAbortController);
  }, []);

  const abortFetch = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  return { fetchData, abortFetch };
};
