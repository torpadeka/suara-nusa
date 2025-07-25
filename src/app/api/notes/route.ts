import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Text is required and must be a string" },
                { status: 400 }
            );
        }

        const now = new Date();
        const dateKey = now.toISOString().split("T")[0]; // YYYY-MM-DD format

        const newNote = {
            text: text.trim(),
            timestamp: now.toISOString(),
            dateKey: dateKey,
        };

        const notesRef = collection(db, "notes");
        const docRef = await addDoc(notesRef, newNote);

        return NextResponse.json({
            success: true,
            note: { ...newNote, id: docRef.id },
            message: "Note received successfully",
        });
    } catch (error) {
        console.error("Error processing note:", error);
        return NextResponse.json(
            { error: "Failed to process note" },
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

        const notesRef = collection(db, "notes");
        const q = query(
            notesRef,
            where("dateKey", "==", targetDate),
            orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            dateKey: doc.data().dateKey,
        }));

        return NextResponse.json({
            notes,
            count: notes.length,
            date: targetDate,
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json(
            { error: "Failed to fetch notes" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const dateParam = url.searchParams.get("date");

        const notesRef = collection(db, "notes");
        let q;

        if (dateParam) {
            // Delete notes for specific date
            q = query(notesRef, where("dateKey", "==", dateParam));
        } else {
            // Delete all notes for user
            q = query(notesRef);
        }

        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((doc) =>
            deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);

        return NextResponse.json({
            success: true,
            message: dateParam
                ? `Notes for ${dateParam} cleared`
                : "All notes cleared",
        });
    } catch (error) {
        console.error("Error clearing notes:", error);
        return NextResponse.json(
            { error: "Failed to clear notes" },
            { status: 500 }
        );
    }
}
