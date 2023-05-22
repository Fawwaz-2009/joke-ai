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
      if (ev.data === "[DONE]") {
        abortController.abort();
        setIsGenerating(false);
        return;
      }
      try {
        const data = JSON.parse(ev.data);
        const deltaContent = data?.choices?.[0]?.delta?.content;
        onData(deltaContent);
      } catch (error) {
        console.log({ error });
        onError(error.message);
        setIsGenerating(false);
      }
    },
    onerror(error: Error & { response?: Response }) {
      setIsGenerating(false);
      abortController.abort(); // add this line to stop reconnection attempts
      console.log({ error, response: error.response });
      if (error.response?.status) {
        console.error(error.response.status, error.message);
        error.response.data.on("data", (data: string) => {
          const message = data.toString();
          try {
            const parsed = JSON.parse(message);
            console.error("An error occurred during OpenAI request: ", parsed);
            onError(parsed);
          } catch (error) {
            console.error("An error occurred during OpenAI request: ", message);
            onError(message);
          }
        });
      } else {
        console.error("An error occurred during OpenAI request", error);
        onError(error.message);
      }
    },
  });
};
