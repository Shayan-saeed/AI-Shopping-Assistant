# AI Shopping Assistant 🛍️🤖

## Overview
The AI Shopping Assistant is an intelligent chatbot designed to enhance the online shopping experience through conversational AI. It engages with customers in a natural dialogue, extracts product preferences from their responses, and provides personalized product recommendations. The assistant can also attempt to upsell or cross-sell by suggesting complementary items.

This project is built using React (Next.js) for the frontend and OpenAI’s API for AI-powered conversation handling and product recommendations.

## 🛠️ Tech Stack
Frontend: React (Next.js), Tailwind CSS
Backend: None (AI logic handled via OpenAI API)
AI Model: OpenAI GPT-4o-mini (can be updated to another model)
Database: (Optional) Firebase/Supabase for chat history persistence
Deployment: Vercel (for frontend)

## 🚀 Features
✅ Natural conversational shopping experience
✅ AI-powered product recommendations based on context
✅ Upselling and cross-selling capabilities
✅ Interactive chat UI for a seamless experience
✅ Easily extendable with voice support (future updates)

## 🔧 Setup & Installation

1️⃣ Clone the Repository
bash
Copy
Edit
git clone [https://github.com/Shayan-saeed/ai-shopping-assistant.git](https://github.com/Shayan-saeed/AI-Shopping-Assistant.git)
cd ai-chatbot

2️⃣ Install Dependencies
bash
Copy
Edit
npm install

3️⃣ Set Up Environment Variables
Create a .env.local file in the root directory and add your OpenAI API key:
plaintext
Copy
Edit
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
Note: Get your OpenAI API key from OpenAI's platform.

4️⃣ Run the Development Server
bash
Copy
Edit
npm run dev
The app will be available at http://localhost:3000

## 🛠️ Customization
To change the product list: Update the predefined product catalog in products.js.
To modify AI responses: Adjust the system prompt inside ChatComponent.jsx.
To integrate a database: Implement Firebase or Supabase for storing chat history.
📌 Future Enhancements
🔹 Voice-to-text support for audio-based conversations
🔹 Product comparison and real-time stock checking
🔹 Multi-language support for global accessibility

## 🤝 Contributing
Feel free to fork the repo and submit pull requests! Contributions are welcome to improve features, UI, and integrations.

## 📜 License
This project is open-source under the MIT License.
