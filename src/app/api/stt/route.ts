import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/firebase/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
} from "firebase/firestore";

// Inisialisasi Klien Gemini di luar fungsi agar bisa digunakan kembali
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
    try {
        // --- Bagian 1: Mengambil dan Memproses File Audio ---
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;
        if (!audioFile) {
            return NextResponse.json(
                { error: "No audio file provided" },
                { status: 400 }
            );
        }

        const gcSpeechApiKey = process.env.STT_API_KEY;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!gcSpeechApiKey || !geminiApiKey) {
            return NextResponse.json(
                { error: "API Key not configured on the server" },
                { status: 500 }
            );
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
            return NextResponse.json(
                { error: `S2T Error: ${s2tData.error.message}` },
                { status: 500 }
            );
        }

        let javaneseText = "";
        let indonesianText = "";

        if (s2tData.results && s2tData.results.length > 0) {
            javaneseText = s2tData.results[0].alternatives[0].transcript;

            // --- Bagian 3: Kirim Teks Jawa ke Gemini untuk Diterjemahkan ---
            console.log(
                `Teks Jawa diterima: "${javaneseText}". Menerjemahkan dengan Gemini...`
            );

            const prompt = `Terjemahkan kalimat Bahasa Jawa ini ke dalam Bahasa Indonesia yang baik dan benar: "${javaneseText}"`;
            const geminiResult = await geminiModel.generateContent(prompt);
            const geminiResponse = await geminiResult.response;
            indonesianText = geminiResponse.text();
        } else {
            javaneseText = "Tidak ada ucapan yang terdeteksi.";
            indonesianText = "";
        }

        // --- Bagian 4: Simpan ke Firestore ---
        const now = new Date();
        const dateKey = now.toISOString().split("T")[0]; // YYYY-MM-DD format

        const newRecord = {
            transcript: javaneseText,
            translation: indonesianText.trim(),
            timestamp: now.toISOString(),
            dateKey: dateKey,
        };

        const recordsRef = collection(db, "speech_records");
        const docRef = await addDoc(recordsRef, newRecord);

        // --- Bagian 5: Kirim Kembali Hasil Lengkap ---
        return NextResponse.json({
            transcript: javaneseText,
            translation: indonesianText.trim(),
            recordId: docRef.id,
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const dateParam = url.searchParams.get("date");

        // Default to today if no date specified
        const targetDate = dateParam || new Date().toISOString().split("T")[0];

        const recordsRef = collection(db, "speech_records");
        const q = query(
            recordsRef,
            where("dateKey", "==", targetDate),
            orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            transcript: doc.data().transcript,
            translation: doc.data().translation,
            timestamp: doc.data().timestamp,
            dateKey: doc.data().dateKey,
        }));

        return NextResponse.json({
            records,
            count: records.length,
            date: targetDate,
        });
    } catch (error) {
        console.error("Error fetching speech records:", error);
        return NextResponse.json(
            { error: "Failed to fetch speech records" },
            { status: 500 }
        );
    }
}
