import "server-only";
import logger from "@/app/stillinger/_common/utils/logger";
import { ParseError, ZodIssueLite } from "@/app/stillinger/_common/lib/ad-model";

export function logZodError(parseError: ParseError): void {
    const preview = compactIssues(parseError.issues);
    logger.info({
        message: "SchemaMismatch",
        event: "SchemaMismatch",
        issueCount: parseError.issues.length,
        summary: parseError.summary,
        id: parseError.id,
        index: parseError.index,

        // behold originalen (kan bli droppet av ingest)
        issues: parseError.issues,

        // legg til flate alternativer som _blir_ indeksert/visbare
        issues_compact: preview, // array av “flate” objekter
        issues_preview: issuesPreviewString(parseError.issues), // én kort streng
        issues_json: JSON.stringify(preview), // streng fallback
    });
}

function compactIssues(issues: readonly ZodIssueLite[], max = 8) {
    return issues.slice(0, max).map((i) => ({
        p: i.path, // kort nøkkelnavn
        c: i.code,
        m: i.message,
    }));
}

function issuesPreviewString(issues: readonly ZodIssueLite[], max = 5) {
    return issues
        .slice(0, max)
        .map((i) => `${i.path} [${i.code}] ${i.message}`)
        .join(" | ");
}
