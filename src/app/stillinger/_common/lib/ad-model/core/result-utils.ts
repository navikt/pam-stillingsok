import { type Result } from "@/app/stillinger/_common/lib/ad-model/core/result";
import { type ParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";

export function unwrapOk<T>(r: Result<T, ParseError>): T {
    if (!r.ok) {
        throw new Error(`Expected Ok, got Err: ${r.error.summary}`);
    }
    return r.data;
}
