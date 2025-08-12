// app/stillinger/(sok)/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    // TODO: IMPLEMENT ERROR PAGE
    useEffect(() => {
        console.error("Search page error:", error);
    }, [error]);

    return (
        <div className="p-4">
            <h2>Noe gikk galt ved lasting av søkeresultater</h2>
            <p>Vennligst prøv igjen senere</p>
            <button onClick={() => reset()} className="bg-blue-500 text-white px-4 py-2 rounded">
                Prøv igjen
            </button>
        </div>
    );
}
