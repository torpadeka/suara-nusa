"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
                },
                {
                    id: 2,
                    type: "translation",
                    question: "Translate to English:",
                    javanese: "Piye kabare?",
                    correctAnswer: "How are you?",
                    explanation:
                        "This is a common way to ask about someone's condition in Javanese.",
                },
                {
                    id: 3,
                    type: "fill-blank",
                    question: 'Complete the greeting: "Sugeng _____, Pak!"',
                    correctAnswer: "enjing",
                    explanation:
                        'This completes the morning greeting "Good morning, Sir!"',
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
                },
                {
                    id: 2,
                    type: "translation",
                    question: "Translate to Javanese:",
                    english: "I want to eat",
                    correctAnswer: "Aku arep mangan",
                    explanation:
                        "This expresses the desire to eat in Javanese.",
                },
                {
                    id: 3,
                    type: "fill-blank",
                    question: 'Complete: "Aku _____ banyu" (I drink water)',
                    correctAnswer: "ngombe",
                    explanation: 'Ngombe means "to drink" in Javanese.',
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

    const lesson = lessonData[lessonId];
    const exercise = lesson?.exercises[currentExercise];

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-orange-100 mb-4">
                        Lesson not found
                    </h1>
                    <Link href="/nusalingua">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            Back to Lessons
                        </Button>
                    </Link>
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
        } else {
            setHearts((prev) => Math.max(0, prev - 1));
        }
    };

    const nextExercise = () => {
        if (currentExercise < lesson.exercises.length - 1) {
            setCurrentExercise((prev) => prev + 1);
            setSelectedAnswer("");
            setShowResult(false);
            setMatchingPairs([]);
        } else {
            setLessonComplete(true);
        }
    };

    const renderExercise = () => {
        switch (exercise.type) {
            case "multiple-choice":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-orange-100 mb-6">
                            {exercise.question}
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {exercise.options?.map((option, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        selectedAnswer === option
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`p-4 h-auto text-base text-left justify-start ${
                                        selectedAnswer === option
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "border-orange-300 text-orange-200 hover:bg-orange-900/20 bg-black/50"
                                    }`}
                                    onClick={() => setSelectedAnswer(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case "translation":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-orange-100">
                            {exercise.question}
                        </h2>
                        {exercise.javanese && (
                            <div className="bg-gray-800/60 p-6 rounded-lg border border-orange-700/30">
                                <p className="text-3xl font-bold text-center text-orange-100">
                                    {exercise.javanese}
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-2 text-orange-300 hover:text-orange-200"
                                >
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Play audio
                                </Button>
                            </div>
                        )}
                        {exercise.english && (
                            <div className="bg-gray-800/60 p-6 rounded-lg border border-orange-700/30">
                                <p className="text-3xl font-bold text-center text-orange-100">
                                    {exercise.english}
                                </p>
                            </div>
                        )}
                        <input
                            type="text"
                            value={selectedAnswer}
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                            className="w-full p-4 bg-gray-800/60 border border-orange-700/30 rounded-lg text-orange-100 placeholder-orange-300"
                            placeholder="Type your answer here..."
                        />
                    </div>
                );

            case "fill-blank":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-orange-100">
                            {exercise.question}
                        </h2>
                        <input
                            type="text"
                            value={selectedAnswer}
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                            className="w-full p-4 bg-gray-800/60 border border-orange-700/30 rounded-lg text-orange-100 placeholder-orange-300"
                            placeholder="Fill in the blank..."
                        />
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
                        <h2 className="text-2xl font-bold text-orange-100">
                            {exercise.question}
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {pairs.map((pair, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        matchingPairs.includes(pair)
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`p-4 h-auto text-left justify-start ${
                                        matchingPairs.includes(pair)
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "border-orange-300 text-orange-200 hover:bg-orange-900/20"
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
                                    {pair}
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
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 max-w-md w-full mx-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 text-center relative z-10">
                            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                            <h1 className="text-3xl font-bold mb-2">
                                Lesson Complete!
                            </h1>
                            <p className="text-green-100 mb-6">
                                Great job on completing "{lesson.title}"
                            </p>

                            <div className="bg-white/20 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span>XP Earned:</span>
                                    <span className="font-bold text-yellow-300">
                                        +{xpEarned}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/nusalingua">
                                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                                        <Home className="w-4 h-4 mr-2" />
                                        Back to Lessons
                                    </Button>
                                </Link>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => {
                                        setCurrentExercise(0);
                                        setSelectedAnswer("");
                                        setShowResult(false);
                                        setLessonComplete(false);
                                        setXpEarned(0);
                                        setMatchingPairs([]);
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
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800 to-gray-900/80" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-700/50 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/nusalingua">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-orange-200 hover:text-orange-100"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Exit
                                    </Button>
                                </Link>
                                <div className="flex-1 max-w-md">
                                    <Progress
                                        value={
                                            ((currentExercise + 1) /
                                                lesson.exercises.length) *
                                            100
                                        }
                                        className="h-3"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="text-orange-100 font-semibold">
                                        {hearts}
                                    </span>
                                </div>
                                <div className="text-orange-100 font-semibold">
                                    {currentExercise + 1} /{" "}
                                    {lesson.exercises.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Exercise Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30 min-h-[500px]">
                            <CardContent className="p-8">
                                {renderExercise()}
                            </CardContent>
                        </Card>

                        {/* Result Feedback */}
                        {showResult && (
                            <Card
                                className={`mt-6 border-0 ${
                                    isCorrect ? "bg-green-600" : "bg-red-600"
                                } text-white`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        {isCorrect ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <X className="w-6 h-6" />
                                        )}
                                        <span className="text-xl font-bold">
                                            {isCorrect
                                                ? "Correct!"
                                                : "Incorrect"}
                                        </span>
                                        {isCorrect && (
                                            <span className="text-yellow-300 font-bold">
                                                +10 XP
                                            </span>
                                        )}
                                    </div>
                                    {exercise.explanation && (
                                        <p className="text-sm opacity-90">
                                            {exercise.explanation}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-between">
                            <Button
                                variant="outline"
                                className="border-orange-300 text-orange-200 hover:bg-orange-900/20 bg-transparent"
                                disabled={currentExercise === 0}
                                onClick={() => {
                                    setCurrentExercise((prev) => prev - 1);
                                    setSelectedAnswer("");
                                    setShowResult(false);
                                    setMatchingPairs([]);
                                }}
                            >
                                Previous
                            </Button>

                            {!showResult ? (
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleAnswer}
                                    disabled={
                                        !selectedAnswer &&
                                        matchingPairs.length === 0
                                    }
                                >
                                    Check Answer
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={nextExercise}
                                >
                                    {currentExercise <
                                    lesson.exercises.length - 1 ? (
                                        <>
                                            Next{" "}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        "Complete Lesson"
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
