import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { ParseError, ZodIssueLite } from "@/app/stillinger/_common/lib/ad-model";

export function logZodError(parseError: ParseError): void {
    const preview = compactIssues(parseError.issues);

    appLogger.info("SchemaMismatch", {
        issueCount: parseError.issues.length,
        summary: parseError.summary,
        id: parseError.id,
        index: parseError.index,
        issues_preview: issuesPreviewString(parseError.issues), // én kort streng
        issues_json: JSON.stringify(preview), // streng fallback
    });
}

function compactIssues(issues: readonly ZodIssueLite[], max = 8) {
    return issues.slice(0, max).map((i) => ({
        path: i.path,
        code: i.code,
        message: i.message,
    }));
}

function issuesPreviewString(issues: readonly ZodIssueLite[], max = 5) {
    return issues
        .slice(0, max)
        .map((i) => `${i.path} [${i.code}] ${i.message}`)
        .join(" | ");
}
