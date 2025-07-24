"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore/lite";

interface City {
    name: string; // Adjust based on your Firestore data structure
    // Add other fields as needed
}

export default function Cities() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getCities() {
            try {
                const citiesCol = collection(db, "cities");
                const citySnapshot = await getDocs(citiesCol);
                const cityList = citySnapshot.docs.map(
                    (doc) => doc.data() as City
                );
                setCities(cityList);
            } catch (err) {
                setError("Failed to fetch cities");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        getCities();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Cities</h2>
            <ul>
                {cities.map((city, index) => (
                    <li key={index}>{city.name}</li> // Adjust based on your data structure
                ))}
            </ul>
        </div>
    );
}
