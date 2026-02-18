import { type Result } from "@/app/stillinger/_common/lib/ad-model/core/result";
import { type ParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { logger } from "@navikt/next-logger";

export function unwrapOk<T>(r: Result<T, ParseError>): T {
    if (!r.ok) {
        logger.error(new Error("Excpected Ok, got Err", { cause: r.error }));
        throw new Error(`Expected Ok, got Err: ${r.error.summary}`);
    }
    return r.data;
}
