"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    BookOpen,
    Brain,
    Cpu,
    Globe,
    Languages,
    MapPin,
    Play,
    Sparkles,
    Users,
    Wifi,
    Menu,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Animation states
    const [visibleElements, setVisibleElements] = useState<Set<string>>(
        new Set()
    );
    const [featuresInView, setFeaturesInView] = useState(false);
    const [ctaInView, setCtaInView] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const elementId = entry.target.getAttribute("data-animate");
                    if (elementId) {
                        setVisibleElements(
                            (prev) => new Set([...prev, elementId])
                        );
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll("[data-animate]");
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Separate observer for features section
    useEffect(() => {
        const featuresObserver = new IntersectionObserver(
            ([entry]) => {
                setFeaturesInView(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (featuresRef.current) {
            featuresObserver.observe(featuresRef.current);
        }

        return () => featuresObserver.disconnect();
    }, []);

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-900 to-amber-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-orange-800 transition-all duration-300">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                            <Image
                                src="/suara-nusa.png"
                                alt=""
                                width={50}
                                height={50}
                                className="rounded-lg"
                            />
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-orange-100">
                            Suara Nusa
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link
                            href="/home"
                            className="text-orange-200 hover:text-orange-400 transition-all duration-300 hover:scale-105"
                        >
                            Home
                        </Link>
                        <Link
                            href="/nusalingua"
                            className="text-orange-200 hover:text-orange-400 transition-all duration-300 hover:scale-105"
                        >
                            Nusalingua
                        </Link>
                        <Link
                            href="/nusapedia"
                            className="text-orange-200 hover:text-orange-400 transition-all duration-300 hover:scale-105"
                        >
                            Nusapedia
                        </Link>
                        <Link
                            href="/nusatech"
                            className="text-orange-200 hover:text-orange-400 transition-all duration-300 hover:scale-105"
                        >
                            Nusatech
                        </Link>
                        <Button className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white text-sm lg:text-base px-4 lg:px-6 transform hover:scale-105 transition-all duration-300">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-orange-200 hover:text-orange-400 transition-all duration-300 transform hover:scale-110"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden bg-gray-900/95 backdrop-blur-md border-t border-orange-800 transition-all duration-300 ${
                        mobileMenuOpen
                            ? "max-h-64 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Link
                            href="/home"
                            className="block text-orange-200 hover:text-orange-400 transition-colors py-2 transform hover:translate-x-2 duration-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/nusalingua"
                            className="block text-orange-200 hover:text-orange-400 transition-colors py-2 transform hover:translate-x-2 duration-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Nusalingua
                        </Link>
                        <Link
                            href="/nusapedia"
                            className="block text-orange-200 hover:text-orange-400 transition-colors py-2 transform hover:translate-x-2 duration-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Nusapedia
                        </Link>
                        <Link
                            href="/nusatech"
                            className="block text-orange-200 hover:text-orange-400 transition-colors py-2 transform hover:translate-x-2 duration-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Nusatech
                        </Link>
                        <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white mt-4 transform hover:scale-105 transition-all duration-300">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <section
                ref={heroRef}
                className="relative h-screen w-full flex items-center justify-center overflow-hidden"
            >
                {/* Parallax Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        transform: `translateY(${scrollY * 0.5}px)`,
                    }}
                >
                    <Image
                        src="/bali-beach.jpg"
                        alt="Indonesian Cultural Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-transparent to-amber-950/60" />
                </div>

                {/* Floating Elements with Enhanced Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 left-8 w-16 h-16 sm:w-20 sm:h-20 bg-orange-600/20 rounded-full blur-xl animate-pulse"
                        style={{
                            transform: `translateY(${scrollY * 0.2}px) rotate(${
                                scrollY * 0.1
                            }deg)`,
                            animationDelay: "0s",
                        }}
                    />
                    <div
                        className="absolute top-40 right-8 w-24 h-24 sm:w-32 sm:h-32 bg-amber-600/15 rounded-full blur-2xl animate-pulse"
                        style={{
                            transform: `translateY(${scrollY * 0.3}px) rotate(${
                                -scrollY * 0.1
                            }deg)`,
                            animationDelay: "1s",
                        }}
                    />
                    <div
                        className="absolute bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-orange-700/20 rounded-full blur-xl animate-pulse"
                        style={{
                            transform: `translateY(${
                                scrollY * 0.15
                            }px) rotate(${scrollY * 0.05}deg)`,
                            animationDelay: "2s",
                        }}
                    />
                </div>

                {/* Hero Content with Staggered Animation */}
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge
                        className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-800/80 to-amber-800/80 text-orange-200 border-orange-600 text-xs sm:text-sm animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Discover Indonesian Heritage
                    </Badge>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent leading-tight animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                    >
                        Suara Nusa
                    </h1>

                    <p
                        className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 animate-fade-in-up"
                        style={{ animationDelay: "0.6s" }}
                    >
                        Immerse yourself in Indonesia's rich cultural tapestry
                        through interactive learning, comprehensive knowledge,
                        and cutting-edge IoT experiences
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 animate-fade-in-up"
                        style={{ animationDelay: "0.8s" }}
                    >
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
                            onClick={scrollToFeatures}
                        >
                            Explore Features
                            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-orange-400 text-orange-200 hover:bg-orange-800/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent transform hover:scale-105 transition-all duration-300"
                        >
                            <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                            Watch Demo
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                ref={featuresRef}
                id="features"
                className="py-12 sm:py-16 lg:py-20 relative bg-gray-900/90"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header with Animation */}
                    <div
                        className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
                            featuresInView
                                ? "opacity-100 transform translate-y-0"
                                : "opacity-0 transform translate-y-10"
                        }`}
                        data-animate="features-header"
                    >
                        <Badge className="mb-4 bg-orange-800/60 text-orange-200 border-orange-600 text-xs sm:text-sm">
                            Three Pillars of Learning
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-orange-100 px-4">
                            Experience Indonesia Like Never Before
                        </h2>
                        <p className="text-lg sm:text-xl text-orange-200 max-w-3xl mx-auto px-4">
                            From interactive language learning to immersive
                            cultural experiences, discover the beauty of
                            Indonesian heritage through modern technology
                        </p>
                    </div>

                    {/* Feature Cards with Staggered Animation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                        {/* Language Learning Feature - Slide from Left */}
                        <Card
                            className={`group hover:shadow-2xl transition-all duration-700 border border-orange-700/30 bg-gradient-to-br from-orange-800/40 to-amber-800/40 hover:scale-105 backdrop-blur-sm ${
                                featuresInView
                                    ? "opacity-100 transform translate-x-0"
                                    : "opacity-0 transform -translate-x-20"
                            }`}
                            style={{
                                transitionDelay: featuresInView ? "0.2s" : "0s",
                            }}
                            data-animate="feature-1"
                        >
                            <CardHeader className="text-center pb-4 px-4 sm:px-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                                    <Languages className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl sm:text-2xl text-orange-100">
                                    Nusalingua
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base text-orange-200">
                                    Master local Indonesian languages like
                                    Javanese through gamified lessons
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6">
                                <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src="/culture.avif"
                                        alt="Language Learning"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <ul className="space-y-2 text-sm text-orange-300">
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Brain className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                                        <span>
                                            Interactive, engaging lessons
                                        </span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Users className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                                        <span>Community-driven learning</span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Sparkles className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                                        <span>Gamified progress tracking</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Knowledge Base Feature - Slide from Bottom */}
                        <Card
                            className={`group hover:shadow-2xl transition-all duration-700 border border-orange-700/30 bg-gradient-to-br from-orange-800/40 to-amber-800/40 hover:scale-105 backdrop-blur-sm ${
                                featuresInView
                                    ? "opacity-100 transform translate-y-0"
                                    : "opacity-0 transform translate-y-20"
                            }`}
                            style={{
                                transitionDelay: featuresInView ? "0.4s" : "0s",
                            }}
                            data-animate="feature-2"
                        >
                            <CardHeader className="text-center pb-4 px-4 sm:px-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl sm:text-2xl text-orange-100">
                                    Nusapedia
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base text-orange-200">
                                    Comprehensive Wikipedia-style database of
                                    Indonesian culture and heritage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6">
                                <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src="/culture2.avif"
                                        alt="Cultural Knowledge"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <ul className="space-y-2 text-sm text-orange-300">
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Globe className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                                        <span>
                                            Comprehensive cultural database
                                        </span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <MapPin className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                                        <span>
                                            Regional heritage exploration
                                        </span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <BookOpen className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                                        <span>Expert-curated content</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* IoT Dashboard Feature - Slide from Right */}
                        <Card
                            className={`group hover:shadow-2xl transition-all duration-700 border border-orange-700/30 bg-gradient-to-br from-orange-800/40 to-amber-800/40 hover:scale-105 backdrop-blur-sm ${
                                featuresInView
                                    ? "opacity-100 transform translate-x-0"
                                    : "opacity-0 transform translate-x-20"
                            }`}
                            style={{
                                transitionDelay: featuresInView ? "0.6s" : "0s",
                            }}
                            data-animate="feature-3"
                        >
                            <CardHeader className="text-center pb-4 px-4 sm:px-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                                    <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl sm:text-2xl text-orange-100">
                                    Nusatech
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base text-orange-200">
                                    Real-time cultural language translation
                                    through connected IoT devices
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6">
                                <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src="/iot.jpg"
                                        alt="IoT Dashboard"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <ul className="space-y-2 text-sm text-orange-300">
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Wifi className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                                        <span>
                                            Live translation capabilities
                                        </span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Cpu className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                                        <span>Smart IoT integration</span>
                                    </li>
                                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                                        <Languages className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                                        <span>Multi-language support</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section with Parallax and Animation */}
            <section
                className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
                data-animate="cta-section"
            >
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        transform: `translateY(${scrollY * 0.3}px)`,
                    }}
                >
                    <Image
                        src="/placeholder.svg?height=600&width=1920&text=Indonesian+Sunset"
                        alt="Indonesian Sunset"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-950/90 to-amber-950/90" />
                </div>

                <div
                    className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
                        visibleElements.has("cta-section")
                            ? "opacity-100 transform translate-y-0 scale-100"
                            : "opacity-0 transform translate-y-10 scale-95"
                    }`}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
                        Ready to Explore Indonesian Culture?
                    </h2>
                    <p className="text-lg sm:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Join thousands of learners discovering the rich heritage
                        of Indonesia through our innovative platform combining
                        tradition with technology.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-orange-100 text-orange-900 hover:bg-orange-200 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                        >
                            Start Learning Today
                            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-orange-300 text-orange-100 hover:bg-orange-800/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent transform hover:scale-105 transition-all duration-300"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer with Animation */}
            <footer
                className="bg-gray-950 text-orange-100 py-8 sm:py-12 border-t border-orange-800/30"
                data-animate="footer"
            >
                <div
                    className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
                        visibleElements.has("footer")
                            ? "opacity-100 transform translate-y-0"
                            : "opacity-0 transform translate-y-10"
                    }`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-700 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                    <Image
                                        src="/suara-nusa.png"
                                        alt=""
                                        width={50}
                                        height={50}
                                        className="rounded-lg"
                                    />
                                </div>
                                <span className="text-lg sm:text-xl font-bold">
                                    Suara Nusa
                                </span>
                            </div>
                            <p className="text-sm sm:text-base text-orange-300">
                                Preserving and sharing Indonesian cultural
                                heritage through innovative technology.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-sm sm:text-base">
                                Features
                            </h3>
                            <ul className="space-y-2 text-sm text-orange-300">
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Language Learning
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Cultural Database
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    IoT Integration
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Community
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-sm sm:text-base">
                                Resources
                            </h3>
                            <ul className="space-y-2 text-sm text-orange-300">
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Documentation
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    API Reference
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Support
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Blog
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-sm sm:text-base">
                                Connect
                            </h3>
                            <ul className="space-y-2 text-sm text-orange-300">
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Contact Us
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Community
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Social Media
                                </li>
                                <li className="hover:text-orange-200 transition-colors duration-300 cursor-pointer">
                                    Newsletter
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-orange-800/30 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-orange-400">
                        <p>&copy; 2024 Suara Nusa. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
