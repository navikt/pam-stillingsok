import { NextRequest, NextResponse } from "next/server";

const FAST_API_APP_ID_PROD = "41fb84fd-4ff3-43f4-b7e0-d84444fb2f91";
const FAST_API_APP_ID_DEV = "501ec40e-4010-4cb4-ad13-61ab529dd765";

export async function POST(req: NextRequest) {
    const allowedOrigins = ["https://arbeidsplassen.intern.dev.nav.no", "https://arbeidsplassen.nav.no"];

    const origin = req.headers.get("origin");
    if (!origin || !allowedOrigins.includes(origin)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { url_host, url_path, url_query, event_name } = await req.json();

        const appId = process.env.NODE_ENV === "production" ? FAST_API_APP_ID_PROD : FAST_API_APP_ID_DEV;

        if (!appId) {
            return NextResponse.json({ error: "Missing API ID" }, { status: 500 });
        }

        const response = await fetch("https://fastapi.nav.no/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                app_id: appId,
                url_host,
                url_path,
                url_query,
                event_name,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send event to Fast API");
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Fast API Server Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
