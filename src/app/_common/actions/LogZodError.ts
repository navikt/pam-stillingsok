import "server-only";
import logger from "@/app/_common/utils/logger";
import { ZodError } from "zod";

export function logZodError(id: string, error: ZodError): void {
    logger.info("ZodError", { id: id, error: error });
}
