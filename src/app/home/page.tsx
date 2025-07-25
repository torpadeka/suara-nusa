"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BookOpen,
    Brain,
    Calendar,
    ChevronRight,
    Clock,
    Crown,
    FlameIcon as Fire,
    Globe,
    Languages,
    MapPin,
    Play,
    Radio,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Wifi,
    Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [streakCount, setStreakCount] = useState(7);
    const [todayProgress, setTodayProgress] = useState(65);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Selamat Pagi"; // Good Morning
        if (hour < 17) return "Selamat Siang"; // Good Afternoon
        return "Selamat Malam"; // Good Evening
    };

    const culturalQuotes = [
        "Bhinneka Tunggal Ika - Unity in Diversity",
        "Gotong Royong - Working Together for Common Good",
        "Tepa Selira - Empathy and Understanding",
        "Budi Pekerti - Noble Character and Good Deeds",
    ];

    const [dailyQuote, setDailyQuote] = useState("");

    useEffect(() => {
        setDailyQuote(
            culturalQuotes[Math.floor(Math.random() * culturalQuotes.length)]
        );
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Dark Blurred Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800 to-gray-900/80"
                    style={{
                        backgroundImage: "url('/home-bg.png')",
                    }}
                />
            </div>
            {/* Content Container */}
            <div className="relative z-10">
                {/* Header */}
                <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-700/50 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl flex items-center justify-center">
                                <Image
                                    src="/suara-nusa.png"
                                    alt=""
                                    width={50}
                                    height={50}
                                    className="rounded-lg"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-orange-100">
                                    Suara Nusa
                                </h1>
                                <p className="text-sm text-white">
                                    Cultural Learning Hub
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
                                <Fire className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-orange-800">
                                    {streakCount} day streak!
                                </span>
                            </div>
                            <Avatar className="w-10 h-10 border-2 border-orange-300">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback className="bg-orange-200 text-orange-800">
                                    JD
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Welcome Section */}
                    <section className="text-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-orange-100">
                                {getGreeting()}, Joko! 👋
                            </h2>
                            <p className="text-lg text-orange-200">
                                Ready to explore Indonesian culture today?
                            </p>
                        </div>

                        {/* Daily Quote */}
                        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0 hover:scale-105 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                            <CardContent className="p-6 text-center relative z-10">
                                <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                <p className="text-lg font-medium italic">
                                    "{dailyQuote}"
                                </p>
                                <p className="text-sm opacity-80 mt-2">
                                    Indonesian Wisdom of the Day
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Progress Overview */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 hover:scale-105 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-5 h-5 text-blue-200" />
                                        <span className="font-semibold text-white">
                                            Today's Goal
                                        </span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/20 text-white border-0"
                                    >
                                        {todayProgress}%
                                    </Badge>
                                </div>
                                <Progress
                                    value={todayProgress}
                                    className="h-3 mb-2"
                                />
                                <p className="text-sm text-blue-100">
                                    13 minutes left to reach your daily goal!
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 hover:scale-105 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-200" />
                                        <span className="font-semibold text-white">
                                            This Week
                                        </span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/20 text-white border-0"
                                    >
                                        +15%
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white">
                                            Lessons Completed
                                        </span>
                                        <span className="font-semibold text-white">
                                            24/30
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white">
                                            Cultural Articles
                                        </span>
                                        <span className="font-semibold text-white">
                                            8 read
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Crown className="w-5 h-5 text-purple-200" />
                                        <span className="font-semibold text-white">
                                            Achievements
                                        </span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/20 text-white border-0"
                                    >
                                        New!
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-1">
                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <Star className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                                            <Fire className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-sm text-purple-100">
                                        3 new badges earned!
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Main Navigation Cards */}
                    <section className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-orange-100 mb-2">
                                Continue Your Journey
                            </h3>
                            <p className="text-orange-200">
                                Choose your path to discover Indonesian heritage
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Belajar - Language Learning */}
                            <Link href="/nusalingua" className="group">
                                <Card className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                                    <CardHeader className="relative z-10 pb-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Languages className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">
                                            Nusalingua
                                        </CardTitle>
                                        <CardDescription className="text-blue-100">
                                            Master Indonesian regional languages
                                            through interactive lessons
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-blue-100">
                                                    Javanese Progress
                                                </span>
                                                <span className="font-semibold">
                                                    Level 3
                                                </span>
                                            </div>
                                            <Progress
                                                value={45}
                                                className="h-2"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-blue-200" />
                                                <span className="text-sm text-blue-100">
                                                    15 min lessons
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Jelajahi - Cultural Knowledge Base */}
                            <Link href="/nusapedia" className="group">
                                <Card className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                                    <CardHeader className="relative z-10 pb-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">
                                            Nusapedia
                                        </CardTitle>
                                        <CardDescription className="text-white">
                                            Explore the rich tapestry of
                                            Indonesian culture and traditions
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 text-emerald-200" />
                                                <span className="text-sm text-white">
                                                    34 Provinces • 1,340+
                                                    Articles
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-4 h-4 text-emerald-200" />
                                                <span className="text-sm text-white">
                                                    Community Contributions
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Sparkles className="w-4 h-4 text-emerald-200" />
                                                <span className="text-sm text-white">
                                                    Featured: Batik History
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Terhubung - IoT Dashboard */}
                            <Link href="/nusatech" className="group">
                                <Card className="h-full bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                                    <CardHeader className="relative z-10 pb-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Radio className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">
                                            Nusatech
                                        </CardTitle>
                                        <CardDescription className="text-purple-100">
                                            Connect with IoT devices for
                                            real-time cultural translations
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-purple-100">
                                                    2 devices connected
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Wifi className="w-4 h-4 text-purple-200" />
                                                <span className="text-sm text-purple-100">
                                                    Live translation ready
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Zap className="w-4 h-4 text-purple-200" />
                                                <span className="text-sm text-purple-100">
                                                    Smart features
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </section>

                    {/* Recent Activity & Quick Actions */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30 hover:shadow-2xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                    <span className="text-white">
                                        Recent Activity
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-blue-950 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Languages className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-100">
                                            Completed Javanese Lesson 12
                                        </p>
                                        <p className="text-xs text-orange-200">
                                            2 hours ago
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                    >
                                        +50 XP
                                    </Badge>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-emerald-950 rounded-lg">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-100">
                                            Read "Balinese Temple Architecture"
                                        </p>
                                        <p className="text-xs text-orange-200">
                                            Yesterday
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-100 text-emerald-800"
                                    >
                                        +25 XP
                                    </Badge>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-purple-950 rounded-lg">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Radio className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-100">
                                            Connected new IoT device
                                        </p>
                                        <p className="text-xs text-orange-200">
                                            3 days ago
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-800"
                                    >
                                        Setup
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions & Community */}
                        <Card className="bg-gray-900/60 backdrop-blur-md border-orange-700/30 hover:shadow-2xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Sparkles className="w-5 h-5 text-orange-600" />
                                    <span className="text-white">
                                        Quick Actions
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-950 bg-transparent"
                                    >
                                        <Play className="w-6 h-6 text-orange-600" />
                                        <span className="text-sm font-medium text-white">
                                            Daily Challenge
                                        </span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-950 bg-transparent"
                                    >
                                        <Users className="w-6 h-6 text-orange-600" />
                                        <span className="text-sm font-medium text-white">
                                            Community
                                        </span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-950 bg-transparent"
                                    >
                                        <Calendar className="w-6 h-6 text-orange-600" />
                                        <span className="text-sm font-medium text-white">
                                            Events
                                        </span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-950 bg-transparent"
                                    >
                                        <Brain className="w-6 h-6 text-orange-600" />
                                        <span className="text-sm font-medium text-white">
                                            Practice
                                        </span>
                                    </Button>
                                </div>

                                {/* Community Highlight */}
                                <div className="bg-gradient-to-r from-orange-800 to-amber-800 p-4 rounded-lg">
                                    <h4 className="font-semibold text-orange-100 mb-2">
                                        Community Spotlight
                                    </h4>
                                    <p className="text-sm text-orange-300 mb-3">
                                        Join the discussion about "Traditional
                                        Indonesian Music Instruments" with 234
                                        active participants!
                                    </p>
                                    <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        Join Discussion
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>{" "}
            {/* End content container */}
        </div> /* End main background */
    );
}
