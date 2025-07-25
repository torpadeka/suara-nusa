import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { records, language } = body;

        if (!records || !Array.isArray(records) || records.length === 0) {
            return NextResponse.json(
                { error: "Records array is required and must not be empty" },
                { status: 400 }
            );
        }

        if (!language || !["english", "local"].includes(language)) {
            return NextResponse.json(
                { error: "Language must be either 'english' or 'local'" },
                { status: 400 }
            );
        }

        // Prepare the text data for glossary generation
        let textData = "";
        if (language === "english") {
            textData = records
                .map((record) => `Original: ${record.text}`)
                .join("\n");
        } else {
            textData = records
                .map(
                    (record) =>
                        `Javanese: ${record.transcript}\nIndonesian: ${record.translation}`
                )
                .join("\n\n");
        }

        const languageType =
            language === "english"
                ? "English"
                : "Local Indonesian Language (e.g., Javanese, Sundanese)";

        const prompt = `Please generate a comprehensive glossary based on today's text and translations in ${languageType}. 

Text data:
${textData}

Please create a glossary that includes:
1. Key terms and their definitions
2. Important phrases and their meanings
3. Cultural context where applicable
4. Pronunciation guides for local language terms (if applicable)

Format the response as a structured glossary with clear sections and explanations. Make it educational and useful for language learners.`;

        const geminiResult = await geminiModel.generateContent(prompt);
        const geminiResponse = await geminiResult.response;
        const glossary = geminiResponse.text();

        return NextResponse.json({
            success: true,
            glossary: glossary.trim(),
            language: languageType,
            recordCount: records.length,
        });
    } catch (error) {
        console.error("Error generating glossary:", error);
        return NextResponse.json(
            { error: "Failed to generate glossary" },
            { status: 500 }
        );
    }
}
