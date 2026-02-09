import "server-only";
import crypto from "crypto";
import type { NextRequest } from "next/server";

export const DEFAULT_INTERNAL_TOKEN_HEADER = "x-internal-token" as const;
export const DEFAULT_INTERNAL_TOKEN_ENV = "INTERNAL_REVALIDATE_TOKEN" as const;

type AuthConfig = {
    readonly headerName?: string;
    readonly envVarName?: string;
};

const timingSafeEqualUtf8 = (left: string, right: string): boolean => {
    const leftBuffer = Buffer.from(left, "utf8");
    const rightBuffer = Buffer.from(right, "utf8");

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export const isInternalAuthorized = (request: NextRequest, config: AuthConfig = {}): boolean => {
    const headerName = config.headerName ?? DEFAULT_INTERNAL_TOKEN_HEADER;
    const envVarName = config.envVarName ?? DEFAULT_INTERNAL_TOKEN_ENV;

    const expectedToken = process.env[envVarName];

    if (!expectedToken || expectedToken.trim().length === 0) {
        return false;
    }

    const providedToken = request.headers.get(headerName);

    if (!providedToken) {
        return false;
    }

    return timingSafeEqualUtf8(providedToken, expectedToken);
};
