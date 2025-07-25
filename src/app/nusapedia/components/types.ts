export interface Province {
    id: string;
    provinsi: string;
    lat: number;
    lng: number;
    ibukota: string;
    total_kecamatan: number;
    total_kabupaten_kota: {
        kota: number;
        kabupaten_administratif: number;
    };
    gubernur: string;
    wakil_gubernur: string;
    deskripsi_singkat?: string;
    pic?: string;
    pakaian_tradisional?: Array<{ nama: string; pic: string }>;
    makanan_tradisional?: Array<{ nama: string; pic: string }>;
    lagu_tradisional?: Array<{ nama: string; pic: string }>;
}

export interface Kingdom {
    id: string;
    nama: string;
    lat: number;
    lng: number;
    mulai: number;
    akhir: number;
    wilayah?: GeoJSON.GeoJsonObject;
}

export interface ColonialEvent {
    id: string;
    peristiwa: string;
    lat: number;
    lng: number;
    tahun: number;
    penjajah: string;
    deskripsi_singkat: string;
    pic: string;
}

export interface DetailData {
    [key: string]: {
        raja?: Array<{ judul: string; deskripsi: string; url_gambar: string }>;
        pencapaian?: Array<{
            judul: string;
            deskripsi: string;
            url_gambar: string;
        }>;
        keruntuhan?: Array<{
            judul: string;
            deskripsi: string;
            url_gambar: string;
        }>;
    };
}

export interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    type: "provinsi" | "kerajaan" | "penjajahan";
    provinsi?: string;
    nama?: string;
    peristiwa?: string;
    wilayah?: GeoJSON.GeoJsonObject;
    penjajah?: string;
    tahun?: number;
    deskripsi_singkat?: string;
    pic?: string;
}

export interface SidebarData {
    title: string;
    data: Province | Kingdom | ColonialEvent | null;
    status: "success" | "not_found" | "unsupported";
    type: "sekarang" | "kerajaan" | "penjajahan";
}

export interface ChatMessage {
    sender: "user" | "gemini";
    message: string;
}
