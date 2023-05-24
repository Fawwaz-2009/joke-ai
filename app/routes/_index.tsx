import type { V2_MetaFunction } from "@remix-run/node";
import { ComedianSelector } from "~/components/comedianSelector";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import UserConfigsForm from "~/components/userConfigsFrom";
import useComediansStore from "~/stores/comedians";
import useUserConfigsStore from "~/stores/userConfigs";
import { useState } from "react";
import { useHasHydrated } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { fireGptStream } from "~/lib/fireGptStream";
import { useAbortableFetch } from "~/hooks/useAbortableFetch";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Joke-AI" }];
};

export default function Index() {
  const { openAiAPIKey } = useUserConfigsStore();
  const { selectedComedian } = useComediansStore();
  const hasHydrated = useHasHydrated();
  const [joke, setJoke] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData, abortFetch } = useAbortableFetch();

  return (
    <div className="bg-gradient-to-r from-yellow-200 to-yellow-500 h-full min-h-[100dvh]">
      <div className="flex justify-between items-center p-8">
        <h1 className="text-3xl md:text-7xl font-black text-center py-8">Jokes AI</h1>
        <UserConfigsForm />
      </div>
      <p className="text-xl text-center my-10 max-w-xl mx-auto">
        Meet Joke AI, your custom humor machine! Select a comedian, input a topic, and watch as our AI crafts a hilarious joke in the style of your chosen
        comedian. From Seinfeld's quirks to Oliver's satire, Joke AI brings a unique, personalized laugh just for you!
      </p>
      {openAiAPIKey && hasHydrated ? (
        <div className=" mx-auto p-4 ">
          <form
            className=""
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const jokeTopic = formData.get("joke-topic") as string;
              setJoke(null);
              setError(null);

              fetchData((abort) =>
                fireGptStream(
                  {
                    comedian: selectedComedian as string,
                    topic: jokeTopic,
                    apiKey: openAiAPIKey,
                  },
                  (data) => {
                    setJoke((joke) => {
                      if (!data) return joke;
                      return joke ? joke + data : data;
                    });
                  },
                  (error) => {
                    setError(error);
                  },
                  setIsGenerating,
                  abort
                )
              );
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className=" md:flex md:justify-left md:items-center md:gap-8">
                <ComedianSelector disabled={isGenerating} />
                <div className="w-full">
                  <Label className="block my-2 text-left mt-6 md:mt-auto">Joke Topic</Label>
                  <Input className="w-full" name="joke-topic" type="text" placeholder="Enter a topic" disabled={isGenerating} />
                </div>
              </div>
              <div className="flex gap-4 ">
                <Button className="mt-4" type="submit" disabled={isGenerating}>
                  Generate Joke
                </Button>
              </div>
              <h1 className="text-xl font-black pt-8 pb-2 capitalize">A joke in the style of {selectedComedian}</h1>
              <div className=" bg-white p-4 rounded-lg  h-80">
                <ScrollArea className="h-full">{joke}</ScrollArea>
              </div>
              {isGenerating && (
                <Button
                  className=" mt-4 w-full text-center"
                  type="button"
                  onClick={() => {
                    abortFetch();
                    setIsGenerating(false);
                  }}
                >
                  Stop Generating
                </Button>
              )}
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      ) : (
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-7xl font-black text-center py-8">Please enter your OpenAI API Key</h1>
        </div>
      )}
    </div>
  );
}
