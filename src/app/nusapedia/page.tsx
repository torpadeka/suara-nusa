"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dynamic from "next/dynamic";
import { SwiperComponent } from "./components/SwiperComponent";
import {
    Province,
    Kingdom,
    ColonialEvent,
    DetailData,
    MarkerData,
    SidebarData,
    ChatMessage,
} from "./components/types";

// Define MapComponent props for dynamic import
interface MapComponentProps {
    mapCenter: [number, number];
    mapZoom: number;
    selectedShape: Kingdom | null;
    visibleMarkers: MarkerData[];
    onMarkerClick: (item: MarkerData) => void;
}

// Dynamically import MapComponent with SSR disabled and typed props
const MapComponent = dynamic<MapComponentProps>(
    () => import("./components/MapComponent").then((mod) => mod.MapComponent),
    { ssr: false }
);

// Define interface for Swiper items
interface SwiperItem {
    judul?: string;
    nama?: string;
    deskripsi?: string;
    url_gambar?: string;
    pic?: string;
}

export default function NusapediaPage() {
    // State with TypeScript types
    const [era, setEra] = useState<"sekarang" | "penjajahan" | "kerajaan">("sekarang");
    const [year, setYear] = useState<number>(2025);
    const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("raja");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
    const [colonialEvents, setColonialEvents] = useState<ColonialEvent[]>([]);
    const [visibleMarkers, setVisibleMarkers] = useState<MarkerData[]>([]);
    const [allData, setAllData] = useState<{
        kerajaan: Kingdom[];
        penjajahan: ColonialEvent[];
        sekarang: Province[];
    }>({
        kerajaan: [],
        penjajahan: [],
        sekarang: [],
    });
    const [detailData, setDetailData] = useState<DetailData>({});
    const [kingdomDetail, setKingdomDetail] = useState<DetailData[keyof DetailData] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5, 118.0]);
    const [mapZoom, setMapZoom] = useState<number>(5);
    const [selectedShape, setSelectedShape] = useState<Kingdom | null>(null);
    const [userMessage, setUserMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    // Gemini AI setup
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [provinsiRes, kerajaanRes, penjajahanRes, detailRes] = await Promise.all([
                    fetch("/provinsi.json").then((res) => res.json()),
                    fetch("/kerajaan.json").then((res) => res.json()),
                    fetch("/penjajahan.json").then((res) => res.json()),
                    fetch("/detail_kerajaan.json").then((res) => res.json()),
                ]);
                console.log("Fetched provinsi:", provinsiRes);
                console.log("Fetched kerajaan:", kerajaanRes);
                console.log("Fetched penjajahan:", penjajahanRes);
                console.log("Fetched detail_kerajaan:", detailRes);
                setProvinces(provinsiRes);
                setKingdoms(kerajaanRes);
                setColonialEvents(penjajahanRes);
                setDetailData(detailRes);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // Update visible markers based on era and year
    useEffect(() => {
        let markers: MarkerData[] = [];
        if (era === "sekarang") {
            markers = provinces
                .filter((p) => p.id != null && p.id !== "")
                .map((p) => ({ ...p, type: "provinsi" } as MarkerData));
        } else if (era === "kerajaan") {
            markers = kingdoms
                .filter((k) => year >= k.mulai && year <= k.akhir && k.id != null && k.id !== "")
                .map((k) => ({ ...k, type: "kerajaan" } as MarkerData));
        } else if (era === "penjajahan") {
            markers = colonialEvents
                .filter((e) => year >= e.tahun && e.id != null && e.id !== "")
                .map((e) => ({ ...e, type: "penjajahan" } as MarkerData));
        }
        console.log(`Visible markers for era ${era}:`, markers);
        setVisibleMarkers(markers);
    }, [era, year, provinces, kingdoms, colonialEvents]);

    // Handlers
    const handleMarkerClick = async (item: MarkerData) => {
        setIsSidebarOpen(true);
        setMapCenter([item.lat, item.lng]);
        setMapZoom(9);

        const title = item.provinsi || item.nama || item.peristiwa || "";

        if (item.type === "kerajaan" && item.wilayah) {
            const kingdom = kingdoms.find((k) => k.id === item.id);
            const detail = detailData[item.id] || null;
            if (kingdom) {
                setSelectedShape(kingdom);
            } else {
                setSelectedShape(null);
            }
            setKingdomDetail(detail);
            setActiveTab("raja");
            setSidebarData({
                title,
                data: kingdom || null,
                status: kingdom ? "success" : "not_found",
                type: "kerajaan",
            });
        } else if (item.type === "penjajahan") {
            const matchedData = colonialEvents.find((e) => e.id === item.id) || null;
            setSelectedShape(null);
            setKingdomDetail(null);
            setActiveTab("peristiwa");
            setSidebarData({
                title,
                data: matchedData,
                status: matchedData ? "success" : "not_found",
                type: "penjajahan",
            });
        } else if (item.type === "provinsi") {
            const province = provinces.find((p) => p.id === item.id);
            setSelectedShape(null);
            setKingdomDetail(null);
            if (province) {
                setActiveTab("pakaian_tradisional");
                setSidebarData({
                    title,
                    data: province,
                    status: "success",
                    type: "provinsi",
                });
            } else {
                setSidebarData({
                    title,
                    data: null,
                    status: "not_found",
                    type: "provinsi",
                });
            }
        }

        console.log("Sidebar data set:", { title, data: sidebarData?.data, kingdomDetail });
    };

    const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newEra = e.target.value as "sekarang" | "penjajahan" | "kerajaan";
        setEra(newEra);
        setIsSidebarOpen(false);
        setKingdomDetail(null);
        if (newEra === "kerajaan") setYear(1300);
        if (newEra === "penjajahan") setYear(1800);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const userInput = userMessage.trim();
        setChatHistory([...chatHistory, { sender: "user", message: userInput }]);
        setUserMessage("");

        try {
            const contextualPrompt = `
        Kamu adalah asisten sejarah interaktif. 
        Saat ini pengguna sedang melihat informasi tentang "${sidebarData?.title || ""}".
        Berikan jawaban seputar kerajaan tersebut berdasarkan pertanyaan berikut:
        "${userInput}"
        Berikan singkat saja gausah bertele tele. Straight to the point karena keterbatasan box
      `;
            const result = await model.generateContent(contextualPrompt);
            const response = result.response.text();
            setChatHistory((prev) => [...prev, { sender: "gemini", message: response }]);
        } catch (err) {
            setChatHistory((prev) => [...prev, { sender: "gemini", message: "Maaf, terjadi kesalahan." }]);
            console.error("Error:", err);
        }
    };

    const getEraDescription = (year: number): string => {
        if (year >= 300 && year <= 699) return "Era Awal Kerajaan Hindu-Buddha (Abad 4–7 M)";
        if (year >= 700 && year <= 1099) return "Era Kejayaan Maritim & Agraris (Abad 7–11 M)";
        if (year >= 1100 && year <= 1499) return "Puncak Kerajaan Jawa & Transisi (Abad 12–15 M)";
        if (year >= 1500 && year <= 1699) return "Era Awal Kesultanan Islam (Abad 15–17 M)";
        if (year >= 1700 && year <= 1900) return "Masa Kesultanan Besar & Awal Kolonial (Abad 18–19 M)";
        return "Periode Tidak Diketahui";
    };

    // Type guard for Province
    const isProvince = (data: Province | Kingdom | ColonialEvent | null): data is Province => {
        return !!data && "provinsi" in data && "ibukota" in data;
    };

    // Type guard for ColonialEvent
    const isColonialEvent = (data: Province | Kingdom | ColonialEvent | null): data is ColonialEvent => {
        return !!data && "peristiwa" in data && "penjajah" in data;
    };

    // Type guard for Kingdom
    const isKingdom = (data: Province | Kingdom | ColonialEvent | null): data is Kingdom => {
        return !!data && "nama" in data && "mulai" in data && "akhir" in data;
    };

    return (
        <div className="flex h-screen w-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside
                className={`absolute top-0 left-0 h-full bg-white shadow-lg z-[1001] transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } w-full md:w-1/3 lg:w-1/4`}
            >
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-3 right-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
                >
                    ×
                </button>
                {sidebarData && (
                    <div className="p-6 h-full overflow-y-auto">
                        <div className="flex-1">
                            {sidebarData.status === "unsupported" && (
                                <p className="text-center text-gray-500">Info detail tidak tersedia untuk item ini.</p>
                            )}
                            {sidebarData.status === "success" && sidebarData.data && (
                                <>
                                    {sidebarData.type === "kerajaan" && isKingdom(sidebarData.data) && (
                                        <>
                                            <h2 className="text-2xl font-bold text-gray-800 p-3">
                                                Kerajaan {sidebarData.title}
                                            </h2>
                                            <div className="flex border-b mb-4">
                                                {[
                                                    { id: "raja", label: "Raja Berkuasa" },
                                                    { id: "pencapaian", label: "Pencapaian" },
                                                    { id: "keruntuhan", label: "Perang & Keruntuhan" },
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`flex-1 py-2 text-sm font-medium transition-colors duration-300 ease-in-out cursor-pointer
                              ${activeTab === tab.id ? "bg-white text-blue-600 border-b-2 border-blue-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {kingdomDetail && (
                                                <SwiperComponent
                                                    items={(kingdomDetail[activeTab as keyof typeof kingdomDetail] as SwiperItem[]) || []}
                                                    activeTab={activeTab}
                                                />
                                            )}
                                        </>
                                    )}
                                    {sidebarData.type === "penjajahan" && isColonialEvent(sidebarData.data) && (
                                        <div className="p-4 space-y-4">
                                            <h2 className="text-2xl font-bold text-gray-800">{sidebarData.data.peristiwa}</h2>
                                            <img
                                                src={sidebarData.data.pic}
                                                alt={sidebarData.data.peristiwa}
                                                className="w-full h-64 object-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="text-gray-700 space-y-1">
                                                <p>
                                                    <span className="font-semibold">Penjajah:</span> {sidebarData.data.penjajah}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Tahun:</span> {sidebarData.data.tahun}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed mt-2">{sidebarData.data.deskripsi_singkat}</p>
                                        </div>
                                    )}
                                    {sidebarData.type === "provinsi" && isProvince(sidebarData.data) && (
                                        <>
                                            <h2 className="text-2xl font-bold text-gray-800 p-3">Provinsi {sidebarData.title}</h2>
                                            {sidebarData.data.pic && (
                                                <div className="w-full flex justify-center mb-4">
                                                    <img
                                                        src={sidebarData.data.pic}
                                                        alt={`Provinsi ${sidebarData.title}`}
                                                        className="w-full h-full object-cover rounded-xl shadow"
                                                    />
                                                </div>
                                            )}
                                            {sidebarData.data.deskripsi_singkat && (
                                                <p className="text-sm text-gray-700 px-4 pb-4">{sidebarData.data.deskripsi_singkat}</p>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-6 text-sm text-gray-800">
                                                <div>
                                                    <strong>Ibu Kota:</strong> {sidebarData.data.ibukota}
                                                </div>
                                                <div>
                                                    <strong>Total Kecamatan:</strong> {sidebarData.data.total_kecamatan}
                                                </div>
                                                <div>
                                                    <strong>Jumlah Kota:</strong> {sidebarData.data.total_kabupaten_kota.kota}
                                                </div>
                                                <div>
                                                    <strong>Kabupaten Administratif:</strong>{" "}
                                                    {sidebarData.data.total_kabupaten_kota.kabupaten_administratif}
                                                </div>
                                                <div>
                                                    <strong>Gubernur:</strong> {sidebarData.data.gubernur}
                                                </div>
                                                <div>
                                                    <strong>Wakil Gubernur:</strong> {sidebarData.data.wakil_gubernur}
                                                </div>
                                            </div>
                                            <div className="flex border-b mb-4">
                                                {[
                                                    { id: "pakaian_tradisional", label: "Pakaian Tradisional" },
                                                    { id: "makanan_tradisional", label: "Makanan Tradisional" },
                                                    { id: "lagu_tradisional", label: "Lagu Daerah" },
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`flex-1 py-2 text-sm font-medium transition-colors duration-300 ease-in-out cursor-pointer
                              ${activeTab === tab.id ? "bg-white text-blue-600 border-b-2 border-blue-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <SwiperComponent
                                                items={(sidebarData.data[activeTab as keyof typeof sidebarData.data] as SwiperItem[]) || []}
                                                activeTab={activeTab}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="border-t pt-4 px-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Tanya tentang {sidebarData.title}</h3>
                            <div className="h-40 overflow-y-auto border rounded-md p-2 mb-2 bg-gray-50 text-sm text-gray-800">
                                {chatHistory.map((chat, idx) => (
                                    <div key={idx} className="mb-1">
                                        <strong>{chat.sender === "user" ? "Kamu" : "NusaBot"}:</strong> {chat.message}
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    placeholder="Type something..."
                                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white p-4 shadow-md z-10 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label htmlFor="era-select" className="font-bold">Select Era:</label>
                        <select
                            id="era-select"
                            value={era}
                            onChange={handleEraChange}
                            className="p-2 border rounded-md cursor-pointer"
                        >
                            <option value="sekarang">Modern Era</option>
                            <option value="penjajahan">Colonial Era</option>
                            <option value="kerajaan">Kingdom Era</option>
                        </select>
                    </div>
                    {era === "kerajaan" && (
                        <div className="flex flex-col gap-1 w-full md:w-1/2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Year: {year} CE</span>
                                <input
                                    type="range"
                                    min="350"
                                    max="1900"
                                    step="50"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full cursor-pointer"
                                />
                            </div>
                            <div className="text-sm text-gray-600">{getEraDescription(year)}</div>
                        </div>
                    )}
                    {era === "penjajahan" && (
                        <div className="flex items-center gap-2 w-full md:w-1/2">
                            <span>Year: {year}</span>
                            <input
                                type="range"
                                min="1550"
                                max="1980"
                                value={year}
                                step="100"
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full cursor-pointer"
                            />
                        </div>
                    )}
                </header>
                <div className="flex-1">
                    <MapComponent
                        mapCenter={mapCenter}
                        mapZoom={mapZoom}
                        selectedShape={selectedShape}
                        visibleMarkers={visibleMarkers}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>
            </main>
        </div>
    );
}