"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Globe,
    Languages,
    Mic,
    Radio,
    Wifi,
    Calendar,
    RefreshCw,
    Trash2,
    BookOpen,
    Clock,
    MessageSquare,
    Volume2,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    X,
} from "lucide-react";
import Link from "next/link";

interface Note {
    id: string;
    text: string;
    timestamp: string;
    dateKey: string;
}

interface SpeechRecord {
    id: string;
    transcript: string;
    translation: string;
    timestamp: string;
    dateKey: string;
}

type DashboardType = "selection" | "english" | "local";

export default function NusatechPage() {
    const [currentView, setCurrentView] = useState<DashboardType>("selection");
    const [currentDate, setCurrentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [notes, setNotes] = useState<Note[]>([]);
    const [speechRecords, setSpeechRecords] = useState<SpeechRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [glossary, setGlossary] = useState<string>("");
    const [showGlossary, setShowGlossary] = useState(false);
    const [isGeneratingGlossary, setIsGeneratingGlossary] = useState(false);

    // Fetch data based on current view and date
    useEffect(() => {
        if (currentView === "english") {
            fetchNotes();
        } else if (currentView === "local") {
            fetchSpeechRecords();
        }
    }, [currentView, currentDate]);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/notes?date=${currentDate}`);
            const data = await response.json();
            setNotes(data.notes || []);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSpeechRecords = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/stt?date=${currentDate}`);
            const data = await response.json();
            setSpeechRecords(data.records || []);
        } catch (error) {
            console.error("Error fetching speech records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateGlossary = async () => {
        setIsGeneratingGlossary(true);
        try {
            const records = currentView === "english" ? notes : speechRecords;
            const language = currentView === "english" ? "english" : "local";

            const response = await fetch("/api/glossary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ records, language }),
            });

            const data = await response.json();
            if (data.success) {
                setGlossary(data.glossary);
                setShowGlossary(true);
            }
        } catch (error) {
            console.error("Error generating glossary:", error);
        } finally {
            setIsGeneratingGlossary(false);
        }
    };

    const clearDay = async () => {
        try {
            const endpoint =
                currentView === "english" ? "/api/notes" : "/api/stt";
            await fetch(`${endpoint}?date=${currentDate}`, {
                method: "DELETE",
            });
            if (currentView === "english") {
                fetchNotes();
            } else {
                fetchSpeechRecords();
            }
        } catch (error) {
            console.error("Error clearing day:", error);
        }
    };

    const navigateDate = (direction: "prev" | "next") => {
        const date = new Date(currentDate);
        if (direction === "prev") {
            date.setDate(date.getDate() - 1);
        } else {
            date.setDate(date.getDate() + 1);
        }
        setCurrentDate(date.toISOString().split("T")[0]);
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Selection Screen
    if (currentView === "selection") {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800 to-gray-900/80" />
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-700/50">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="w-full flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-700 rounded-lg flex items-center justify-center">
                                            <Radio className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xl font-bold text-orange-100">
                                            Nusatech
                                        </span>
                                    </div>
                                    <Link href="/home">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-orange-200 hover:text-orange-100"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Selection Content */}
                    <div className="container mx-auto px-4 py-16">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-orange-100 mb-4">
                                Choose Your Dashboard
                            </h1>
                            <p className="text-xl text-orange-200 max-w-2xl mx-auto">
                                Select which IoT translation dashboard you want
                                to access
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* English Dashboard */}
                            <Card
                                className="group cursor-pointer bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-500/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm overflow-hidden relative"
                                onClick={() => setCurrentView("english")}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                                <CardHeader className="relative z-10 text-center pb-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Globe className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-blue-100">
                                        International Dashboard
                                    </CardTitle>
                                    <p className="text-blue-200">
                                        Access your English speech-to-text
                                        translations and notes
                                    </p>
                                </CardHeader>

                                <CardContent className="relative z-10 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Mic className="w-5 h-5 text-blue-400" />
                                            <span className="text-blue-200">
                                                Real-time speech recognition
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MessageSquare className="w-5 h-5 text-blue-400" />
                                            <span className="text-blue-200">
                                                Text transcription & storage
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <BookOpen className="w-5 h-5 text-blue-400" />
                                            <span className="text-blue-200">
                                                Glossary generation
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                                        Access English Dashboard
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Local Languages Dashboard */}
                            <Card
                                className="group cursor-pointer bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm overflow-hidden relative"
                                onClick={() => setCurrentView("local")}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                                <CardHeader className="relative z-10 text-center pb-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Languages className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-orange-100">
                                        Local Languages Dashboard
                                    </CardTitle>
                                    <p className="text-orange-200">
                                        Access Javanese and other local
                                        Indonesian language translations
                                    </p>
                                </CardHeader>

                                <CardContent className="relative z-10 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Languages className="w-5 h-5 text-orange-400" />
                                            <span className="text-orange-200">
                                                Javanese speech recognition
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MessageSquare className="w-5 h-5 text-orange-400" />
                                            <span className="text-orange-200">
                                                Indonesian translation
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <BookOpen className="w-5 h-5 text-orange-400" />
                                            <span className="text-orange-200">
                                                Cultural glossary
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white">
                                        Access Local Dashboard
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard View
    const isEnglish = currentView === "english";
    const currentData = isEnglish ? notes : speechRecords;
    const dashboardTitle = isEnglish
        ? "English Dashboard"
        : "Local Languages Dashboard";
    const dashboardColor = isEnglish ? "blue" : "orange";

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800 to-gray-900/100" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header
                    className={`bg-gray-900/80 backdrop-blur-md border-b border-${dashboardColor}-700/50`}
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-8 h-8 bg-gradient-to-br from-${dashboardColor}-600 to-${
                                            dashboardColor === "blue"
                                                ? "indigo"
                                                : "amber"
                                        }-700 rounded-lg flex items-center justify-center`}
                                    >
                                        {isEnglish ? (
                                            <Globe className="w-5 h-5 text-white" />
                                        ) : (
                                            <Languages className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xl font-bold text-${dashboardColor}-100`}
                                    >
                                        {dashboardTitle}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className={`text-${dashboardColor}-200 hover:text-${dashboardColor}-100`}
                                onClick={() => setCurrentView("selection")}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Selection
                            </Button>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span
                                        className={`text-${dashboardColor}-200 text-sm`}
                                    >
                                        {isConnected
                                            ? "Connected"
                                            : "Disconnected"}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                        isEnglish
                                            ? fetchNotes
                                            : fetchSpeechRecords
                                    }
                                    disabled={isLoading}
                                    className={`border-${dashboardColor}-300 text-${dashboardColor}-200 hover:bg-${dashboardColor}-900/20`}
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 mr-2 ${
                                            isLoading ? "animate-spin" : ""
                                        }`}
                                    />
                                    Refresh
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateGlossary}
                                    disabled={
                                        isGeneratingGlossary ||
                                        currentData.length === 0
                                    }
                                    className={`border-${dashboardColor}-300 text-${dashboardColor}-200 hover:bg-${dashboardColor}-900/20`}
                                >
                                    <BookOpen
                                        className={`w-4 h-4 mr-2 ${
                                            isGeneratingGlossary
                                                ? "animate-pulse"
                                                : ""
                                        }`}
                                    />
                                    {isGeneratingGlossary
                                        ? "Generating..."
                                        : "Glosarium"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearDay}
                                    className={`border-red-300 text-red-200 hover:bg-red-900/20`}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear Day
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Date Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateDate("prev")}
                                className={`text-${dashboardColor}-200 hover:text-${dashboardColor}-100`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Older
                            </Button>
                            <div
                                className={`flex items-center space-x-2 px-4 py-2 bg-${dashboardColor}-900/20 rounded-lg`}
                            >
                                <Calendar
                                    className={`w-4 h-4 text-${dashboardColor}-400`}
                                />
                                <span
                                    className={`text-${dashboardColor}-100 font-semibold`}
                                >
                                    {formatDate(currentDate)}
                                </span>
                                {currentDate ===
                                    new Date().toISOString().split("T")[0] && (
                                    <Badge
                                        className={`bg-${dashboardColor}-600 text-white`}
                                    >
                                        Live
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateDate("next")}
                                disabled={
                                    currentDate >=
                                    new Date().toISOString().split("T")[0]
                                }
                                className={`text-${dashboardColor}-200 hover:text-${dashboardColor}-100`}
                            >
                                Newer
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Wifi
                                className={`w-4 h-4 text-${dashboardColor}-400`}
                            />
                            <span
                                className={`text-${dashboardColor}-200 text-sm`}
                            >
                                IoT Device Ready
                            </span>
                        </div>
                    </div>

                    {/* Notes/Records Display */}
                    <Card
                        className={`bg-gray-900/60 backdrop-blur-md border-${dashboardColor}-700/30 min-h-[500px]`}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    className={`text-${dashboardColor}-100 flex items-center space-x-2`}
                                >
                                    <MessageSquare
                                        className={`w-5 h-5 text-${dashboardColor}-400`}
                                    />
                                    <span>
                                        {isEnglish ? "Notes" : "Speech Records"}{" "}
                                        for Today
                                    </span>
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className={`bg-${dashboardColor}-100 text-${dashboardColor}-800`}
                                >
                                    {currentData.length}{" "}
                                    {isEnglish ? "notes" : "records"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {currentData.length === 0 ? (
                                <div className="text-center py-16">
                                    <div
                                        className={`w-16 h-16 bg-${dashboardColor}-900/20 rounded-full flex items-center justify-center mx-auto mb-4`}
                                    >
                                        <Calendar
                                            className={`w-8 h-8 text-${dashboardColor}-400`}
                                        />
                                    </div>
                                    <h3
                                        className={`text-lg font-semibold text-${dashboardColor}-100 mb-2`}
                                    >
                                        No {isEnglish ? "notes" : "records"}{" "}
                                        received today yet.
                                    </h3>
                                    <p className={`text-${dashboardColor}-300`}>
                                        Your IoT device will automatically send
                                        transcribed text here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentData.map((item, index) => (
                                        <Card
                                            key={item.id}
                                            className={`bg-${dashboardColor}-900/20 border-${dashboardColor}-700/30 hover:bg-${dashboardColor}-900/30 transition-colors duration-200`}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className={`w-8 h-8 bg-${dashboardColor}-600 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Clock
                                                                className={`w-4 h-4 text-${dashboardColor}-400`}
                                                            />
                                                            <span
                                                                className={`text-${dashboardColor}-300 text-sm`}
                                                            >
                                                                {formatTime(
                                                                    item.timestamp
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {!isEnglish && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={`text-${dashboardColor}-300 hover:text-${dashboardColor}-200`}
                                                        >
                                                            <Volume2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {isEnglish ? (
                                                    <div
                                                        className={`text-${dashboardColor}-100`}
                                                    >
                                                        <p className="leading-relaxed">
                                                            {
                                                                (item as Note)
                                                                    .text
                                                            }
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Languages className="w-4 h-4 text-orange-400" />
                                                                <span className="text-orange-300 text-sm font-semibold">
                                                                    Javanese
                                                                </span>
                                                            </div>
                                                            <p className="text-orange-100 bg-orange-900/20 p-3 rounded-lg">
                                                                {
                                                                    (
                                                                        item as SpeechRecord
                                                                    ).transcript
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Globe className="w-4 h-4 text-blue-400" />
                                                                <span className="text-blue-300 text-sm font-semibold">
                                                                    Indonesian
                                                                    Translation
                                                                </span>
                                                            </div>
                                                            <p className="text-blue-100 bg-blue-900/20 p-3 rounded-lg">
                                                                {
                                                                    (
                                                                        item as SpeechRecord
                                                                    )
                                                                        .translation
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Glossary Modal */}
                    {showGlossary && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <Card className="bg-gray-900/90 backdrop-blur-md border-orange-700/30 max-w-4xl w-full max-h-[80vh] overflow-hidden">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-orange-100 flex items-center space-x-2">
                                            <Sparkles className="w-5 h-5 text-orange-400" />
                                            <span>Generated Glossary</span>
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowGlossary(false)
                                            }
                                            className="text-orange-200 hover:text-orange-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="overflow-y-auto max-h-[60vh]">
                                    <div className="prose prose-invert max-w-none">
                                        <pre className="whitespace-pre-wrap text-orange-100 leading-relaxed">
                                            {glossary}
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
