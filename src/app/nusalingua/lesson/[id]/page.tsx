"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    ArrowRight,
    Heart,
    Volume2,
    Check,
    X,
    RotateCcw,
    Home,
    Trophy,
    Star,
    Zap,
    Target,
    Clock,
    BookOpen,
    Sparkles,
    Award,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Exercise {
    id: number;
    type:
        | "multiple-choice"
        | "translation"
        | "audio"
        | "fill-blank"
        | "matching";
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    audioUrl?: string;
    explanation?: string;
    javanese?: string;
    english?: string;
    hint?: string;
}

const lessonData: { [key: string]: { title: string; exercises: Exercise[] } } =
    {
        "1": {
            title: "Greetings",
            exercises: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: 'How do you say "Good morning" in Javanese?',
                    options: [
                        "Sugeng enjing",
                        "Sugeng sonten",
                        "Sugeng dalu",
                        "Sugeng siang",
                    ],
                    correctAnswer: "Sugeng enjing",
                    explanation:
                        "Sugeng enjing is used for morning greetings in Javanese.",
                    hint: "Think about the time of day when the sun rises",
                },
                {
                    id: 2,
                    type: "translation",
                    question: "Translate to English:",
                    javanese: "Piye kabare?",
                    correctAnswer: "How are you?",
                    explanation:
                        "This is a common way to ask about someone's condition in Javanese.",
                    hint: "This is asking about someone's well-being",
                },
                {
                    id: 3,
                    type: "fill-blank",
                    question: 'Complete the greeting: "Sugeng _____, Pak!"',
                    correctAnswer: "enjing",
                    explanation:
                        'This completes the morning greeting "Good morning, Sir!"',
                    hint: "What time of day is it when you wake up?",
                },
                {
                    id: 4,
                    type: "multiple-choice",
                    question: 'What does "Matur nuwun" mean?',
                    options: [
                        "Good morning",
                        "Thank you",
                        "Goodbye",
                        "How are you?",
                    ],
                    correctAnswer: "Thank you",
                    explanation:
                        "Matur nuwun is the polite way to say thank you in Javanese.",
                    hint: "This is an expression of gratitude",
                },
                {
                    id: 5,
                    type: "matching",
                    question:
                        "Match the Javanese greetings with their English meanings:",
                    correctAnswer: [
                        "Sugeng enjing - Good morning",
                        "Sugeng siang - Good afternoon",
                        "Sugeng dalu - Good night",
                    ],
                    explanation:
                        "These are the basic time-based greetings in Javanese.",
                    hint: "Match each greeting with the appropriate time of day",
                },
            ],
        },
        "4": {
            title: "Food & Drink",
            exercises: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: 'What is "nasi" in English?',
                    options: ["Water", "Rice", "Chicken", "Vegetables"],
                    correctAnswer: "Rice",
                    explanation:
                        "Nasi is the Javanese word for rice, a staple food.",
                    hint: "This is the main staple food in Indonesia",
                },
                {
                    id: 2,
                    type: "translation",
                    question: "Translate to Javanese:",
                    english: "I want to eat",
                    correctAnswer: "Aku arep mangan",
                    explanation:
                        "This expresses the desire to eat in Javanese.",
                    hint: "Express your intention to have a meal",
                },
                {
                    id: 3,
                    type: "fill-blank",
                    question: 'Complete: "Aku _____ banyu" (I drink water)',
                    correctAnswer: "ngombe",
                    explanation: 'Ngombe means "to drink" in Javanese.',
                    hint: "What action do you do with water?",
                },
            ],
        },
    };

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;

    const [currentExercise, setCurrentExercise] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hearts, setHearts] = useState(5);
    const [xpEarned, setXpEarned] = useState(0);
    const [lessonComplete, setLessonComplete] = useState(false);
    const [matchingPairs, setMatchingPairs] = useState<string[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [streak, setStreak] = useState(0);
    const [animateXP, setAnimateXP] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);

    const lesson = lessonData[lessonId];
    const exercise = lesson?.exercises[currentExercise];

    useEffect(() => {
        if (animateXP) {
            const timer = setTimeout(() => setAnimateXP(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [animateXP]);

    useEffect(() => {
        if (animateHeart) {
            const timer = setTimeout(() => setAnimateHeart(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [animateHeart]);

    if (!lesson) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800 to-gray-900/80" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Card className="bg-gray-900/80 backdrop-blur-md border-orange-700/30 max-w-md w-full mx-4">
                        <CardContent className="p-8 text-center">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                            <h1 className="text-2xl font-bold text-orange-100 mb-4">
                                Lesson not found
                            </h1>
                            <p className="text-orange-200 mb-6">
                                The lesson you're looking for doesn't exist or
                                has been moved.
                            </p>
                            <Link href="/nusalingua">
                                <Button className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Lessons
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleAnswer = () => {
        let correct = false;

        if (exercise.type === "multiple-choice") {
            correct = selectedAnswer === exercise.correctAnswer;
        } else if (
            exercise.type === "translation" ||
            exercise.type === "fill-blank"
        ) {
            correct =
                selectedAnswer.toLowerCase().trim() ===
                (exercise.correctAnswer as string).toLowerCase().trim();
        } else if (exercise.type === "matching") {
            correct =
                matchingPairs.length ===
                (exercise.correctAnswer as string[]).length;
        }

        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setXpEarned((prev) => prev + 10);
            setStreak((prev) => prev + 1);
            setAnimateXP(true);
        } else {
            setHearts((prev) => Math.max(0, prev - 1));
            setStreak(0);
            setAnimateHeart(true);
        }
    };

    const nextExercise = () => {
        if (currentExercise < lesson.exercises.length - 1) {
            setCurrentExercise((prev) => prev + 1);
            setSelectedAnswer("");
            setShowResult(false);
            setMatchingPairs([]);
            setShowHint(false);
        } else {
            setLessonComplete(true);
        }
    };

    const renderExercise = () => {
        switch (exercise.type) {
            case "multiple-choice":
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Badge className="bg-blue-100 text-blue-800 mb-4">
                                Multiple Choice
                            </Badge>
                            <h2 className="text-2xl font-bold text-orange-100 mb-6">
                                {exercise.question}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {exercise.options?.map((option, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        selectedAnswer === option
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`p-6 h-auto text-base text-left justify-start transition-all duration-300 transform hover:scale-105 ${
                                        selectedAnswer === option
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg"
                                            : "border-orange-300 text-orange-200 hover:bg-white bg-gray-800/40 backdrop-blur-sm"
                                    }`}
                                    onClick={() => setSelectedAnswer(option)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                selectedAnswer === option
                                                    ? "border-white bg-white"
                                                    : "border-orange-300"
                                            }`}
                                        >
                                            {selectedAnswer === option && (
                                                <div className="w-3 h-3 rounded-full bg-blue-600" />
                                            )}
                                        </div>
                                        <span className="flex-1">{option}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case "translation":
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Badge className="bg-purple-100 text-purple-800 mb-4">
                                Translation
                            </Badge>
                            <h2 className="text-2xl font-bold text-orange-100 mb-6">
                                {exercise.question}
                            </h2>
                        </div>

                        {exercise.javanese && (
                            <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30 backdrop-blur-sm">
                                <CardContent className="p-8 text-center">
                                    <div className="flex items-center justify-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-700 rounded-full flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-800">
                                            Javanese
                                        </Badge>
                                    </div>
                                    <p className="text-3xl font-bold text-orange-100 mb-4">
                                        {exercise.javanese}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        className="text-orange-300 hover:text-orange-200 hover:bg-orange-900/20"
                                    >
                                        <Volume2 className="w-4 h-4 mr-2" />
                                        Play pronunciation
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {exercise.english && (
                            <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 backdrop-blur-sm">
                                <CardContent className="p-8 text-center">
                                    <div className="flex items-center justify-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            English
                                        </Badge>
                                    </div>
                                    <p className="text-3xl font-bold text-orange-100">
                                        {exercise.english}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <div className="relative">
                            <input
                                type="text"
                                value={selectedAnswer}
                                onChange={(e) =>
                                    setSelectedAnswer(e.target.value)
                                }
                                className="w-full p-6 bg-gray-800/60 border-2 border-orange-700/30 rounded-xl text-orange-100 placeholder-orange-300 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                placeholder="Type your answer here..."
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Sparkles className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                    </div>
                );

            case "fill-blank":
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Badge className="bg-green-100 text-green-800 mb-4">
                                Fill in the Blank
                            </Badge>
                            <h2 className="text-2xl font-bold text-orange-100 mb-6">
                                {exercise.question}
                            </h2>
                        </div>

                        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
                            <CardContent className="p-8 text-center">
                                <div className="text-2xl font-bold text-orange-100 mb-4">
                                    Complete the sentence
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Clock className="w-5 h-5 text-green-400" />
                                    <span className="text-green-300">
                                        Think carefully!
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="relative">
                            <input
                                type="text"
                                value={selectedAnswer}
                                onChange={(e) =>
                                    setSelectedAnswer(e.target.value)
                                }
                                className="w-full p-6 bg-gray-800/60 border-2 border-orange-700/30 rounded-xl text-orange-100 placeholder-orange-300 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                placeholder="Fill in the blank..."
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Target className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                    </div>
                );

            case "matching":
                const pairs = [
                    "Sugeng enjing - Good morning",
                    "Sugeng siang - Good afternoon",
                    "Sugeng dalu - Good night",
                ];
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                                Matching
                            </Badge>
                            <h2 className="text-2xl font-bold text-orange-100 mb-6">
                                {exercise.question}
                            </h2>
                        </div>

                        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                    <span className="text-yellow-300">
                                        Select all correct pairs
                                    </span>
                                </div>
                                <p className="text-sm text-orange-200">
                                    {matchingPairs.length} of {pairs.length}{" "}
                                    selected
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-3">
                            {pairs.map((pair, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        matchingPairs.includes(pair)
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`p-6 h-auto text-left justify-start transition-all duration-300 transform hover:scale-105 ${
                                        matchingPairs.includes(pair)
                                            ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg"
                                            : "border-orange-300 text-orange-200 hover:bg-orange-900/20 bg-gray-800/40 backdrop-blur-sm"
                                    }`}
                                    onClick={() => {
                                        if (matchingPairs.includes(pair)) {
                                            setMatchingPairs((prev) =>
                                                prev.filter((p) => p !== pair)
                                            );
                                        } else {
                                            setMatchingPairs((prev) => [
                                                ...prev,
                                                pair,
                                            ]);
                                        }
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                matchingPairs.includes(pair)
                                                    ? "border-white bg-white"
                                                    : "border-orange-300"
                                            }`}
                                        >
                                            {matchingPairs.includes(pair) && (
                                                <Check className="w-4 h-4 text-green-600" />
                                            )}
                                        </div>
                                        <span className="flex-1">{pair}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return <div>Exercise type not implemented</div>;
        }
    };

    if (lessonComplete) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800 to-gray-900/80" />
                    {/* Celebration particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${1 + Math.random()}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 max-w-md w-full mx-4 overflow-hidden relative transform animate-bounce">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        <CardContent className="p-8 text-center relative z-10">
                            <div className="mb-6">
                                <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-300 animate-pulse" />
                                <div className="flex justify-center space-x-1 mb-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-8 h-8 text-yellow-300 fill-current animate-pulse"
                                            style={{
                                                animationDelay: `${i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold mb-2">
                                Lesson Complete!
                            </h1>
                            <p className="text-green-100 mb-6">
                                Outstanding work on "{lesson.title}"!
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <Zap className="w-5 h-5 text-yellow-300" />
                                        <span className="font-bold text-yellow-300">
                                            +{xpEarned}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-100">
                                        XP Earned
                                    </p>
                                </div>
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-blue-300" />
                                        <span className="font-bold text-blue-300">
                                            {streak}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-100">
                                        Streak
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/nusalingua">
                                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                                        <Home className="w-4 h-4 mr-2" />
                                        Back to Lessons
                                    </Button>
                                </Link>
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                                    onClick={() => {
                                        setCurrentExercise(0);
                                        setSelectedAnswer("");
                                        setShowResult(false);
                                        setLessonComplete(false);
                                        setXpEarned(0);
                                        setMatchingPairs([]);
                                        setStreak(0);
                                    }}
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Practice Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900 to-gray-900/95" />
                {/* Floating background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                    />
                    <div
                        className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
                        style={{ animationDelay: "2s" }}
                    />
                </div>
            </div>

            <div className="relative z-10">
                {/* Enhanced Header */}
                <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-700/50 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/nusalingua">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-orange-200 hover:text-orange-100 hover:bg-orange-900/20"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Exit Lesson
                                    </Button>
                                </Link>
                                <div className="flex-1 max-w-md">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <BookOpen className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm text-orange-200">
                                            {lesson.title}
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            ((currentExercise + 1) /
                                                lesson.exercises.length) *
                                            100
                                        }
                                        className="h-3 bg-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Heart
                                        className={`w-5 h-5 text-red-500 ${
                                            animateHeart ? "animate-bounce" : ""
                                        }`}
                                    />
                                    <span className="text-orange-100 font-semibold">
                                        {hearts}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Zap
                                        className={`w-5 h-5 text-yellow-500 ${
                                            animateXP ? "animate-pulse" : ""
                                        }`}
                                    />
                                    <span className="text-orange-100 font-semibold">
                                        {xpEarned}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target className="w-5 h-5 text-blue-500" />
                                    <span className="text-orange-100 font-semibold">
                                        {currentExercise + 1} /{" "}
                                        {lesson.exercises.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Exercise Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30 min-h-[600px] shadow-2xl">
                            <CardContent className="p-8">
                                {renderExercise()}
                            </CardContent>
                        </Card>

                        {/* Hint Card */}
                        {exercise.hint && (
                            <Card className="mt-4 bg-blue-900/40 backdrop-blur-md border-blue-700/30">
                                <CardContent className="p-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowHint(!showHint)}
                                        className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 w-full justify-start"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        {showHint ? "Hide Hint" : "Show Hint"}
                                    </Button>
                                    {showHint && (
                                        <p className="text-blue-200 mt-2 pl-6">
                                            💡 {exercise.hint}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Result Feedback */}
                        {showResult && (
                            <Card
                                className={`mt-6 border-0 transform transition-all duration-500 ${
                                    isCorrect
                                        ? "bg-gradient-to-r from-green-600 to-emerald-700 animate-pulse"
                                        : "bg-gradient-to-r from-red-600 to-pink-700"
                                } text-white shadow-2xl`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                isCorrect
                                                    ? "bg-white/20"
                                                    : "bg-white/20"
                                            }`}
                                        >
                                            {isCorrect ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <X className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-2xl font-bold">
                                                {isCorrect
                                                    ? "Excellent!"
                                                    : "Not quite right"}
                                            </span>
                                            {isCorrect && (
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Zap className="w-4 h-4 text-yellow-300" />
                                                    <span className="text-yellow-300 font-bold">
                                                        +10 XP
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {exercise.explanation && (
                                        <div className="bg-white/10 rounded-lg p-4 mt-4">
                                            <p className="text-sm opacity-90">
                                                <strong>Explanation:</strong>{" "}
                                                {exercise.explanation}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-between">
                            <Button
                                variant="outline"
                                className="border-orange-300 text-orange-200 hover:bg-orange-900/20 bg-transparent backdrop-blur-sm"
                                disabled={currentExercise === 0}
                                onClick={() => {
                                    setCurrentExercise((prev) => prev - 1);
                                    setSelectedAnswer("");
                                    setShowResult(false);
                                    setMatchingPairs([]);
                                    setShowHint(false);
                                }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            {!showResult ? (
                                <Button
                                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8 transform hover:scale-105 transition-all duration-300"
                                    onClick={handleAnswer}
                                    disabled={
                                        !selectedAnswer &&
                                        matchingPairs.length === 0
                                    }
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Check Answer
                                </Button>
                            ) : (
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 transform hover:scale-105 transition-all duration-300"
                                    onClick={nextExercise}
                                >
                                    {currentExercise <
                                    lesson.exercises.length - 1 ? (
                                        <>
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Complete Lesson
                                            <Trophy className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
