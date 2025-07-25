"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeft,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Crown,
    FlameIcon as Fire,
    Globe,
    Heart,
    Lock,
    Play,
    Star,
    Trophy,
    Zap,
    Volume2,
    Target,
} from "lucide-react";
import Link from "next/link";

interface Lesson {
    id: number;
    title: string;
    description: string;
    type: "basic" | "story" | "practice" | "test";
    completed: boolean;
    locked: boolean;
    stars: number;
    xp: number;
    position: { x: number; y: number };
}

interface Level {
    id: number;
    title: string;
    description: string;
    theme: string;
    backgroundImage: string;
    color: string;
    lessons: Lesson[];
    completed: boolean;
}

export default function NusalinguaPage() {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(12);
    const [totalXP, setTotalXP] = useState(2450);
    const [hearts, setHearts] = useState(5);
    const [playerLevel, setPlayerLevel] = useState(8);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const levels: Level[] = [
        {
            id: 1,
            title: "Village Greetings",
            description:
                "Learn basic Javanese greetings in a traditional village setting",
            theme: "Traditional Village",
            backgroundImage: "/bg-nusalingua-1.jpg",
            color: "from-blue-500 to-indigo-600",
            completed: true,
            lessons: [
                {
                    id: 1,
                    title: "Morning Greetings",
                    description: "Sugeng enjing, Pak!",
                    type: "basic",
                    completed: true,
                    locked: false,
                    stars: 3,
                    xp: 50,
                    position: { x: 50, y: 85 },
                },
                {
                    id: 2,
                    title: "Family Names",
                    description: "Bapak, Ibu, Anak",
                    type: "basic",
                    completed: true,
                    locked: false,
                    stars: 3,
                    xp: 50,
                    position: { x: 25, y: 70 },
                },
                {
                    id: 3,
                    title: "Polite Expressions",
                    description: "Matur nuwun, Nuwun sewu",
                    type: "basic",
                    completed: true,
                    locked: false,
                    stars: 2,
                    xp: 40,
                    position: { x: 75, y: 55 },
                },
                {
                    id: 4,
                    title: "Village Story",
                    description: "Meet Pak Budi and Bu Sari",
                    type: "story",
                    completed: true,
                    locked: false,
                    stars: 3,
                    xp: 75,
                    position: { x: 40, y: 40 },
                },
                {
                    id: 5,
                    title: "Level 1 Test",
                    description: "Test your village knowledge",
                    type: "test",
                    completed: true,
                    locked: false,
                    stars: 3,
                    xp: 100,
                    position: { x: 60, y: 25 },
                },
            ],
        },
        {
            id: 2,
            title: "Market & Food",
            description:
                "Explore traditional Javanese cuisine and market conversations",
            theme: "Traditional Market",
            backgroundImage: "/bg-nusalingua-2.jpg",
            color: "from-emerald-500 to-teal-600",
            completed: false,
            lessons: [
                {
                    id: 6,
                    title: "Market Greetings",
                    description: "Shopping conversations",
                    type: "basic",
                    completed: true,
                    locked: false,
                    stars: 3,
                    xp: 50,
                    position: { x: 30, y: 85 },
                },
                {
                    id: 7,
                    title: "Food Names",
                    description: "Nasi, sayur, iwak",
                    type: "basic",
                    completed: true,
                    locked: false,
                    stars: 2,
                    xp: 40,
                    position: { x: 70, y: 70 },
                },
                {
                    id: 8,
                    title: "Ordering Food",
                    description: "Aku arep tuku...",
                    type: "basic",
                    completed: false,
                    locked: false,
                    stars: 0,
                    xp: 0,
                    position: { x: 25, y: 55 },
                },
                {
                    id: 9,
                    title: "Numbers & Prices",
                    description: "Counting and bargaining",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 75, y: 40 },
                },
                {
                    id: 10,
                    title: "Market Story",
                    description: "A day at Malioboro",
                    type: "story",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 50, y: 25 },
                },
            ],
        },
        {
            id: 3,
            title: "Royal Palace",
            description: "Discover Javanese culture and royal traditions",
            theme: "Kraton Culture",
            backgroundImage: "/bg-nusalingua-3.jpg",
            color: "from-purple-500 to-pink-600",
            completed: false,
            lessons: [
                {
                    id: 11,
                    title: "Royal Greetings",
                    description: "Formal Javanese language",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 50, y: 85 },
                },
                {
                    id: 12,
                    title: "Traditional Arts",
                    description: "Wayang, gamelan, batik",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 20, y: 70 },
                },
                {
                    id: 13,
                    title: "Ceremonies",
                    description: "Royal traditions",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 80, y: 55 },
                },
                {
                    id: 14,
                    title: "Palace Story",
                    description: "Legend of Sultan",
                    type: "story",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 35, y: 40 },
                },
                {
                    id: 15,
                    title: "Culture Master",
                    description: "Final cultural test",
                    type: "test",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 65, y: 25 },
                },
            ],
        },
        {
            id: 4,
            title: "Modern Java",
            description: "Contemporary Javanese in modern settings",
            theme: "Modern City",
            backgroundImage: "/bg-nusalingua-4.jpg",
            color: "from-orange-500 to-red-600",
            completed: false,
            lessons: [
                {
                    id: 16,
                    title: "City Life",
                    description: "Urban conversations",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 45, y: 85 },
                },
                {
                    id: 17,
                    title: "Technology",
                    description: "Modern terms in Javanese",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 25, y: 70 },
                },
                {
                    id: 18,
                    title: "Future Plans",
                    description: "Talking about goals",
                    type: "basic",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 75, y: 55 },
                },
                {
                    id: 19,
                    title: "Modern Story",
                    description: "Young Javanese today",
                    type: "story",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 40, y: 40 },
                },
                {
                    id: 20,
                    title: "Master Test",
                    description: "Complete mastery",
                    type: "test",
                    completed: false,
                    locked: true,
                    stars: 0,
                    xp: 0,
                    position: { x: 60, y: 25 },
                },
            ],
        },
    ];

    const navigateLevel = (direction: "left" | "right") => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        if (direction === "right" && currentLevel < levels.length - 1) {
            setCurrentLevel((prev) => prev + 1);
        } else if (direction === "left" && currentLevel > 0) {
            setCurrentLevel((prev) => prev - 1);
        }

        setTimeout(() => setIsTransitioning(false), 500);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case "story":
                return BookOpen;
            case "practice":
                return Target;
            case "test":
                return Trophy;
            default:
                return Play;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case "story":
                return "from-purple-500 to-pink-600";
            case "practice":
                return "from-green-500 to-emerald-600";
            case "test":
                return "from-yellow-500 to-orange-600";
            default:
                return "from-blue-500 to-indigo-600";
        }
    };

    const currentLevelData = levels[currentLevel];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Parallax Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
                    style={{
                        backgroundImage: `url('${currentLevelData.backgroundImage}')`,
                        transform: `translateX(${currentLevel * -10}px)`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90" />

                {/* Parallax overlay elements */}
                <div
                    className="absolute inset-0 opacity-20 transition-transform duration-700 ease-out"
                    style={{
                        transform: `translateX(${currentLevel * -20}px)`,
                    }}
                >
                    <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-700/50 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-orange-100">
                                        Nusalingua
                                    </span>
                                </div>
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

                            {/* Stats */}
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Fire className="w-5 h-5 text-orange-500" />
                                    <span className="text-orange-100 font-semibold">
                                        {currentStreak}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    <span className="text-orange-100 font-semibold">
                                        {totalXP}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="text-orange-100 font-semibold">
                                        {hearts}
                                    </span>
                                </div>
                                <Avatar className="w-8 h-8 border-2 border-orange-300">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                    <AvatarFallback className="bg-orange-200 text-orange-800 text-sm">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Learning Area */}
                        <div className="lg:col-span-3">
                            {/* Level Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => navigateLevel("left")}
                                    disabled={
                                        currentLevel === 0 || isTransitioning
                                    }
                                    className="text-orange-200 hover:text-orange-100 hover:bg-orange-900/20"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>

                                <div className="text-center flex-1">
                                    <h1 className="text-3xl font-bold text-orange-100 mb-2">
                                        {currentLevelData.title}
                                    </h1>
                                    <p className="text-orange-200 mb-4">
                                        {currentLevelData.description}
                                    </p>

                                    {/* Level Progress Dots */}
                                    <div className="flex justify-center space-x-2">
                                        {levels.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                    index === currentLevel
                                                        ? "bg-orange-500 scale-125"
                                                        : index < currentLevel
                                                        ? "bg-green-500"
                                                        : "bg-gray-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => navigateLevel("right")}
                                    disabled={
                                        currentLevel === levels.length - 1 ||
                                        isTransitioning
                                    }
                                    className="text-orange-200 hover:text-orange-100 hover:bg-orange-900/20"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Level Theme Badge */}
                            <div className="text-center mb-8">
                                <Badge
                                    className={`bg-gradient-to-r ${currentLevelData.color} text-white border-0 px-4 py-2 text-sm`}
                                >
                                    {currentLevelData.theme}
                                </Badge>
                            </div>

                            {/* Learning Path Visualization */}
                            <div
                                className={`relative bg-gradient-to-b from-gray-900/30 to-gray-900/80 rounded-2xl p-8 min-h-[700px] overflow-hidden transition-all duration-500 ${
                                    isTransitioning
                                        ? "opacity-50 scale-95"
                                        : "opacity-100 scale-100"
                                }`}
                            >
                                {/* Lesson Nodes */}
                                {currentLevelData.lessons.map(
                                    (lesson, index) => {
                                        const Icon = getIconForType(
                                            lesson.type
                                        );
                                        const colorClass = getColorForType(
                                            lesson.type
                                        );

                                        return (
                                            <div
                                                key={lesson.id}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                                                style={{
                                                    left: `${lesson.position.x}%`,
                                                    top: `${lesson.position.y}%`,
                                                    zIndex: 10,
                                                }}
                                            >
                                                <div className="flex flex-col items-center space-y-3">
                                                    {/* Lesson Circle */}
                                                    <Link
                                                        href={
                                                            lesson.locked
                                                                ? "#"
                                                                : lesson.id ===
                                                                  1
                                                                ? `/nusalingua/lesson/${lesson.id}`
                                                                : "#"
                                                        }
                                                    >
                                                        <div
                                                            className={`
                                                            w-20 h-20 rounded-full flex items-center justify-center cursor-pointer
                                                            transition-all duration-300 hover:scale-110 relative shadow-lg
                                                            ${
                                                                lesson.locked
                                                                    ? "bg-gray-600 opacity-50"
                                                                    : lesson.completed
                                                                    ? `bg-gradient-to-br ${colorClass} shadow-xl`
                                                                    : `bg-gradient-to-br ${colorClass} shadow-xl animate-pulse`
                                                            }
                                                        `}
                                                        >
                                                            {lesson.locked ? (
                                                                <Lock className="w-7 h-7 text-gray-400" />
                                                            ) : (
                                                                <Icon className="w-7 h-7 text-white" />
                                                            )}

                                                            {/* Stars for completed lessons */}
                                                            {lesson.completed &&
                                                                lesson.stars >
                                                                    0 && (
                                                                    <div className="absolute -top-3 -right-3 flex">
                                                                        {[
                                                                            ...Array(
                                                                                lesson.stars
                                                                            ),
                                                                        ].map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="w-4 h-4 text-yellow-400 fill-current"
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}

                                                            {/* Glow effect for current lesson */}
                                                            {!lesson.locked &&
                                                                !lesson.completed && (
                                                                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                                                                )}
                                                        </div>
                                                    </Link>

                                                    {/* Lesson Info */}
                                                    <div className="text-center max-w-28 px-2">
                                                        <h3 className="text-xs font-semibold text-orange-100 mb-1 leading-tight">
                                                            {lesson.title}
                                                        </h3>
                                                        <p className="text-xs text-orange-300 mb-2 leading-tight line-clamp-2">
                                                            {lesson.description}
                                                        </p>
                                                        {lesson.completed && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-green-100 text-green-800 text-xs px-2 py-0"
                                                            >
                                                                +{lesson.xp} XP
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Progress Card */}
                            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Crown className="w-5 h-5" />
                                        <span className="font-semibold">
                                            Level {playerLevel}
                                        </span>
                                    </div>
                                    <Progress value={65} className="h-3 mb-2" />
                                    <p className="text-sm opacity-90">
                                        350 XP to next level
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Current Level Info */}
                            <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div
                                            className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentLevelData.color}`}
                                        />
                                        <span className="font-semibold text-orange-100">
                                            Current World
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-orange-100 mb-2">
                                        {currentLevelData.title}
                                    </h3>
                                    <p className="text-sm text-orange-200 mb-4">
                                        {currentLevelData.description}
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-orange-200">
                                                Lessons Completed
                                            </span>
                                            <span className="text-orange-100">
                                                {
                                                    currentLevelData.lessons.filter(
                                                        (l) => l.completed
                                                    ).length
                                                }{" "}
                                                /{" "}
                                                {
                                                    currentLevelData.lessons
                                                        .length
                                                }
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                (currentLevelData.lessons.filter(
                                                    (l) => l.completed
                                                ).length /
                                                    currentLevelData.lessons
                                                        .length) *
                                                100
                                            }
                                            className="h-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Daily Goal */}
                            <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Target className="w-5 h-5 text-orange-600" />
                                        <span className="font-semibold text-orange-100">
                                            Daily Goal
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-orange-200">
                                                XP Earned Today
                                            </span>
                                            <span className="text-orange-100">
                                                120 / 200
                                            </span>
                                        </div>
                                        <Progress value={60} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-orange-100 mb-4">
                                        Quick Practice
                                    </h3>
                                    <div className="space-y-3">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            Pronunciation Practice
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full border-orange-300 text-orange-200 hover:bg-orange-900/20 bg-transparent"
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Review Vocabulary
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
