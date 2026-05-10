import { appLogger } from "@/app/_common/logging/appLogger";
import type { ParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import type { Result } from "@/app/stillinger/_common/lib/ad-model/core/result";

export function unwrapOk<T>(r: Result<T, ParseError>): T {
    if (!r.ok) {
        appLogger.error("Expected Ok, got Err", { err: r.error, component: "unwrapOk" });
        throw new Error(`Expected Ok, got Err: ${r.error.summary}`);
    }
    return r.data;
}
