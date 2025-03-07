"use client";
import { useState, useRef, useEffect } from "react";
import { OpenAI } from "openai";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [products, setProducts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Welcome! I'm your AI shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    upsell: "",
  });

  const client = apiKey
    ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    : null;

  const addProduct = () => {
    if (!productData.name || !productData.category || !productData.price)
      return;
    setProducts([...products, productData]);
    setProductData({ name: "", category: "", price: "", upsell: "" });
  };

  const sendMessage = async () => {
    if (!input.trim() || !client) return;
    setLoading(true);
    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI shopping assistant for XYZ Company. Recommend from the following products: ${JSON.stringify(
              products
            )}`,
          },
          ...updatedMessages,
        ],
      });

      const aiMessage = response.choices[0].message.content;

      const formattedResponse = formatChatMessage(aiMessage);

      setMessages([...updatedMessages, ...formattedResponse]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const formatChatMessage = (message) => {
    const formattedMessages = [];
   
    const sentences = message.split("\n\n"); 
  
    sentences.forEach((sentence) => {
      if (sentence.startsWith("- ")) {

        const listItems = sentence.split("\n").map((item) =>
          item.replace("- ", "• ").replace(/\*\*(.*?)\*\*/g, (_, p1) => p1) 
        );
        formattedMessages.push({ role: "assistant", content: listItems.join("\n") });
      } else if (sentence.includes("**")) {
        const cleanSentence = sentence.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1); 
        formattedMessages.push({ role: "assistant", content: cleanSentence });
      } else {
        formattedMessages.push({ role: "assistant", content: sentence });
      }
    });
  
    return formattedMessages;
  };

  
  const deleteProduct = (index) => {
    setProducts((prevProducts) => {
      return prevProducts.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-800 p-6">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <div className="w-full max-w-4xl bg-white dark:bg-black shadow-lg rounded-lg p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 px-6 bg-white dark:bg-black">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🛍️ Add a Product
            </h2>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                placeholder="Enter category"
                value={productData.category}
                onChange={(e) =>
                  setProductData({ ...productData, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="upsell"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Upsell Product (Optional)
              </label>
              <input
                type="text"
                id="upsell"
                placeholder="Enter upsell product"
                value={productData.upsell}
                onChange={(e) =>
                  setProductData({ ...productData, upsell: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <button
              onClick={addProduct}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🔑 OpenAI API Key
            </h2>
            <div className="mb-4">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                placeholder="Enter OpenAI API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📦 Added Products
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center">
              {products.map((product, index) => (
                <div key={index} className="w-full sm:w-1/2 p-4 relative">
                  <div className="rounded-lg p-6 text-center shadow-lg bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-2 dark:text-gray-400">{product.category}</p>
                    <p className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">${product.price}</p>
                    {product.upsell && (
                      <p className="text-sm text-blue-600 mb-4 dark:text-blue-400">
                        Upsell: {product.upsell}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteProduct(index)}
                    className="absolute top-4 right-4 text-black p-1 rounded-full focus:outline-none hover:scale-110 dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={() => setChatOpen(!chatOpen)}
      >
        {chatOpen ? "✕ Close Chat" : "💬 Chat with AI"}
      </button>

      {chatOpen && (
        <div
          ref={chatRef}
          className={`fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-600 ${
            chatOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-700 dark:to-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 dark:bg-gray-700">
                <img
                  src="https://img.freepik.com/premium-vector/ai-chatbot-icon-icon_1076610-101933.jpg"
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold">Chat with AI</h3>
                <p className="text-xs opacity-70">We're online</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
              <button onClick={() => setChatOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-white dark:bg-gray-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <p
                  className={`inline-block p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-200 text-black"
                      : "bg-gray-100 text-black dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-t-neutral-300 px-2 flex items-center dark:border-gray-700 bg-white dark:bg-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message..."
              className="flex-grow p-3 rounded-full outline-none text-black bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 11a1 1 0 00.889 1.447H9V19a1 1 0 102 0v-5.003h6.111a1 1 0 00.889-1.447l-7-11z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
