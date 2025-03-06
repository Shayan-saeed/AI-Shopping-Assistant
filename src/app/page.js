"use client";
import { useState } from "react";
import { OpenAI } from "openai";

const API_KEY = "your-api-key";

const client = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome! I'm your AI shopping assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: updatedMessages,
      });

      setMessages([...updatedMessages, { role: "assistant", content: response.choices[0].message.content }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "Oops! Something went wrong. Try again." }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-blue-500 text-white text-lg font-bold">🛍️ AI Shopping Assistant</div>
        <div className="p-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <p className={`inline-block p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                {msg.content}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg outline-none text-black"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
