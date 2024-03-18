"use client";

import {
  generateChatResponse,
  fetchUserTokensById,
  subtractTokens,
} from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { ChatCompletionMessage, ChatCompletionRole } from "openai/resources";
import NoMessages from "./NoMessages";

export interface MessageInterface {
  role: ChatCompletionRole;
  content: string;
}
const TestMessages: MessageInterface[] = [
  { role: "user", content: "Hi, what is the date today?" },
  { role: "assistant", content: "Today is October 15th, 2021." },
];
const Chat: React.FC = () => {
  const { userId } = useAuth();

  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<MessageInterface[]>(TestMessages);
  // const [messages, setMessages] = useState<MessageInterface[]>([]);
  const { mutate, isPending } = useMutation({
    mutationFn: async (query: MessageInterface) => {
      // Ensure userId exists before proceeding
      if (!userId) {
        toast.error("User ID is not available.");
        return;
      }
      const currentTokens: number | null = await fetchUserTokensById(userId);

      if (!currentTokens || currentTokens < 100) {
        toast.error("Token balance too low....");
        return;
      }

      const response: {
        message: ChatCompletionMessage;
        tokens: number | undefined;
      } | null = await generateChatResponse([...messages, query]);

      if (!response) {
        toast.error("Something went wrong...");
        return;
      }
      const resTokens = response.tokens;
      if (!resTokens) {
        toast.error("Something went wrong...");
        return;
      }
      // setMessages((prev) => [...prev, response.message]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant", // Assuming this role for the response message
          content: response.message.content || "", // Fallback to empty string if null
        },
      ]);
      const newTokens = await subtractTokens(userId, resTokens);
      toast.success(`${newTokens} tokens remaining...`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query: MessageInterface = { role: "user", content: text };
    mutate(query);
    setMessages((prev) => [...prev, query]);
    setText("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-rows-[1fr,auto]">
      {messages.length < 1 && <NoMessages />}
      <div>
        {messages.map(({ role, content }, index) => {
          const roleName = role == "user" ? "You" : "WanderlustGPT";
          const avatar = role == "user" ? "👤" : "🤖";
          const bcg = role === "user" ? "bg-base-200" : "bg-base-100";
          return (
            <div
              key={index}
              className={`${bcg} flex py-4 -mx-8 px-8 text-xl leading-loose border-b border-base-300 flex flex-1 text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group`}
            >
              <span className="mr-1">{avatar}</span>
              <div className="relative flex w-full flex-col">
                <div className="font-semibold select-none">{roleName}</div>
                <p className="max-w-3xl font-normal">{content}</p>
              </div>
            </div>
          );
        })}
        {isPending ? <span className="loading"></span> : null}
      </div>
      <form onSubmit={handleSubmit} className="pt-12 flex justify-center">
        <div className="join w-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
          <input
            type="text"
            autoComplete="off"
            id="chatMessage"
            name="chatMessage"
            placeholder="Message WanderlustGPT"
            className="input input-bordered join-item w-full"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn btn-primary join-item"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Ask a question"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Chat;
