import "server-only";
import logger from "@/app/stillinger/_common/utils/logger";
type Meta = Record<string, unknown>;

export function logZodError(meta: Meta): void {
    logger.info("SchemaMismatch", meta);
}
