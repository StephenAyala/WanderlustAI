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
import { ChatCompletionMessage } from "openai/resources";

const Chat: React.FC = () => {
  const { userId } = useAuth();

  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
  const { mutate, isPending } = useMutation({
    mutationFn: async (query: ChatCompletionMessage) => {
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

      const response = await generateChatResponse([...messages, query]);

      if (!response) {
        toast.error("Something went wrong...");
        return;
      }
      const resTokens = response.tokens;
      if (!resTokens) {
        toast.error("Something went wrong...");
        return;
      }
      setMessages((prev) => [...prev, response.message]);
      const newTokens = await subtractTokens(userId, resTokens);
      toast.success(`${newTokens} tokens remaining...`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query: ChatCompletionMessage = { role: "user", content: text };
    mutate(query);
    setMessages((prev) => [...prev, query]);
    setText("");
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }, index) => {
          const avatar = role == "user" ? "👤" : "🤖";
          const bcg = role === "user" ? "bg-base-200" : "bg-base-100";
          return (
            <div
              key={index}
              className={`${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
            >
              <span className="mr-4">{avatar}</span>
              <p className="max-w-3xl">{content}</p>
            </div>
          );
        })}
        {isPending ? <span className="loading"></span> : null}
      </div>
      <form onSubmit={handleSubmit} className="pt-12 flex justify-center">
        <div className="join w-full max-w-4xl">
          <input
            type="text"
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
