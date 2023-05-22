import type { LoaderArgs } from "@remix-run/node";

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
  console.log({
    apiKey,
    comedian,
    topic,
  });
  console.log(comedian);
  const payload = {
    messages: [
      {
        role: "system",
        content: `You are a witty AI assistant trained to generate jokes in the style of ${comedian}. Your response should only contain what would ${comedian} say.`,
      },
      { role: "user", content: `Tell me some jokes about ${topic}.` },
    ],
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.7,
  };
  const url = "https://api.openai.com/v1/chat/completions";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  }).catch((error) => {
    console.log({ error });
    throw error;
  });
};
