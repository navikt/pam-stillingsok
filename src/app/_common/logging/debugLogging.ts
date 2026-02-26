import { z } from "zod";

export type DebugSource = "non-production" | "env" | "client-override" | "disabled";

export type DebugDecision = Readonly<{
    readonly enabled: boolean;
    readonly source: DebugSource;
}>;

type ParsedEnvBoolean = Readonly<{ ok: true; value: boolean }> | Readonly<{ ok: false; error: string }>;

const EnvBooleanSchema = z.preprocess(
    (value) => {
        if (typeof value !== "string") {
            return value;
        }
        return value.trim().toLowerCase();
    },
    z.enum(["true", "false"]),
);

const toBoolean = (normalized: string): boolean => {
    if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") {
        return true;
    }
    return false;
};

export const parseEnvBoolean = (raw: string | undefined): ParsedEnvBoolean => {
    if (!raw) {
        return { ok: true, value: false };
    }

    const parsed = EnvBooleanSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            ok: false,
            error: `Ugyldig boolean env-verdi: "${raw}". Gyldige verdier: true/false, 1/0, yes/no, on/off.`,
        };
    }

    return { ok: true, value: toBoolean(parsed.data) };
};

type DecideInput = Readonly<{
    readonly nodeEnv: "development" | "production";
    readonly runtime: "server" | "client";
    readonly enableDebugLoggingEnv?: string | undefined;
    readonly clientQueryValue?: string | undefined;
    readonly clientLocalStorageValue?: string | undefined;
}>;

/**
 * Ren “beslutningsfunksjon” som er lett å teste.
 */
export const decideDebugLogging = (input: DecideInput): DebugDecision => {
    if (input.nodeEnv !== "production") {
        return { enabled: true, source: "non-production" };
    }

    if (input.runtime === "server") {
        const parsed = parseEnvBoolean(input.enableDebugLoggingEnv);
        if (parsed.ok) {
            return parsed.value ? { enabled: true, source: "env" } : { enabled: false, source: "disabled" };
        }
        return { enabled: false, source: "disabled" };
    }

    // client i prod: per-session override (valgfri)
    const queryEnabled = (input.clientQueryValue ?? "").trim().toLowerCase() === "true";
    if (queryEnabled) {
        return { enabled: true, source: "client-override" };
    }

    const localStorageEnabled = (input.clientLocalStorageValue ?? "").trim().toLowerCase() === "true";
    if (localStorageEnabled) {
        return { enabled: true, source: "client-override" };
    }

    return { enabled: false, source: "disabled" };
};

const readClientOverride = (): Readonly<{ queryValue?: string; localStorageValue?: string }> => {
    if (typeof window === "undefined") {
        return {};
    }

    let queryValue: string | undefined = undefined;
    try {
        const searchParams = new URLSearchParams(window.location.search);
        queryValue = searchParams.get("debugLogging") ?? undefined;
    } catch {
        // ignore
    }

    let localStorageValue: string | undefined = undefined;
    try {
        localStorageValue = window.localStorage.getItem("enableDebugLogging") ?? undefined;
    } catch {
        // ignore
    }

    return { queryValue, localStorageValue };
};

export const shouldLogDebugNow = (): DebugDecision => {
    const nodeEnv = (process.env.NODE_ENV ?? "production") as "development" | "production";
    const runtime: "server" | "client" = typeof window === "undefined" ? "server" : "client";

    const client = readClientOverride();

    return decideDebugLogging({
        nodeEnv,
        runtime,
        enableDebugLoggingEnv: process.env.ENABLE_DEBUG_LOGGING,
        clientQueryValue: client.queryValue,
        clientLocalStorageValue: client.localStorageValue,
    });
};
