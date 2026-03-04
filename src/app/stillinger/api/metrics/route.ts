import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { appLogger } from "@/app/_common/logging/appLogger";

const METRICS_URL = process.env.ARBEIDSPLASSEN_METRICS_API_URL;

export const dynamic = "force-dynamic";

const payloadSchema = z.object({
    eventName: z.union([z.literal("Vurdering - Sokeresultat"), z.literal("Valg - Cookie samtykke")]),
    eventData: z.record(z.string(), z.string()),
});

type Payload = z.infer<typeof payloadSchema>;

function isBotUserAgent(userAgent: string): boolean {
    return /googlebot|applebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i.test(
        userAgent.toLowerCase(),
    );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!METRICS_URL) {
        return NextResponse.json({ ok: true, skipped: "missing-url" }, { status: 200 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    if (isBotUserAgent(userAgent)) {
        return NextResponse.json({ ok: true, skipped: "bot" }, { status: 200 });
    }

    const json: unknown = await request.json().catch(() => null);

    const parsed = payloadSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "invalid-payload" }, { status: 400 });
    }

    const payload: Payload = parsed.data;

    const event = {
        eventId: uuidv4(),
        createdAt: new Date().toISOString(),
        eventName: payload.eventName,
        eventData: {
            ...payload.eventData,
            userAgent,
        },
    };

    try {
        await fetch(METRICS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });
        return NextResponse.json({ ok: true }, { status: 202 });
    } catch (error) {
        appLogger.warnWithCause("Error recording metric", error);
        return NextResponse.json({ ok: false, error: "upstream-failed" }, { status: 202 });
    }
}
