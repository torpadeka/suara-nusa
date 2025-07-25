# Suara Nusa: Bridging Islands, Uniting Voices

<p align="center">
  <img src="public/logo.jpg" alt="Suara Nusa" style="border-radius: 12px;"/>
</p>

<p align="center">
  <strong>An innovative platform dedicated to the preservation and exploration of Indonesia's rich cultural heritage through technology.</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#technology-stack"><strong>Technology Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a>
</p>

---

## About Suara Nusa

_Suara Nusa_ (meaning "Voice of the Archipelago") is a comprehensive, AI-powered Next.js application designed to connect users with the diverse cultures of Indonesia. Our platform bridges the gap between tradition and technology, offering an immersive and educational experience for anyone interested in learning about Indonesia's languages, history, and traditions.

## ✨ Features

Suara Nusa is built upon three core pillars, each offering a unique way to engage with Indonesian culture:

### 🗺 Nusapedia: The Interactive Cultural Atlas

An immersive, map-based knowledge repository that allows users to explore Indonesia's history and culture through different eras.

-   _Interactive Timeline:_ Switch between different historical periods, including the "Kingdom Era," "Colonial Era," and "Modern Era."
-   _Dynamic Content:_ Click on historical sites, kingdoms, or provinces to open an interactive sidebar.
-   _AI-Powered Insights:_ The sidebar uses the Gemini AI to provide detailed, context-aware information, complete with a chatbot for follow-up questions.
-   _Visual Exploration:_ For ancient kingdoms, the map displays estimated territorial boundaries, offering a unique visual representation of their influence.

### Nusalingua: The Duolingo of Indonesian Languages

A gamified, Duolingo-like experience for learning Indonesia's regional languages, starting with Javanese.

-   _Interactive Lessons:_ Engage with a variety of exercises, including multiple-choice questions, translations, and fill-in-the-blanks.
-   _Gamified Progress:_ Track your learning journey with experience points (XP), streaks, and achievements to stay motivated.
-   _Structured Learning Path:_ Advance through different levels, from basic greetings in a traditional village to more complex conversations in a modern city.

### 🤖 Nusatech: The IoT-Powered Language Bridge

A real-time language translation service that connects with IoT devices, allowing for seamless communication in local Indonesian languages.

-   _Live Translation:_ Connect a microphone-equipped IoT device and get real-time Javanese-to-Indonesian translations.
-   _Cloud-Powered:_ Utilizes Google's Speech-to-Text API for accurate transcriptions and the Gemini AI for nuanced translations.
-   _Daily Summaries:_ Review your daily conversations and generate an AI-powered glossary to help you remember key terms and phrases.

## 🚀 Technology Stack

Suara Nusa is built with a modern, robust, and scalable technology stack:

-   _Framework:_ [Next.js](https://nextjs.org/) (with App Router)
-   _Language:_ [TypeScript](https://www.typescriptlang.org/)
-   _Styling:_ [Tailwind CSS](https://tailwindcss.com/)
-   _AI & Machine Learning:_
    -   [Google Gemini AI](https://ai.google.dev/): For generating detailed cultural information and powering the chatbot.
    -   [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text): For transcribing regional languages in Nusatech.
-   _Database:_ [Firebase Firestore](https://firebase.google.com/docs/firestore): For storing user data and translations from IoT devices.
-   _Interactive Map:_ [React Leaflet](https://react-leaflet.js.org/): A lightweight and powerful library for creating interactive maps.
-   _UI Components:_ Built with [shadcn/ui](https://ui.shadcn.com/) for a consistent and accessible design system.
-   _Deployment:_ Optimized for [Vercel](https://vercel.com/).

## 🏁 Getting Started

To run Suara Nusa locally, follow these steps:

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm

### 1. Clone the Repository

bash
git clone [https://github.com/your-username/suara-nusa.git](https://github.com/your-username/suara-nusa.git)
cd suara-nusa

### 2. Install Dependencies

npm install
or
yarn install

### 3. Set the Credentials

NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
... and other Firebase credentials

And enjoy our applications!

## AI Attributions

This project was made with help from v0 and Gemini.