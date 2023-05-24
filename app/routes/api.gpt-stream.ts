import type { LoaderArgs } from "@remix-run/node";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { streamOpenAiChatResponse } from "~/lib/streamOpenAiChatResponse";

export const loader = async ({ request }: LoaderArgs) => {
  const ulrSearchParams = new URL(request.url).searchParams;
  const apiKey = ulrSearchParams.get("apiKey");
  const comedian = ulrSearchParams.get("comedian");
  const topic = ulrSearchParams.get("topic");

  if (!apiKey) {
    console.log("No API key provided", apiKey, ulrSearchParams);
    return new Response("No API key provided", { status: 400 });
  }
  if (!comedian) {
    console.log("No comedian provided");
    return new Response("No comedian provided", { status: 400 });
  }
  if (!topic) {
    console.log("No topic provided");
    return new Response("No topic provided", { status: 400 });
  }

  const chatPrompt = await ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a witty AI assistant trained to generate jokes in the style of {comedian}. Your response should only contain what would {comedian} say."
    ),
    HumanMessagePromptTemplate.fromTemplate(`Tell me some jokes about ${topic}.`),
  ]);

  const readableStream = streamOpenAiChatResponse({
    apiKey,
    chatPrompt: chatPrompt,
    templateValues: { comedian, topic },
    signal: request.signal, // Pass the controller to the function
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
    status: 200,
  });
};
