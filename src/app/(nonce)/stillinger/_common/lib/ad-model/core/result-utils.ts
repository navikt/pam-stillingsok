import { type Result } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/result";
import { type ParseError } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/error-types";
import logger from "@/app/(nonce)/stillinger/_common/utils/logger";

export function unwrapOk<T>(r: Result<T, ParseError>): T {
    if (!r.ok) {
        logger.error(r.error.issues);
        throw new Error(`Expected Ok, got Err: ${r.error.summary}`);
    }
    return r.data;
}
