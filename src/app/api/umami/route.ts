import { NextRequest, NextResponse } from "next/server";

interface UmamiEvent {
    event: string;
    data?: Record<string, any>;
}

export async function POST(req: NextRequest) {
    console.log("INSIES");
    try {
        // Get the raw text from the request
        const text = await req.text();
        console.log("INSIES222", text);

        // Try to parse the JSON
        let body: UmamiEvent;
        try {
            body = JSON.parse(text);
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        // Validate the structure
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { event, data } = body;
        if (!event) {
            return NextResponse.json({ error: "Event is required" }, { status: 400 });
        }

        // Get referer from headers
        const referer = req.headers.get("referer");
        if (!referer) {
            return NextResponse.json({ error: "Referer header is required" }, { status: 400 });
        }

        // Create payload
        const payload = {
            type: "event",
            payload: {
                website: process.env.UMAMI_WEBSITE_ID,
                hostname: new URL(referer).hostname,
                url: referer,
                event_name: event,
                event_data: data || {},
            },
        };

        // Send to Umami
        console.log("BEFORE SEND");
        const umamiUrl = process.env.UMAMI_API_URL;
        if (!umamiUrl) {
            return NextResponse.json({ error: "UMAMI_API_URL is not configured" }, { status: 500 });
        }

        try {
            // await fetch(umamiUrl, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Accept: "application/json",
            //     },
            //     body: JSON.stringify(payload),
            // });

            return NextResponse.json({ success: true });
        } catch (fetchError) {
            console.error("Error sending event to Umami:", fetchError);
            return NextResponse.json({ error: "Failed to send event to Umami" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing Umami event:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
