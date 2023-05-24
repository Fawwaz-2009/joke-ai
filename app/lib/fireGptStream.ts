import { fetchEventSource } from "@microsoft/fetch-event-source";

interface Params {
  [key: string]: string | number | boolean;
}

type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;
type SetData = (data: string) => void;

export const fireGptStream = (params: Params, onData: SetData, onError: SetData, setIsGenerating: SetBoolean, abortController: AbortController) => {
  setIsGenerating(true);

  // convert params object to query string
  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  fetchEventSource(`/api/gpt-stream?${queryString}`, {
    signal: abortController.signal,
    onmessage(ev) {
      if (ev.event === "END") {
        abortController.abort();
        setIsGenerating(false);
        return;
      }
      if (ev.event === "ERROR") {
        abortController.abort();
        setIsGenerating(false);
        onError(ev.data);
        return;
      }
      try {
        onData(ev.data);
      } catch (error: any) {
        onError(error.message);
        setIsGenerating(false);
      }
    },
    onerror(error: unknown) {
      setIsGenerating(false);
      onError("An error occurred during your request");

      throw error;
    },
    onclose() {
      setIsGenerating(false);
      abortController.abort(); // add this line to stop reconnection attempts
    },
  });
};
