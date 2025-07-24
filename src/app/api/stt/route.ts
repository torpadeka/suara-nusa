// app/api/speech-to-text/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi Klien Gemini di luar fungsi agar bisa digunakan kembali
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function POST(req: NextRequest) {
    try {
        // --- Bagian 1: Mengambil dan Memproses File Audio ---
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const gcSpeechApiKey = process.env.STT_API_KEY;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!gcSpeechApiKey || !geminiApiKey) {
            return NextResponse.json({ error: "API Key not configured on the server" }, { status: 500 });
        }

        const audioBytes = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(audioBytes).toString("base64");

        // --- Bagian 2: Kirim ke Google Cloud Speech-to-Text ---
        console.log("Mengirim audio ke Google Cloud Speech-to-Text...");
        const s2tResponse = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${gcSpeechApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    config: {
                        encoding: "LINEAR16",
                        sampleRateHertz: 16000, // Sesuaikan jika perlu
                        languageCode: "jv-ID",
                    },
                    audio: { content: base64Audio },
                }),
            }
        );

        const s2tData = await s2tResponse.json();

        if (s2tData.error) {
            console.error("Google S2T Error:", s2tData.error);
            return NextResponse.json({ error: `S2T Error: ${s2tData.error.message}` }, { status: 500 });
        }

        if (s2tData.results && s2tData.results.length > 0) {
            const javaneseText = s2tData.results[0].alternatives[0].transcript;

            // --- Bagian 3: Kirim Teks Jawa ke Gemini untuk Diterjemahkan ---
            console.log(`Teks Jawa diterima: "${javaneseText}". Menerjemahkan dengan Gemini...`);
            
            const prompt = `Terjemahkan kalimat Bahasa Jawa ini ke dalam Bahasa Indonesia yang baik dan benar: "${javaneseText}"`;
            
            const geminiResult = await geminiModel.generateContent(prompt);
            const geminiResponse = await geminiResult.response;
            const indonesianText = geminiResponse.text();

            // --- Bagian 4: Kirim Kembali Hasil Lengkap ---
            return NextResponse.json({
                transcript: javaneseText,
                translation: indonesianText.trim(),
            });

        } else {
            return NextResponse.json({ transcript: "Tidak ada ucapan yang terdeteksi.", translation: "" });
        }

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}