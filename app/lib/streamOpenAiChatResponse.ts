import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
import type { ChatPromptTemplate } from "langchain/prompts";
import type { ChainValues } from "langchain/schema";
import type { BaseLanguageModelCallOptions } from "langchain/base_language";

export const streamOpenAiChatResponse = (args: {
  chatPrompt: ChatPromptTemplate;
  apiKey: string;
  templateValues: ChainValues & BaseLanguageModelCallOptions;
  signal: AbortSignal; // Add this line
}) => {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const llm = new ChatOpenAI({
    openAIApiKey: args.apiKey,
    temperature: 0.7,
    streaming: true,
    modelName: "gpt-3.5-turbo",
    callbackManager: CallbackManager.fromHandlers({
      handleLLMNewToken: async (token) => {
        await writer.ready;
        await writer.write(`data: ${token}\n\n`);
      },
      handleLLMEnd: async () => {
        await writer.ready;
        await writer.write(`event: END\n`);
        await writer.write(`data: \n\n`);
        await writer.close();
      },
      handleLLMError: async (e) => {
        const errorMessage = e.status === 401 ? "Invalid API key" : "Something went wrong";
        await writer.ready;
        await writer.write(`event: ERROR\n`);
        await writer.write(`data: ${errorMessage}\n\n`);
        await writer.abort(e);
      },
    }),
  });
  const chain = new LLMChain({
    prompt: args.chatPrompt,
    llm: llm,
  });

  chain.call({ ...args.templateValues, signal: args.signal }).catch(async (e) => {
    const errorMessage = e.status === 401 ? "Invalid API key" : "Something went wrong";
    await writer.ready;
    await writer.write(`event: ERROR\n`);
    await writer.write(`data: ${errorMessage}\n\n`);
    await writer.abort(e);
  });
  return stream.readable;
};
